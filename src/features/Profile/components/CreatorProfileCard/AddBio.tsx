import { Button } from "@/components/ui/button";
import { Error } from "@/components/ui/error";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/features/Auth/hooks/useAuth";
import { useModal } from "@/hooks/useModal";
import { cn } from "@/lib/utils";
import { firestore } from "@/services/firebase";
import { logError } from "@/services/logging";
import { doc, setDoc } from "firebase/firestore";
import { ChangeEvent, useCallback, useMemo } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

const maxBioLength = import.meta.env.VITE_MAX_BIO_LENGTH;

interface BioFormInputs {
  bio: string;
}

interface AddBioProps {
  onSave: (bio?: string) => void;
}

export const AddBio = ({ onSave }: AddBioProps) => {
  const { t } = useTranslation(undefined, { keyPrefix: "profileAddBio" });
  const { user } = useAuth();
  const { closeModal } = useModal();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
    setError,
    clearErrors,
  } = useForm<BioFormInputs>({
    mode: "onChange",
    defaultValues: {
      bio: "",
    },
  });

  const bioLength = watch("bio").length;

  const handleBioChange = useCallback(
    (event: ChangeEvent<HTMLTextAreaElement>) => {
      const description = event.target.value;
      const sanitizedDescription = description.replace(/\r?\n|\r/g, "");
      event.target.value = sanitizedDescription;
      setValue("bio", sanitizedDescription);
      if (sanitizedDescription.length > maxBioLength) {
        setError("bio", {
          type: "manual",
          message: t("error"),
        });
        return;
      } else {
        if (errors.bio) clearErrors("bio");
      }
    },
    [clearErrors, errors.bio, setError, setValue, t]
  );

  const isDisabled = useMemo(() => {
    return isSubmitting || Object.keys(errors).length > 0 || !bioLength;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSubmitting, errors, Object.keys(errors).length, bioLength]);

  const onSubmit: SubmitHandler<BioFormInputs> = async (data) => {
    try {
      if (!user) return;
      const userDocRef = doc(firestore, "users", user.uid);
      await setDoc(userDocRef, { bio: data.bio }, { merge: true });
      onSave(data.bio);
      closeModal();
    } catch (error) {
      logError(error);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full flex flex-col items-stretch"
      >
        <div className="mb-4">
          <div className="relative">
            <Textarea
              {...register("bio")}
              onChange={handleBioChange}
              placeholder={t("placeholder")}
              className={cn(
                !errors.bio && !errors.root
                  ? classes.focusState
                  : classes.errorState
              )}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                }
              }}
            />
            <span
              className={cn(
                "absolute bottom-2.5 right-3 text-right text-[11px] text-dark-T40 font-medium leading-4 -tracking-[0.11px]",
                (errors.bio || errors.root) && "text-red"
              )}
            >
              {bioLength}/{maxBioLength}
            </span>
          </div>
          {errors.bio && (
            <Error className={classes.errorMsg}>
              <img src="/icon/info.svg" alt="info" />
              {errors.bio.message}
            </Error>
          )}
        </div>
        <Button type="submit" disabled={isDisabled}>
          {t("button")}
        </Button>
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
