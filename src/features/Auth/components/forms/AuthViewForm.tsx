import { useCallback, useMemo } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Error } from "@/components/ui/error";
import { useTranslation, Trans } from "react-i18next";
import { useAuth } from "../../hooks/useAuth";
import { useAuthModals } from "../../hooks/useAuthModals";

export const AuthViewForm = () => {
  const { clearError, sendAuthOtp, isLoading } = useAuth();
  const { openAuthVerificationModal } = useAuthModals();

  const { t } = useTranslation();

  // ** Form Schema
  const schema = z.object({
    email: z.string().email(t("authForm_error_emailInvalid")),
  });
  type AuthViewFormSchema = z.infer<typeof schema>;

  // ** Hooks
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    clearErrors,
    watch,
  } = useForm<AuthViewFormSchema>({
    mode: "onChange",
    defaultValues: {
      email: "",
    },
    resolver: zodResolver(schema),
  });

  const emailLength = watch("email").length;

  // ** Memoization
  const isDisabled = useMemo(() => {
    return (
      isLoading ||
      isSubmitting ||
      Object.keys(errors).length > 0 ||
      emailLength === 0
    );
  }, [
    isLoading,
    isSubmitting,
    errors,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    Object.keys(errors).length,
    emailLength,
  ]);

  // ** Handlers
  const onSubmit: SubmitHandler<AuthViewFormSchema> = useCallback(
    async (data) => {
      const isSent = await sendAuthOtp(data.email);
      if (isSent) {
        openAuthVerificationModal(data.email);
      }
    },
    [sendAuthOtp, openAuthVerificationModal]
  );

  const onFocus = () => {
    clearError();
    clearErrors("root");
  };

  return (
    <form
      className="flex flex-col justify-center gap-y-4"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className={classes.row}>
        <Input
          variant={!errors.email && !errors.root ? "styled" : "error"}
          id="email"
          type="email"
          placeholder={t("authForm_placeholder_email")}
          autoComplete="email"
          {...register("email")}
          onFocusCapture={onFocus}
        />
        {errors.email && (
          <Error className={classes.errorMsg}>
            <img src="/icon/info.svg" alt="info" />
            {errors.email.message}
          </Error>
        )}
        {errors.root && (
          <Error className={classes.errorMsg}>
            <img src="/icon/info.svg" alt="info" />
            {errors.root.message}
          </Error>
        )}
      </div>

      <Button disabled={isDisabled} type="submit">
        <Trans i18nKey={"authForm_button_continue"} />
      </Button>
    </form>
  );
};

const classes = {
  row: "flex flex-col gap-1.5",
  errorMsg: "flex gap-1 items-center",
};
