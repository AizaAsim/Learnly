import { z, ZodError } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChangeEvent, FC, useEffect, useMemo, useRef, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Trans, useTranslation } from "react-i18next";

// Services
import { logError } from "@/services/logging";

// Custom Hooks
import { useAuth } from "@/features/Auth/hooks/useAuth";
import { useAvatar } from "@/features/Profile/hooks/useAvatar";

// UI Components
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Error } from "@/components/ui/error";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage } from "@/components/ui/avatar.tsx";

// Assets
import dummyAvatar from "@/assets/avatar.png";

// profile image picker props interface
interface ProfileImagePickerProps {
  existingFile: string | null;
  labelText: string;
  description?: string;
  buttonText: string;
  buttonTextAfterFileUpload?: string;
  closeModel: () => void;
}

export const ProfileImagePicker: FC<ProfileImagePickerProps> = ({
  existingFile = null,
  labelText,
  description,
  closeModel,
  buttonText,
  buttonTextAfterFileUpload,
}) => {
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { user } = useAuth();
  const {
    isLoading,
    updateAvatarUrl,
    error,
    clearError,
    resizeImage,
    getStoragePath,
  } = useAvatar();
  const { t } = useTranslation();

  const MAX_FILE_SIZE = 1024 * 1024 * 1024;

  const ACCEPTED_IMAGE_MIME_TYPES = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
  ];

  const schema = z.object({
    file: z
      .any()
      .refine((file) => !!file, t("profile_error_fileRequired"))
      .refine(
        (file) => file.size <= MAX_FILE_SIZE,
        t("profile_error_wrongSize")
      )
      .refine(
        (file) => ACCEPTED_IMAGE_MIME_TYPES.includes(file.type),
        t("profile_error_unsupportedImage")
      ),
  });

  type ProfileFormSchema = z.infer<typeof schema>;

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    setError,
    clearErrors,
    setValue,
    reset,
    trigger,
  } = useForm<ProfileFormSchema>({
    mode: "onChange",
    defaultValues: {
      file: "",
    },
    resolver: zodResolver(schema),
  });

  const handleFileInputChange = async (e: ChangeEvent<HTMLInputElement>) => {
    reset();
    const file = e.target.files ? e.target.files[0] : null;
    setValue("file", file);
    trigger("file");
    setSelectedFile(file ? URL.createObjectURL(file) : null);
  };

  const handleButtonClick = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const onSubmit: SubmitHandler<ProfileFormSchema> = async (files) => {
    try {
      const resizedImage = (await resizeImage(files.file, 100, 100)) as Blob;
      if (!user) return;
      const storagePath = getStoragePath(user.role, user.uid);
      await updateAvatarUrl(user, storagePath, resizedImage);
      setSelectedFile(URL.createObjectURL(files.file));
      closeModel();
    } catch (error) {
      logError(error);
      if (error instanceof ZodError) {
        setError("root", {
          type: "manual",
          message: error.message,
        });
      }
    }
  };
  // ** Memoization
  const isDisabled = useMemo(() => {
    return isLoading || isSubmitting;
  }, [isLoading, isSubmitting]);

  // Update the local error state with the backend auth errors
  // Be careful when trying to clear the error. You have to clear it in the parent component
  // then clear it in the form.
  useEffect(() => {
    if (error) {
      setError("root", {
        type: "manual",
        message: error,
      });
    }
  }, [error, setError]);

  const onFocus = () => {
    clearError();
    clearErrors("root");
  };

  const errorMessage = errors.file && errors.file.message;
  const hasValidFile = !!selectedFile && !errors.file;

  return (
    <form
      className="relative mx-auto mb-1 flex flex-col items-center w-full"
      onSubmit={handleSubmit(onSubmit)}
    >
      <Input
        id="file"
        type="file"
        {...register("file")}
        accept=".png, .jpeg,.jpg, .webp"
        ref={fileInputRef}
        onFocusCapture={onFocus}
        className="hidden"
        onChange={handleFileInputChange}
      />
      <div
        className="rounded-[30%] h-[112px] w-[112px] mx-auto absolute -top-[100px] border border-white cursor-pointer bg-white"
        onClick={handleButtonClick}
      >
        <Avatar className="w-full h-full">
          <AvatarImage
            src={
              hasValidFile
                ? selectedFile
                : existingFile
                  ? existingFile
                  : dummyAvatar
            }
            className="rounded-[30%] object-cover"
            alt="Profile Picture"
          />
        </Avatar>
        <div className="absolute bottom-0 right-0 bg-[#e0e0e0] p-1.5 border-[3px] border-white rounded-full">
          <img
            src={existingFile ? "/icon/pencil-edit.svg" : "/icon/camera.svg"}
            className="h-4 w-4"
          />
        </div>
      </div>
      <div className="flex flex-col gap-2 text-center mt-[30px] md:mt-[22px] mb-8 md:mb-6">
        {typeof errorMessage === "string" && (
          <Error className="text-center">{errorMessage}</Error>
        )}
        <Label
          color="black"
          className="font-bold text-xl md:text-2xl leading-[26px] md:leading-7"
        >
          {labelText}
        </Label>
        {description && (
          <p className="text-[15px] font-medium -tracking-[0.225px] text-grayscale-60">
            {description}
          </p>
        )}
      </div>
      <Button
        type={hasValidFile ? "submit" : "button"}
        onClick={hasValidFile ? () => {} : handleButtonClick}
        color="black"
        className="w-11/12 rounded-2xl py-7 z-1 font-semibold	text-[15px] md:text-base leading-5 md:leading-[22px]"
        disabled={isDisabled}
        onFocus={onFocus}
      >
        {hasValidFile ? buttonTextAfterFileUpload || buttonText : buttonText}
      </Button>
      <Button
        type="button"
        onClick={closeModel}
        color=""
        className="z-1 bg-transparent hover:bg-transparent text-dark-T50 text-[15px] md:text-base leading-5 md:leading-[22px] font-semibold p-0 mt-2"
        onFocus={onFocus}
      >
        <Trans i18nKey="profileImagePicker_button_cancel" />
      </Button>
    </form>
  );
};
