import { useAuth } from "@/features/Auth/hooks/useAuth";
import { getVideoMetaData } from "@/lib/utils";
import { firestore } from "@/services/firebase";
import { logError, logInfo, logWarning } from "@/services/logging";
import {
  setFile,
  setUploadId,
  setVideo,
} from "@/store/reducers/reelUploadReducer";
import {
  selectFile,
  selectUploadId,
} from "@/store/selectors/reelUploadSelectors";
import { UpChunk, createUpload } from "@mux/upchunk";
import {
  collection,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import {
  ChangeEvent,
  DragEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import {
  cancelUpload,
  getUploadUrl,
  onReelBlacklist,
} from "../services/callable";
import { VideoInfo } from "../types";
import { AppDispatch } from "@/store";
import { createSHA256 } from "hash-wasm";

interface ReturnType {
  progress: number;
  uploadId: string | null;
  isCancelling: boolean;
  isUploading: boolean;
  uploadError: string;
  file: File | null;
  handleFileChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleFileDrop: (e: DragEvent<HTMLLabelElement>) => void;
  cancelReelUpload: () => void;
}

const maxVideoSizeAllowed = import.meta.env.VITE_MAX_UPLOAD_VIDEO_SIZE;
const maxVideoDuration = import.meta.env.VITE_MAX_UPLOAD_VIDEO_DURATION;
const minVideoDuration = import.meta.env.VITE_MIN_UPLOAD_VIDEO_DURATION;
const videoAspectRatio = import.meta.env.VITE_UPLOAD_VIDEO_ASPECT_RATIO;

// Function to calculate file hash
const calculateFileHash = async (file: File): Promise<string> => {
  const hashFn = await createSHA256();
  const chunkSize = 24 * 1024 * 1024; // 24 MB chunks
  let offset = 0;

  while (offset < file.size) {
    const chunk = file.slice(offset, offset + chunkSize);
    const arrayBuffer = await chunk.arrayBuffer();
    hashFn.update(new Uint8Array(arrayBuffer));
    offset += chunk.size;
  }

  return hashFn.digest("hex");
};

export const useVideoUpload = (onUploadSuccess?: () => void): ReturnType => {
  const [progress, setProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isCancelling, setisCancelling] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string>("");
  const [uploadUrl, setUploadUrl] = useState<string | null>(null);

  const file = useSelector(selectFile);
  const { user } = useAuth();
  const { t } = useTranslation();
  const uploadRef = useRef<UpChunk | null>(null);
  const draftId = useSelector(selectUploadId);
  const dispatch = useDispatch<AppDispatch>();
  const [fileHash, setFileHash] = useState<string | null>(null);

  // Function to validate video file before uploading
  const validateVideoFile = useCallback(
    async (file: File): Promise<boolean> => {
      setUploadError("");
      const isVideoFile = file.type.startsWith("video/");
      if (!isVideoFile) {
        setUploadError(t("reelUpload_error_unsupportedType"));
        return false;
      }
      const { duration, aspectRatio } = await getVideoMetaData(file);

      if (duration < minVideoDuration) {
        setUploadError(
          t("reelUpload_error_lowVideoDuration", {
            videoDuration: minVideoDuration,
          })
        );
        return false;
      }

      if (duration > maxVideoDuration) {
        setUploadError(t("reelUpload_error_wrongVideoDuration"));
        return false;
      }

      const isFileSizeOverLimit = file.size > maxVideoSizeAllowed;
      if (isFileSizeOverLimit) {
        setUploadError(t("reelUpload_error_wrongSize", { maxSize: 1 }));
        return false;
      }

      const [width, height] = videoAspectRatio.split(":");
      const difference = Math.abs(aspectRatio - width / height);

      if (difference >= 0.01) {
        setUploadError(
          t("reelUpload_error_wrongAspectRatio", {
            aspectRatio: `${width + ":" + height}`,
          })
        );
        return false;
      }

      // No errors
      return true;
    },
    [t]
  );

  const fetchUploadUrl = useCallback(async () => {
    const { data } = await getUploadUrl();
    const uploadId = data.id;
    dispatch(setUploadId(uploadId));
    setUploadUrl(data.url);
    return data.url;
  }, [dispatch]);

  const handleUpload = useCallback(
    (file: File, uploadUrl: string) => {
      const upload = createUpload({
        endpoint: uploadUrl,
        file: file,
        dynamicChunkSize: true,
      });

      uploadRef.current = upload;

      upload.on("error", (error) => {
        setUploadError(error.detail);
        setIsUploading(false);
        dispatch(setFile(null));
        setProgress(0);
      });

      upload.on("progress", (progress) => {
        setProgress(progress.detail);
      });

      upload.on("success", () => {
        logInfo("Upload success. Video is not ready yet.");
      });
    },
    [dispatch]
  );

  const cancelReelUpload = useCallback(async () => {
    try {
      if (draftId) {
        setisCancelling(true);
        const { data } = await cancelUpload({ uploadId: draftId });
        uploadRef.current?.abort();
        logInfo(`${data.id} upload cancelled.`);
        setIsUploading(false);
        setProgress(0);
        dispatch(setFile(null));
        dispatch(setUploadId(null));
      }
    } catch (error) {
      logError(error);
    } finally {
      setisCancelling(false);
    }
  }, [draftId, dispatch]);

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (fileList && fileList.length > 0) {
      const videoFile = fileList[0];
      dispatch(setFile(videoFile));
      e.target.value = "";
    }
  };

  const handleFileDrop = async (e: DragEvent<HTMLLabelElement>) => {
    // Prevent default behavior (Prevent file from being opened)
    e.preventDefault();

    // Extracts the file from the drag event data transfer items or files
    const file = e.dataTransfer.items
      ? e.dataTransfer.items[0].getAsFile()
      : e.dataTransfer.files[0];

    dispatch(setFile(file));
  };

  // Effect to listen for changes in draft status
  useEffect(() => {
    if (!user) return;
    const tempReelsQuery = query(
      collection(firestore, "reels"),
      where("creatorId", "==", user.uid),
      where("type", "==", "temp"),
      // To prevent listener from picking up reel that is not being uploaded fully (reason can be tab closed, network issue etc)
      where("status", "==", "ready"),
      orderBy("uploaded_at", "desc"),
      limit(1)
    );

    const unsubscribe = onSnapshot(tempReelsQuery, async (snap) => {
      if (snap.empty) {
        logWarning("No temp reels found for the user.");
        return;
      }
      const doc = snap.docs[0];
      const draftData = { id: doc.id, ...doc.data() } as VideoInfo;
      dispatch(setVideo(draftData));
      if (!draftId) dispatch(setUploadId(draftData.id));
      const status = draftData.status;
      if (status === "errored") {
        if (draftData.errorType === "invalid_input")
          setUploadError(t("reelUpload_error_unsupportedType"));
        unsubscribe();
      }
      if (status === "ready") {
        setIsUploading(false);
        dispatch(setFile(null));
        setProgress(0);
        onUploadSuccess?.();
        await updateDoc(doc.ref, { fileHash });
        unsubscribe();
      }
    });

    // Cleanup function
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [draftId, user, onUploadSuccess, dispatch, fileHash, t]);

  // Effect to initiate upload when both file and uploadUrl are available
  useEffect(() => {
    const initiateUpload = async () => {
      setIsUploading(true);

      // If we don't have a draft id or uploadUrl, fetch the uploadUrl
      if (file && !uploadUrl && !draftId) {
        await fetchUploadUrl();
        return;
      }

      // If we dont have a file or uploadUrl, we're not uploading
      if (!file || !uploadUrl) {
        setIsUploading(false);
        return;
      }

      // Verify the file before uploading
      const isValidFile = await validateVideoFile(file);
      if (!isValidFile) {
        dispatch(setFile(null));
        setUploadUrl(null);
        setIsUploading(false);
        return;
      }

      // Check file hash in blacklist collection
      const fileHash = await calculateFileHash(file);
      const blacklistColl = collection(firestore, "blacklist");
      const fileHashQuery = query(
        blacklistColl,
        where("fileHash", "==", fileHash)
      );
      const querySnapshot = await getDocs(fileHashQuery);

      // If the reel is blacklisted, flag the upload attempt and bail out
      if (!querySnapshot.empty) {
        await onReelBlacklist({ reelId: draftId! });
        setUploadError(t("reelUpload_error_blacklisted"));
        setIsUploading(false);
        dispatch(setFile(null));
        setProgress(0);
        return;
      }

      // Handle the file hash and initiate the upload
      setFileHash(fileHash);
      setUploadError("");
      handleUpload(file, uploadUrl);
    };

    initiateUpload();
  }, [
    file,
    uploadUrl,
    validateVideoFile,
    fetchUploadUrl,
    handleUpload,
    dispatch,
    draftId,
    t,
  ]);

  return {
    progress,
    uploadId: draftId,
    isUploading,
    isCancelling,
    uploadError,
    file,
    handleFileChange,
    handleFileDrop,
    cancelReelUpload,
  };
};
