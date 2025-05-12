import { Button } from "@/components/ui/button";
import { useAuth } from "@/features/Auth/hooks/useAuth.tsx";
import { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui/input";
import { Error } from "@/components/ui/error";
import { z } from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { logError } from "@/services/logging";
import { RecoveryMethod, RecoveryMethods } from "@/features/Auth/types";
import { PhoneInput } from "@/components/ui/phone-input";
import { useRecoveryMethodModals } from "@/features/Settings/hooks/useRecoveryMethodModals";
import { createRecoveryMethodsValidations } from "@/features/Auth/services/validations";

interface RecoveryMethodModalProps {
  recoveryMethod: RecoveryMethod;
  existingValue?: string;
}

export const RecoveryMethodModal = ({
  recoveryMethod,
  existingValue,
}: RecoveryMethodModalProps) => {
  const { sendRecoveryMethodOtp } = useAuth();
  const { openRecoveryMethodVerificationModal } = useRecoveryMethodModals();
  const { t } = useTranslation();

  const recoveryMethodValidations = createRecoveryMethodsValidations(t);
  const schema = z.object({
    [recoveryMethod]: recoveryMethodValidations[recoveryMethod],
  });
  type AddRecoveryMethodSchema = z.infer<typeof schema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
    watch,
    setValue,
  } = useForm<AddRecoveryMethodSchema>({
    mode: "onChange",
    defaultValues: {
      [recoveryMethod]: existingValue || "",
    },
    resolver: zodResolver(schema),
  });

  const recoveryMethodValue = watch(recoveryMethod);

  const isDisabled = useMemo(() => {
    return (
      Object.keys(errors).length > 0 ||
      !recoveryMethodValue ||
      (recoveryMethodValue.includes("+") && recoveryMethodValue.length <= 4) ||
      existingValue === recoveryMethodValue
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [errors, recoveryMethodValue, existingValue, Object.keys(errors).length]);

  const handlePhoneValueChange = useCallback(
    (value: string) => {
      setValue("phone", value);
      if (!value) {
        return;
      }
      if (value.includes("+") && value.length <= 4) {
        clearErrors("phone");
        return;
      }
      if (value.length < 10 || value.length > 15) {
        setError("phone", {
          type: "manual",
          message: t("recoveryMethod_modal.error_invalidPhone"),
        });
        return;
      } else {
        clearErrors("phone");
      }
    },
    [clearErrors, setError, setValue, t]
  );

  const onFocus = () => {
    clearErrors();
  };

  const onSubmit: SubmitHandler<AddRecoveryMethodSchema> = useCallback(
    async (values) => {
      try {
        const recoveryValue =
          recoveryMethod === RecoveryMethods.EMAIL
            ? values.email
            : values.phone;

        const result = await sendRecoveryMethodOtp(
          recoveryMethod,
          recoveryValue
        );

        if (result?.isValid) {
          openRecoveryMethodVerificationModal(recoveryMethod, recoveryValue);
        } else {
          recoveryMethod === RecoveryMethods.EMAIL
            ? setError("email", {
              type: "manual",
              message: t(`recoveryMethod_modal.error_invalidEmail`),
            })
            : setError("phone", {
              type: "manual",
              message: t(`recoveryMethod_modal.error_invalidPhone`),
            });
        }
      } catch (e) {
        logError(e);
      }
    },
    [
      openRecoveryMethodVerificationModal,
      recoveryMethod,
      sendRecoveryMethodOtp,
      setError,
      t,
    ]
  );

  return (
    <div>
      <div className="w-full">
        <div className="relative z-[1000000000]">
          {recoveryMethod === RecoveryMethods.EMAIL ? (
            <>
              <Input
                id="email"
                type="email"
                placeholder={t("recoveryMethod_modal.placeholder_email")}
                variant={!errors.email && !errors.root ? "styled" : "error"}
                autoComplete="email"
                {...register("email")}
                onFocusCapture={onFocus}
              />
              {errors.email && (
                <Error className="flex gap-1 items-center mt-1.5">
                  <img src="/icon/info.svg" alt="info" />
                  {errors.email.message}
                </Error>
              )}
            </>
          ) : (
            <>
              <PhoneInput
                value={recoveryMethodValue}
                onChange={handlePhoneValueChange}
                error={!!errors.phone}
              />
              {errors.phone && (
                <Error className="flex gap-1 items-center mt-1.5">
                  <img src="/icon/info.svg" alt="info" />
                  {errors.phone.message}
                </Error>
              )}
            </>
          )}
        </div>
      </div>
      <div className="w-full mt-4">
        <Button
          type="button"
          onClick={handleSubmit(onSubmit)}
          disabled={isDisabled}
          className="w-full"
        >
          {!existingValue
            ? t("recoveryMethod_modal.button_continue")
            : t("recoveryMethod_modal.button_update")}
        </Button>
      </div>
    </div>
  );
};
