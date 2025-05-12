import { useCallback, useContext, useEffect, useMemo } from "react";
import { Trans, useTranslation } from "react-i18next";
import { AuthTitle } from "@/components/layout/AuthTitle";
import { Spinner } from "../../components/ui/spinner";
import { UserContext } from "../../features/Auth/contexts/UserContext";
import { z } from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Error } from "@/components/ui/error";
import { Button } from "@/components/ui/button";
import { RecoveryMethods } from "@/features/Auth/types";
import { PhoneInput } from "@/components/ui/phone-input";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/features/Auth/hooks/useAuth";
import { logError } from "@/services/logging";

const AccountRecoveryMethodPage = () => {
  const { t } = useTranslation();
  const context = useContext(UserContext);
  const navigate = useNavigate();
  const { sendRecoveryAuthOtp } = useAuth();
  const location = useLocation();
  const primaryEmail = location.state?.primaryEmail;
  const recoveryPhone = location.state?.recoveryPhone;
  const recoveryEmail = location.state?.recoveryEmail;

  useEffect(() => {
    if (!primaryEmail) {
      navigate("/auth");
    }
  }, [navigate, primaryEmail]);

  // ** Form Schema
  const schema = z.object({
    phone: z
      .string()
      .min(10, t("accountRecovery_error_invalidPhone"))
      .max(15, t("accountRecovery_error_invalidPhone")),
  });
  type AccountRecoveryMethodSchema = z.infer<typeof schema>;

  const {
    handleSubmit,
    formState: { errors },
    setError,
    setValue,
    watch,
    clearErrors,
  } = useForm<AccountRecoveryMethodSchema>({
    mode: "onChange",
    defaultValues: {
      phone: "",
    },
    resolver: zodResolver(schema),
  });

  const phoneValue = watch("phone");

  const isDisabled = useMemo(() => {
    return (
      Object.keys(errors).length > 0 || !phoneValue || phoneValue.length <= 4
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [errors, phoneValue, Object.keys(errors).length]);

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
          message: t("accountRecovery_error_invalidPhone"),
        });
        return;
      } else {
        clearErrors("phone");
      }
    },
    [clearErrors, setError, setValue, t]
  );

  const onSubmit: SubmitHandler<AccountRecoveryMethodSchema> = useCallback(
    async (values) => {
      try {
        const result = await sendRecoveryAuthOtp(
          primaryEmail,
          RecoveryMethods.PHONE,
          values.phone
        );

        if (result?.isValid) {
          navigate("/auth/account-recovery/verify", {
            state: {
              primaryEmail,
              recoveryMethod: RecoveryMethods.PHONE,
              displayValue: values.phone,
              value: result.recipient,
            },
          });
        } else {
          setError("phone", {
            type: "manual",
            message: t(`accountRecovery_error_invalidPhone`),
          });
        }
      } catch (e) {
        logError(e);
      }
    },
    [primaryEmail, navigate, sendRecoveryAuthOtp, setError, t]
  );

  const handleHaveNoPhone = useCallback(async () => {
    try {
      const result = await sendRecoveryAuthOtp(
        primaryEmail,
        RecoveryMethods.EMAIL
      );

      if (result?.isValid) {
        navigate("/auth/account-recovery/verify", {
          state: {
            primaryEmail,
            recoveryMethod: RecoveryMethods.EMAIL,
            displayValue: recoveryEmail,
            value: result.recipient,
          },
        });
      }
    } catch (e) {
      logError(e);
    }
  }, [primaryEmail, navigate, recoveryEmail, sendRecoveryAuthOtp]);

  if (!primaryEmail) return null;

  return context?.user?.uid && !context?.user?.role ? (
    <Spinner /> // Show a spinner while the user's role is being fetched
  ) : (
    <div className="bg-white">
      <AuthTitle
        title={t("accountRecovery_title")}
        description={
          <Trans
            i18nKey="accountRecovery_description_method"
            components={{
              span: (
                <span className="text-ellipsis whitespace-nowrap overflow-hidden" />
              ),
            }}
            values={{
              phone: recoveryPhone,
            }}
          />
        }
      />

      <PhoneInput
        value={phoneValue}
        onChange={handlePhoneValueChange}
        error={!!errors.phone}
      />
      {errors.phone && (
        <Error className="flex gap-1 items-center mt-1.5">
          <img src="/icon/info.svg" alt="info" />
          {errors.phone.message}
        </Error>
      )}

      <div className="w-full mt-4 flex flex-col gap-y-4">
        <Button
          type="button"
          onClick={handleSubmit(onSubmit)}
          disabled={isDisabled}
        >
          {t("accountRecovery_button_sendCode")}
        </Button>
        <Button
          type="button"
          disabled={!recoveryEmail}
          onClick={handleHaveNoPhone}
          variant="link"
          className="h-auto !p-0 text-dark-T50 lg:-leading-[0.225px]"
        >
          {t("accountRecovery_button_haveNoPhone")}
        </Button>
      </div>
    </div>
  );
};

export default AccountRecoveryMethodPage;
