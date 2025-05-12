import { useCallback, useContext, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { AuthTitle } from "@/components/layout/AuthTitle";
import { Spinner } from "../../components/ui/spinner";
import { UserContext } from "../../features/Auth/contexts/UserContext";
import { z } from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Error } from "@/components/ui/error";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/features/Auth/hooks/useAuth";
import { RecoveryMethods } from "@/features/Auth/types";

const AccountRecoveryPage = () => {
  const { t } = useTranslation();
  const context = useContext(UserContext);
  const navigate = useNavigate();
  const { validateAssociatedAccount, sendRecoveryAuthOtp } = useAuth();

  // ** Form Schema
  const schema = z.object({
    email: z.string().email(t("accountRecovery_error_invalidEmail")),
  });
  type AccountRecoverySchema = z.infer<typeof schema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
    watch,
  } = useForm<AccountRecoverySchema>({
    mode: "onChange",
    defaultValues: {
      email: "",
    },
    resolver: zodResolver(schema),
  });

  const emailValue = watch("email");

  const isDisabled = useMemo(
    () => Object.keys(errors).length > 0 || !emailValue,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [emailValue, errors, Object.keys(errors).length]
  );

  const onFocus = () => {
    clearErrors("email");
  };

  const handleNoPhoneRecovery = useCallback(
    async (primaryEmail: string, recoveryEmail: string) => {
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
    },
    [navigate, sendRecoveryAuthOtp]
  );

  const onSubmit: SubmitHandler<AccountRecoverySchema> = useCallback(
    async (data) => {
      const result = await validateAssociatedAccount(data.email);
      if (result?.isValid) {
        if (!result.recovery.email && !result.recovery.phone) {
          setError("email", {
            type: "manual",
            message: t("accountRecovery_error_noRecoveryMethods"),
          });
          return;
        }
        if (!result.recovery.phone && result.recovery.email) {
          await handleNoPhoneRecovery(data.email, result.recovery.email);
          return;
        }
        navigate("/auth/account-recovery/method", {
          state: {
            primaryEmail: data.email,
            recoveryPhone: result.recovery.phone || null,
            recoveryEmail: result.recovery.email || null,
          },
        });
      }
      setError("email", {
        type: "manual",
        message: t("accountRecovery_error_noAccountFound"),
      });
    },
    [validateAssociatedAccount, handleNoPhoneRecovery, navigate, setError, t]
  );

  return context?.user?.uid && !context?.user?.role ? (
    <Spinner /> // Show a spinner while the user's role is being fetched
  ) : (
    <div className="bg-white">
      <AuthTitle
        title={t("accountRecovery_title")}
        description={t("accountRecovery_description")}
      />
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <Input
            id="email"
            type="email"
            placeholder={t("accountRecovery_placeholder_email")}
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
        </div>
        <div className="w-full mt-4">
          <Button type="submit" disabled={isDisabled} className="w-full">
            {t("accountRecovery_button_continue")}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AccountRecoveryPage;
