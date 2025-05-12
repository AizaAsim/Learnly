import { Error } from "@/components/ui/error";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { UseFormRegisterReturn } from "react-hook-form";
import { useTranslation } from "react-i18next";

interface LinkFieldProps {
  registerReturn: UseFormRegisterReturn<"link">;
  link: string;
  errorMessage?: string | undefined;
}

export const LinkField = ({
  registerReturn,
  link,
  errorMessage,
}: LinkFieldProps) => {
  const [linkFocused, setLinkFocused] = useState(false);
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-2">
      <div
        className={cn(
          "pl-4 h-12 flex items-center gap-2 bg-grayscale-4 rounded-[14px] border-[1.6px] border-transparent has-[:focus-visible]:outline-none has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-50",
          {
            "border-grayscale-100": linkFocused,
            "border-red has-[:focus-visible]:ring-0 bg-red-t4": errorMessage,
          }
        )}
      >
        <img
          src={
            link.length > 0
              ? errorMessage
                ? "/icon/link-red.svg"
                : "/icon/link-dark-edit-reels-details.svg"
              : "/icon/link-light-edit-reels-details.svg"
          }
          className="size-5"
        />
        <Input
          placeholder={t("reelUpload_editDetails_link")}
          className="bg-transparent"
          {...registerReturn}
          onFocus={() => setLinkFocused(true)}
          onBlur={() => setLinkFocused(false)}
        />
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
