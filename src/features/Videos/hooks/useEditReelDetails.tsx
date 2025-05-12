import { useAuth } from "@/features/Auth/hooks/useAuth";
import { useVideoUploadModals } from "@/features/Videos/hooks/useVideoUploadModals";
import { useModal } from "@/hooks/useModal";
import { logError } from "@/services/logging";
import {
  resetUpload,
  setDescription,
  setLink,
} from "@/store/reducers/reelUploadReducer";
import {
  selectDescription,
  selectLink,
  selectScheduleDateAsString,
  selectScheduleTime,
  selectVideo,
} from "@/store/selectors/reelUploadSelectors";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChangeEvent, useCallback, useState } from "react";
import { useForm, useFormState } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { z } from "zod";
import pickBy from "lodash-es/pickBy";
import { handleVideoState } from "../services/callable";
import { useToast } from "@/components/ui/use-toast";
import { FirebaseError } from "firebase/app";
import { fetchMyVideoData } from "@/store/reducers/myVideosReducer";
import { AppDispatch } from "@/store";
import { useScheduleDateValidator } from "./useScheduleDateValidator";

const maxDescriptionLength = parseInt(
  import.meta.env.VITE_MAX_DESCRIPTION_LENGTH
);

const schema = z.object({
  description: z
    .string()
    .max(maxDescriptionLength, "reelUpload_editDetails_description_error")
    .optional(),
  link: z
    .string()
    .optional()
    .refine(
      (value) =>
        !value ||
        /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})(\/[\w.-]*)*\/?$/.test(
          value
        ),
      {
        message: "reelUpload_editDetails_link_error",
      }
    ),
});

type FormData = z.infer<typeof schema>;

export const useEditReelDetails = () => {
  const { toast } = useToast();
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const { openPostLive } = useVideoUploadModals();
  const { closeModal, setOnCloseModal } = useModal();
  const { user } = useAuth();
  const { validateScheduleDate } = useScheduleDateValidator();
  const [isSavingDraft, setIsSavingDraft] = useState(false);

  const scheduleDate = useSelector(selectScheduleDateAsString);
  const scheduleTime = useSelector(selectScheduleTime);
  const video = useSelector(selectVideo);
  const description = useSelector(selectDescription);
  const link = useSelector(selectLink);

  const descriptionLength = description.length;

  const isScheduled = scheduleDate && scheduleTime;

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    trigger,
    control,
  } = useForm<FormData>({
    mode: "onChange",
    resolver: zodResolver(schema),
    defaultValues: { description, link },
  });

  const { isSubmitting: isPublishingOrScheduling } = useFormState({ control });

  const onSubmit = useCallback(
    async (data: FormData) => {
      if (!user || !video?.id || video.status !== "ready") return;
      // Remove empty fields
      const filteredData = pickBy(data, Boolean);
      try {
        if (isScheduled) {
          const scheduledAt = new Date(`${scheduleDate} ${scheduleTime}`);
          if (!validateScheduleDate(scheduledAt)) return;

          await handleVideoState({
            action: "schedule",
            videoId: video.id,
            reelData: { ...filteredData, scheduledAt },
          });
        } else {
          await handleVideoState({
            action: "publish",
            videoId: video.id,
            reelData: filteredData,
          });
        }
        if (!isScheduled) openPostLive();
        else {
          dispatch(resetUpload());
          setOnCloseModal(undefined);
          closeModal();
          toast({ text: t("reelUpload_schedulePost_success"), variant: "success" });
        }
        dispatch(fetchMyVideoData());
      } catch (error) {
        logError(error);
        let message = "Something went wrong";
        if (error instanceof FirebaseError) {
          message = error.message;
        }
        toast({
          text: message,
        });
      } 
    },
    [
      user,
      video,
      scheduleDate,
      scheduleTime,
      dispatch,
      t,
      closeModal,
      setOnCloseModal,
      openPostLive,
      isScheduled,
      toast,
      validateScheduleDate,
    ]
  );

  const handleDescriptionChange = useCallback(
    (event: ChangeEvent<HTMLTextAreaElement>) => {
      const description = event.target.value;
      dispatch(setDescription(description));
    },
    [dispatch]
  );

  const handleLinkChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const link = event.target.value;
      dispatch(setLink(link));
    },
    [dispatch]
  );

  const handleSaveDraft = useCallback(async () => {
    if (!user || !video?.id) return;
    let loadingToast;
    try {
      trigger();
      const data = schema.parse(getValues());
      // Remove empty fields
      const filteredData = pickBy(data, Boolean);
      setIsSavingDraft(true);
      loadingToast = toast({
        text: "Saving the draft",
      });
      await handleVideoState({
        action: "draft",
        videoId: video.id,
        reelData: filteredData,
      });
      dispatch(resetUpload());
      dispatch(fetchMyVideoData());
      setOnCloseModal(undefined);
      closeModal();
      toast({
        text: t("reelUpload_draft_saved_success"),
        variant: "success",
      });
    } catch (error) {
      logError(error);
      let message = "Failed to save draft";
      if (error instanceof FirebaseError) {
        message = error.message;
      }
      toast({
        text: message,
      });
    } finally {
      setIsSavingDraft(false);
      loadingToast?.dismiss();
    }
  }, [
    user,
    video,
    getValues,
    trigger,
    dispatch,
    setOnCloseModal,
    closeModal,
    t,
    toast,
  ]);

  return {
    register,
    handleSubmit,
    onSubmit,
    handleDescriptionChange,
    handleLinkChange,
    handleSaveDraft,
    descriptionLength,
    maxDescriptionLength,
    errors,
    scheduleDate,
    scheduleTime,
    isPublishingOrScheduling,
    isSavingDraft,
    link,
    description,
  };
};
