import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  ChangeEvent,
} from "react";
import { updateUser } from "@/features/Settings/services/callable.ts";
import { useAuth } from "@/features/Auth/hooks/useAuth.tsx";
import { SubmitHandler, useForm } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea.tsx";
import { zodResolver } from "@hookform/resolvers/zod";
import { Trans, useTranslation } from "react-i18next";
import dummyAvatar from "@/assets/avatar.png";
import { Error } from "@/components/ui/error.tsx";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label.tsx";
import { logError } from "@/services/logging.ts";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { IoAlertCircle } from "react-icons/io5";
import { useModal } from "@/hooks/useModal.tsx";
import { FirebaseError } from "firebase/app";
import { cn } from "@/lib/utils";
import { z } from "zod";
import EmailVerificationModal from "@/features/Settings/components/EmailVerificationModal.tsx";
import { useDeviceType } from "@/hooks/useDeviceType.tsx";
import { useToast } from "@/components/ui/use-toast";
import { createNameFieldsValidations } from "@/features/Auth/services/validations";
import { Roles } from "@/features/Auth/types";
import { useUpdateEmailModals } from "../hooks/useUpdateEmailModals";
import { useSelector } from "react-redux";
import { selectCreatorEmail } from "@/store/selectors/creatorProfileSelectors";
import { useAvatar } from "@/features/Profile/hooks/useAvatar";

const EducationalElementSVG = ({ className }: { className?: string }) => (
  <svg
    className={cn("text-accentGold opacity-10", className)}
    width="80"
    height="80"
    viewBox="0 0 80 80"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <text x="32" y="30" fontSize="30" fill="currentColor">∑</text>
    <text x="15" y="50" fontSize="28" fill="currentColor">π</text>
    <text x="50" y="55" fontSize="24" fill="currentColor">√</text>
  </svg>
);

const maxBioLength = import.meta.env.VITE_MAX_BIO_LENGTH;

interface CreatorProfileCardProps {
  className?: string;
}

