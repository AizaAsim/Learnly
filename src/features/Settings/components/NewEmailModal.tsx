import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/features/Auth/hooks/useAuth.tsx";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { logError } from "@/services/logging";
import { useUpdateEmailModals } from "../hooks/useUpdateEmailModals";
import { Error } from "@/components/ui/error";

export function NewEmailModal() {
  const { sendOtpToNewEmail, clearError } = useAuth();
  const { openOtpVerificationModal } = useUpdateEmailModals();
  const { t } = useTranslation(undefined, {
    keyPrefix: "newEmail_modal",
  });

  // ** Form Schema
  const schema = z.object({
    email: z.string().email(t("error_invalidEmail")),
  });
  type NewEmailFormSchema = z.infer<typeof schema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
  } = useForm<NewEmailFormSchema>({
    mode: "onChange",
    defaultValues: {
      email: "",
    },
    resolver: zodResolver(schema),
  });

  const onSubmit: SubmitHandler<NewEmailFormSchema> = async (values) => {
    try {
      const result = await sendOtpToNewEmail(values.email);
      if (result?.isValid)
        openOtpVerificationModal({ email: values.email, hasSetNewEmail: true });
      setError("email", {
        type: "manual",
        message: t(`error_alreadyExists`),
      });
    } catch (e) {
      logError(e);
    }
  };

  const onFocus = () => {
    clearError();
    clearErrors("root");
  };

  return (
    <div className="w-full flex flex-col items-center text-center">
      <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <Input
            variant={!errors.email && !errors.root ? "styled" : "error"}
            id="username"
            type="text"
            autoComplete="email"
            placeholder={t("placeholder")}
            {...register("email")}
            onFocusCapture={onFocus}
          />
          {errors.email && (
            <Error className={"flex items-center mt-1.5 gap-1"}>
              <img src="/icon/info.svg" alt="info" />
              {errors.email?.message}
            </Error>
          )}
          {errors.root && (
            <Error className={"flex items-center mt-1.5 gap-1"}>
              <img src="/icon/info.svg" alt="info" />
              {errors.root?.message}
            </Error>
          )}
        </div>
        <div className="mt-4">
          <Button
            className="w-full"
            type="submit"
            disabled={errors.email ? true : false}
          >
            {t("button")}
          </Button>
        </div>
      </form>
    </div>
  );
}
