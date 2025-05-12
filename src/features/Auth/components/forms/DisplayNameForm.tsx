import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect, useMemo, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Trans, useTranslation } from "react-i18next";
import { z } from "zod";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { useModal } from "../../../../hooks/useModal";
import { useAuth } from "../../hooks/useAuth";
import { NamesFields, Roles } from "../../types";
import { Error } from "@/components/ui/error";
import { createNameFieldsValidations } from "../../services/validations";
import debounce from "lodash-es/debounce";

interface Props {
  field: NamesFields;
  onChange: (data: { [x: string]: string }) => void;
}

export const DisplayNameForm = ({ field, onChange }: Props) => {
  const { closeModal } = useModal();
  const { user } = useAuth();
  const {
    error,
    clearError,
    updateUserNames,
    isLoading,
    checkUsernameUniqueness,
  } = useAuth();
  const { t } = useTranslation();

  const [isValidating, setIsValidating] = useState<boolean>(false);
  const [isUsernameValid, setIsUsernameValid] = useState<boolean>(false);
  const [isUsernameUnique, setIsUsernameUnique] = useState<boolean>(false);

  const nameValidations = createNameFieldsValidations(t);
  const schema = z.object({
    [field]: nameValidations[field],
  });
  type DisplayNameSchema = z.infer<typeof schema>;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    watch,
    clearErrors,
  } = useForm<DisplayNameSchema>({
    mode: "onChange",
    defaultValues: {
      [field]: user?.[field] || "",
    },
    resolver: zodResolver(schema),
  });

  const fieldValueLength = watch(field)?.length;

  useEffect(() => {
    if (error) {
      setError("root", {
        type: "manual",
        message: error, // TODO: Figure out backend error translations
      });
    }
  }, [error, setError]);

  const isDisabled = useMemo(() => {
    return (
      isValidating ||
      isLoading ||
      isSubmitting ||
      Object.keys(errors).length > 0 ||
      fieldValueLength === 0
    );
  }, [
    isValidating,
    isLoading,
    isSubmitting,
    errors,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    Object.keys(errors).length,
    fieldValueLength,
  ]);

  const validateUsername = useCallback(
    async (value: string) => {
      const isUnique = await checkUsernameUniqueness(value);
      setIsUsernameValid(true);
      setIsUsernameUnique(isUnique);
      setIsValidating(false);
      return isUnique ? true : t("displayNameForm_username_error");
    },
    [checkUsernameUniqueness, t]
  );

  // Debounce the validateUsername function
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedValidateUsername = useCallback(
    debounce((value) => {
      validateUsername(value).then((result) => {
        if (result !== true) {
          setError(field, {
            type: "manual",
            message: result,
          });
        }
      });
    }, 600),
    [validateUsername, setError, field]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      if (
        field === NamesFields.username &&
        value.length >= 3 &&
        value.length <= 15 &&
        /^[a-zA-Z0-9]*[a-zA-Z]+[a-zA-Z0-9]*$/.test(value) // ensures there's at least one alphabet
      ) {
        setIsValidating(true);
        debouncedValidateUsername(value);
      } else {
        setIsUsernameValid(false);
        setIsUsernameUnique(false);
        setIsValidating(false);
      }
    },
    [debouncedValidateUsername, field]
  );

  const onSubmit: SubmitHandler<DisplayNameSchema> = async (data) => {
    closeModal();
    data[field] = data[field].trim();
    if (data.username) data.username = data.username.toLowerCase();
    await updateUserNames(data).then(() => onChange(data));
  };

  const onFocus = () => {
    clearError();
    clearErrors("root");
  };

  return (
    <form
      className="flex flex-col justify-center gap-4"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="relative">
        <Input
          id={field}
          type="text"
          variant={!errors[field] && !errors.root ? "styled" : "error"}
          placeholder={
            user?.role === Roles.USER
              ? t("displayNameForm_name_input_placeholder")
              : t(`displayNameForm_${field}_input_placeholder`)
          }
          {...register(field, {
            onChange: handleChange,
          })}
          onFocusCapture={onFocus}
        />
        {isValidating && (
          <div className="absolute top-3.5 right-4 w-5 h-5 flex items-center justify-center">
            <img src="/icon/loading.svg" className="animate-spin" />
          </div>
        )}
        {!isValidating && isUsernameValid && (
          <div className="absolute top-3.5 right-4">
            <img
              src={
                isUsernameUnique
                  ? "/icon/checkmark-green.svg"
                  : "/icon/cross-red.svg"
              }
            />
          </div>
        )}
        {errors[field] && (
          <Error className={classes.errorMsg}>
            <img src="/icon/info.svg" alt="info" />
            {errors[field]?.message}
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
        <Trans i18nKey="displayNameForm_button_continue" />
      </Button>
    </form>
  );
};

const classes = {
  errorMsg: "flex items-center mt-1.5 gap-1",
};
