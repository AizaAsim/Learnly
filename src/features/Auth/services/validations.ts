import { z } from "zod";
import { RecoveryMethod } from "../types";

export const createNameFieldsValidations = (t: (key: string) => string) => ({
  displayName: z
    .string()
    .min(3, t("displayNameForm_displayName_error_min"))
    .max(24, t("displayNameForm_displayName_error_max")),
  username: z
    .string()
    .min(3, t("displayNameForm_username_error_min"))
    .max(15, t("displayNameForm_username_error_max"))
    .regex(
      /^[a-zA-Z0-9]*[a-zA-Z]+[a-zA-Z0-9]*$/,
      t("displayNameForm_username_error")
    ),
});

export const createRecoveryMethodsValidations = (
  t: (key: string) => RecoveryMethod
) => ({
  email: z.string().email(t("recoveryMethod_modal.error_invalidEmail")),
  phone: z
    .string()
    .min(10, t("recoveryMethod_modal.error_invalidPhone"))
    .max(15, t("recoveryMethod_modal.error_invalidPhone")),
});
