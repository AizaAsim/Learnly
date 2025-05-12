import { useCallback, useEffect, useMemo } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Error } from "@/components/ui/error";
import { useTranslation, Trans } from "react-i18next";
import { useAuth } from "../../hooks/useAuth";
import { Role, Roles } from "../../types";
import { useLocation, useNavigate } from "react-router-dom";

interface AuthFormProps {
  role: Role;
}

export const AuthForm = ({ role }: AuthFormProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { error, clearError, sendAuthOtp, isLoading } = useAuth();

  const { t } = useTranslation();

  // ** Form Schema
  const schema = z.object({
    email: z.string().email(t("authForm_error_emailInvalid")),
  });
  type AuthFormSchema = z.infer<typeof schema>;

  // ** Hooks
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    clearErrors,
    watch,
  } = useForm<AuthFormSchema>({
    mode: "onChange",
    defaultValues: {
      email: "",
    },
    resolver: zodResolver(schema),
  });

  // const emailValue = watch("email");

  // Update the local error state with the backend auth errors
  // Be careful when trying to clear the error. You have to clear it in the parent component
  // then clear it in the form.
  useEffect(() => {
    if (error) {
      setError("root", {
        type: "manual",
        message: error, // TODO: Figure out backend error translations
      });
    }
  }, [error, setError]);

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
  const onSubmit: SubmitHandler<AuthFormSchema> = useCallback(
    async (data) => {
      const isSent = await sendAuthOtp(data.email);
      if (isSent) {
        navigate("/auth/verify", {
          state: { ...location.state, email: data.email, role },
        });
      }
    },
    [sendAuthOtp, role, navigate, location.state]
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
          className=""
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
        <Trans
          i18nKey={
            role === Roles.USER
              ? "authForm_button_continueAsAFan"
              : "authForm_button_continueAsACreator"
          }
        />
      </Button>
    </form>
  );
};

const classes = {
  row: "flex flex-col gap-1.5",
  errorMsg: "flex gap-1 items-center", 
};
