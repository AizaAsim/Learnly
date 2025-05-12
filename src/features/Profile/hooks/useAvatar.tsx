import { useContext, useState, useCallback, useEffect } from "react";
import { User, onAuthStateChanged } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { auth, firestore, storage } from "@/services/firebase";
import { logError } from "@/services/logging";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { UserContext } from "@/features/Auth/contexts/UserContext";
import { FirebaseError } from "firebase/app";
import { Roles } from "../../Auth/types";

export function useAvatar() {
  // ** State
  const [isLoading, setIsLoading] = useState(true);

  // ** Context
  const context = useContext(UserContext);

  // ** Hooks
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, () => {
      setIsLoading(false);
    });

    // Cleanup subscription
    return () => unsubscribe();
  }, []);

  // ** Callbacks

  const updateAvatarUrl = useCallback(
    async (user: User, storagePath: string, resizedImage: Blob) => {
      try {
        setIsLoading(true);
        const userDoc = doc(firestore, "users", user.uid);
        const storageRef = ref(storage, storagePath);
        await uploadBytes(storageRef, resizedImage);
        const avatar_url = await getDownloadURL(storageRef);
        await updateDoc(userDoc, {
          avatar_url,
        });
      } catch (e) {
        logError(e);
        context?.setError((e as FirebaseError).message);
      } finally {
        setIsLoading(false);
      }
    },
    [setIsLoading, context]
  );

  const getFileExtension = useCallback((fileName: string): string | null => {
    const parts = fileName.split(".");
    if (parts.length === 1 || (parts[0] === "" && parts.length === 2)) {
      return null;
    }
    return parts.pop()!.toLowerCase();
  }, []);

  const getStoragePath = useCallback((currentRole: string, userId: string) => {
    let path = "";
    if (currentRole === Roles.USER) {
      path = `users/${userId}/images/avatars/current-avatar`;
    } else if (currentRole === Roles.CREATOR) {
      path = `creators/${userId}/images/avatars/current-avatar`;
    }
    return path;
  }, []);

  const resizeImage = useCallback(
    (file: File, maxWidth: number, maxHeight: number): Promise<Blob> => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          const img = new Image();
          img.src = reader.result as string;
          img.onload = () => {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");
            if (!ctx) {
              reject(new Error("Failed to get 2D context"));
              return;
            }
            let width = img.width;
            let height = img.height;
            if (width > height) {
              if (width > maxWidth) {
                height *= maxWidth / width;
                width = maxWidth;
              }
            } else {
              if (height > maxHeight) {
                width *= maxHeight / height;
                height = maxHeight;
              }
            }
            canvas.width = width;
            canvas.height = height;
            ctx.drawImage(img, 0, 0, width, height);
            canvas.toBlob((resizedBlob) => {
              if (!resizedBlob) {
                reject(new Error("Failed to create blob"));
                return;
              }
              resolve(resizedBlob);
            }, file.type);
          };
          img.onerror = (error) => {
            reject(error);
          };
        };
        reader.onerror = (error) => {
          reject(error);
        };
      });
    },
    []
  );
  const clearError = useCallback(() => context?.setError(""), [context]);

  return {
    isLoading,
    error: context?.error,
    clearError,
    hasError: !!context?.error,
    updateAvatarUrl,
    getStoragePath,
    resizeImage,
    getFileExtension,
  };
}
