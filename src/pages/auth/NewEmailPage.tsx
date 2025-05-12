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

const NewEmailPage = () => {
  const { t } = useTranslation();
  const context = useContext(UserContext);
  const navigate = useNavigate();
  const { sendOtpToNewEmail } = useAuth();

  // ** Form Schema
  const schema = z.object({
    email: z.string().email(t("newEmail_error_invalidEmail")),
  });
  type NewEmailSchema = z.infer<typeof schema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
  } = useForm<NewEmailSchema>({
    mode: "onChange",
    defaultValues: {
      email: "",
    },
    resolver: zodResolver(schema),
  });

  const emailValue = register("email");

  const isDisabled = useMemo(
    () => Object.keys(errors).length > 0 || !emailValue,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [emailValue, errors, Object.keys(errors).length]
  );

  const onFocus = () => {
    clearErrors("email");
  };

  const onSubmit: SubmitHandler<NewEmailSchema> = useCallback(
    async (data) => {
      const result = await sendOtpToNewEmail(data.email);
      if (result?.isValid) {
        localStorage.removeItem("isRecovered");
        navigate("/auth/new-email/verify", {
          state: { email: data.email },
        });
      }
      setError("email", {
        type: "manual",
        message: t("newEmail_error_alreadyExists"),
      });
    },
    [sendOtpToNewEmail, navigate, setError, t]
  );

  return context?.user?.uid && !context?.user?.role ? (
    <Spinner /> // Show a spinner while the user's role is being fetched
  ) : (
    <div className=" bg-white">
      <AuthTitle
        title={t("newEmail_title")}
        description={t("newEmail_description")}
      />
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <Input
            id="email"
            type="email"
            placeholder={t("newEmail_placeholder")}
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
            {t("newEmail_button_continue")}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default NewEmailPage;