export const EditProfile = ({ className }: CreatorProfileCardProps) => {
  const { clearError, isLoading, user, sendEmailVerificationEmail } = useAuth();
  const { setModal, isOpen, openModal } = useModal();
  const { t } = useTranslation();
  const { isMobile } = useDeviceType();
  const { toast } = useToast();
  const { openUpdateEmailModal } = useUpdateEmailModals();
  const updatedEmail = useSelector(selectCreatorEmail);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { updateAvatarUrl, resizeImage, getStoragePath } = useAvatar();
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  // ** Form Schema
  const nameValidations = createNameFieldsValidations(t);
  const schema = z.object({
    name: nameValidations.displayName,
    username:
      user?.role !== Roles.USER
        ? nameValidations.username
        : z.string().optional(),
    email: z.string().email(t("settings_editProfileForm_error_emailInvalid")),
    bio: z
      .string()
      .max(
        maxBioLength,
        t("settings_editProfileForm_error_charactersLimitReached")
      )
      .optional(),
  });
  type EditProfileFormSchema = z.infer<typeof schema>;

  // ** Hooks
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty, isValid },
    reset,
    setError,
    setValue,
    clearErrors,
    watch,
  } = useForm<EditProfileFormSchema>({
    mode: "onChange",
    defaultValues: {
      name: user?.displayName,
      username: user?.username,
      email: user?.email || "",
      bio: user?.bio || "",
    },
    resolver: zodResolver(schema),
  });

  const nameValue = watch("name");
  const usernameValue = watch("username");
  const emailValue = watch("email");
  const bioValue = watch("bio");

  const isDisabled = useMemo(() => {
    return (
      isLoading ||
      isSubmitting ||
      !isDirty ||
      !isValid ||
      Object.keys(errors).length > 0
    );
  }, [isLoading, isSubmitting, errors, isValid, isDirty]);

  useEffect(() => {
    if (updatedEmail) {
      setValue("email", updatedEmail);
    }
  }, [updatedEmail, setValue]);

  const isEmailChanged = useMemo(() => {
    return (
      emailValue.trim().toLowerCase() !== user?.email?.trim().toLowerCase()
    );
  }, [emailValue, user?.email]);

  const resetForm = () => {
    reset({
      name: nameValue,
      username: usernameValue,
      email: emailValue,
      bio: bioValue,
    });
  };

  // ** Handlers
  const onSubmit: SubmitHandler<EditProfileFormSchema> = async (values) => {
    try {
      if (isEmailChanged) {
        await updateUser({
          displayName: values.name.trim(),
          username: values.username ? values.username.trim().toLowerCase() : "",
          email: values.email.trim().toLowerCase(),
          bio: values.bio || "",
        });
        resetForm();
        toast({
          text: t("settings_editProfileForm_success_emailVerification"),
        });
        await sendEmailVerificationEmail(emailValue);
        openEmailVerificationModal();
      } else {
        await updateUser({
          displayName: values.name.trim(),
          username: values.username ? values.username.trim().toLowerCase() : "",
          email: values.email.trim().toLowerCase(),
          bio: values.bio || "",
        });
        resetForm();
        toast({
          text: t("settings_editProfileForm_success"),
          variant: "success",
        });
      }
    } catch (e) {
      logError(e);
      if ((e as FirebaseError).code === "functions/already-exists") {
        // eslint-disable-next-line
        // @ts-ignore
        let fieldName = e?.details?.field;
        if (fieldName === "displayName") fieldName = "name";
        if (fieldName) {
          setError(fieldName as keyof EditProfileFormSchema, {
            type: "manual",
            message: t(
              `settings_editProfileForm_error_${fieldName}AlreadyExists`
            ),
          });
        }
      } else {
        toast({
          text: (e as FirebaseError).message,
          variant: "destructive",
          duration: 5000,
        });
      }
    }
  };

  const onFocus = () => {
    clearError();
    clearErrors("root");
  };

  const bioLength = useMemo(() => {
    return bioValue?.length || 0;
  }, [bioValue]);

  const handleFileInputChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file && user) {
      try {
        const resizedImage = (await resizeImage(file, 100, 100)) as Blob;
        const storagePath = getStoragePath(user.role, user.uid);
        await updateAvatarUrl(user, storagePath, resizedImage);
        setSelectedFile(URL.createObjectURL(file));
      } catch (error) {
        logError(error);
      }
    }
  };

  const openEmailVerificationModal = () => {
    if (!isOpen) {
      setModal(<EmailVerificationModal newEmail={emailValue} />);
      openModal();
    }
  };

  const onEditingEmailField = useCallback(async () => {
    openUpdateEmailModal();
  }, [openUpdateEmailModal]);

  const handleAvatarEditClick = useCallback(() => {
    if (fileInputRef.current) fileInputRef.current.click();
  }, [fileInputRef]);

  return (
    <div className={cn("text-center relative", className)}>
      {/* Decorative elements */}
      <EducationalElementSVG className="absolute -bottom-10 -right-20 -z-10 hidden md:block" />

      {/* Background education-themed pattern */}
      <div className="absolute inset-0 -z-20 opacity-5 pointer-events-none hidden md:block">
        <div className="absolute top-10 left-10">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <circle cx="10" cy="10" r="10" fill="#1E3A8A" />
          </svg>
        </div>
        <div className="absolute top-40 right-20">
          <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
            <rect width="15" height="15" fill="#F59E0B" />
          </svg>
        </div>
        <div className="absolute bottom-20 left-40">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <polygon points="10,0 20,20 0,20" fill="#10B981" />
          </svg>
        </div>
      </div>

      {/* Profile header with educational styled graduation cap */}
      <div className="relative rounded-[32px] md:rounded-[41.5px] size-[112px] md:size-[144px] border-4 md:border-[4.5px] border-light-T100 mx-auto mb-6 md:mb-7">
        <Avatar className="w-full h-full">
          <AvatarImage
            src={selectedFile || user?.avatar_url || dummyAvatar}
            className=" object-cover"
            alt="Profile Picture"
          />
        </Avatar>
        {/* Graduation cap decorative element */}
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10 opacity-80 pointer-events-none">
          <svg width="40" height="20" viewBox="0 0 40 20" fill="none">
            <polygon points="20,0 40,10 20,20 0,10" fill="#F59E0B" />
            <rect x="18" y="10" width="4" height="15" fill="#F59E0B" />
          </svg>
        </div>
        <>
          <input
            type="file"
            ref={fileInputRef}
            accept=".png, .jpeg, .jpg, .webp"
            className="hidden"
            onChange={handleFileInputChange}
          />
          <button
            type="button"
            className="absolute bottom-0 right-0 bg-[#e0e0e0] size-[34px] md:size-[50px] border-[3px] border-white rounded-full flex justify-center items-center"
            onClick={handleAvatarEditClick}
          >
            <img
              src="/icon/pencil-edit.svg"
              alt="Edit Avatar"
              className="size-4 md:size-[25px]"
            />
          </button>
        </>
      </div>

      {/* Form with subtle educational styling */}
      <form
        className={`relative flex flex-col justify-center gap-3.5 md:min-w-[442px] ${isMobile && "pb-[37px]"} 
                   bg-white/50 backdrop-blur-sm md:p-6 md:rounded-lg md:shadow-sm`}
        onSubmit={handleSubmit(onSubmit)}
      >
        {/* Field section with subtle book page styling */}
        <div className="md:border-l-2 md:border-primaryBlue/10 md:pl-4">
          <div className="flex flex-col gap-[6px] items-start">
            <Label htmlFor="name" className="flex items-center">
              <div className="w-1.5 h-1.5 rounded-full bg-primaryBlue mr-1.5 hidden md:block"></div>
              <Trans
                i18nKey={
                  user?.role === Roles.USER
                    ? "settings_editProfile_Name"
                    : "settings_editProfile_displayName"
                }
              />
            </Label>
            <Input
              id="name"
              type="text"
              variant={!errors.name ? "styled" : "error"}
              autoComplete="name"
              {...register("name")}
              onFocusCapture={onFocus}
              className="transition-all focus:border-primaryBlue"
            />
            {errors.name && (
              <Error className="flex gap-1 items-center text-xs">
                <img src="/icon/info.svg" alt="info" />
                {errors.name.message}
              </Error>
            )}
          </div>
        </div>

        <div
          className={cn(
            "flex flex-col gap-[6px] items-start md:border-l-2 md:border-primaryBlue/10 md:pl-4",
            user?.role === Roles.USER && "hidden"
          )}
        >
          <Label htmlFor="username" className="flex items-center">
            <div className="w-1.5 h-1.5 rounded-full bg-primaryBlue mr-1.5 hidden md:block"></div>
            <Trans i18nKey="settings_editProfile_username" />
          </Label>
          <Input
            id="username"
            type="text"
            variant={!errors.username ? "styled" : "error"}
            autoComplete="username"
            {...register("username")}
            onFocusCapture={onFocus}
            className="transition-all focus:border-primaryBlue"
          />
          {errors.username && (
            <Error className="flex gap-1 items-center text-xs">
              <img src="/icon/info.svg" alt="info" />
              {errors.username.message}
            </Error>
          )}
        </div>

        <div className="flex flex-col gap-[6px] items-start md:border-l-2 md:border-primaryBlue/10 md:pl-4">
          <Label htmlFor="email" className="flex items-center">
            <div className="w-1.5 h-1.5 rounded-full bg-primaryBlue mr-1.5 hidden md:block"></div>
            <Trans i18nKey="settings_editProfile_email" />
          </Label>
          <Input
            id="email"
            type="email"
            variant={!errors.email ? "styled" : "error"}
            autoComplete="email"
            value={emailValue}
            onChange={onEditingEmailField}
            onFocusCapture={onFocus}
            className="transition-all focus:border-primaryBlue"
          />
          {errors.email && (
            <Error className="flex gap-1 items-center text-xs">
              <img src="/icon/info.svg" alt="info" />
              {errors.email.message}
            </Error>
          )}
        </div>

        <div
          className={cn(
            "relative flex flex-col gap-[6px] items-start md:border-l-2 md:border-primaryBlue/10 md:pl-4",
            user?.role === Roles.USER && "hidden"
          )}
        >
          <Label htmlFor="bio" className="flex items-center">
            <div className="w-1.5 h-1.5 rounded-full bg-primaryBlue mr-1.5 hidden md:block"></div>
            <Trans i18nKey="settings_editProfile_bio" />
          </Label>
          <Textarea
            id="bio"
            className={cn(
              !errors.bio && !errors.root
                ? classes.focusState
                : classes.errorState,
              "transition-all focus:border-primaryBlue"
            )}
            {...register("bio")}
          />
          <span className="absolute bottom-2.5 right-3 text-[11px] text-lightBlue/10 font-medium">
            {bioLength}/{maxBioLength}
          </span>
        </div>
        {errors.bio && (
          <div className="flex gap-2 text-xs font-medium text-red">
            <IoAlertCircle className="w-4 h-4 " />
            <p>{errors.bio.message}</p>
          </div>
        )}

        {errors.root && (
          <Error className="flex gap-1 items-center text-xs">
            <img src="/icon/info.svg" alt="info" />
            {errors.root.message}
          </Error>
        )}

        <div
          className={cn({
            "mt-0.5": isMobile,
            "mt-1": !isMobile,
          })}
        >
          <Button
            className="w-full bg-gradient-to-r from-primaryBlue to-mediumBlue hover:opacity-90 transition-all"
            disabled={isDisabled}
            type="submit"
          >
            <Trans i18nKey="settings_editProfileForm_button_submit" />
          </Button>
        </div>
      </form>

    </div>
  );
};

const classes = {
  errorState: "border-[1.6px] border-solid border-red bg-red-t4",
  focusState:
    "focus-visible:border-[1.6px] focus-visible:border-primaryBlue focus-visible:bg-dark-T2",
  errorMsg: "flex items-center mt-1.5 gap-1",
};