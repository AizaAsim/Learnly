import { Error } from "@/components/ui/error";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { UseFormRegisterReturn } from "react-hook-form";
import { useTranslation } from "react-i18next";

interface DescriptionFieldProps {
  registerReturn: UseFormRegisterReturn<"description">;
  descriptionLength: number;
  maxDescriptionLength: number;
  errorMessage?: string | undefined;
}

export const DescriptionField = ({
  registerReturn,
  descriptionLength,
  maxDescriptionLength,
  errorMessage,
}: DescriptionFieldProps) => {
  const [descriptionFocused, setDescriptionFocused] = useState(false);
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-2">
      <div
        className={cn(
          "relative rounded-[14px] border-[1.6px] border-transparent",
          {
            "border-grayscale-100": descriptionFocused,
          }
        )}
      >
        {descriptionLength === 0 && (
          <img
            src="/icon/description.svg"
            className="absolute top-[15px] left-4 size-[18px]"
          />
        )}
        <Textarea
          placeholder={t("reelUpload_editDetails_description")}
          className={cn(
            "px-4 pt-3.5 pb-6 border-0 shadow-none bg-grayscale-4 text-grayscale-80 font-semibold placeholder:text-grayscale-50 placeholder:font-medium placeholder:text-sm resize-none",
            {
              "border-red focus-visible:ring-0 bg-red-t4": errorMessage,
              "pl-10": descriptionLength === 0,
            }
          )}
          {...registerReturn}
          onFocus={() => setDescriptionFocused(true)}
          onBlur={() => setDescriptionFocused(false)}
          maxLength={maxDescriptionLength}
          // Prevent line breaks on Enter key press
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
            }
          }}
        />
        <span className="absolute bottom-2.5 right-3 text-[10px] text-grayscale-40 font-medium -tracking-[0.1px] leading-[14px]">
          {descriptionLength}/{maxDescriptionLength}
        </span>
      </div>
      {errorMessage && (
        <Error className="flex gap-1.5 text-red">
          <img src="/icon/error.svg" className="w-4 h-4" />
          <p>{t(errorMessage)}</p>
        </Error>
      )}
    </div>
  );
};
