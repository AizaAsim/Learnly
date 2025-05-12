import { useMemo } from "react";
import { ErrorType } from "../types";
import { useTranslation } from "react-i18next";

export function ErrorDisplay({ type }: { type: ErrorType }) {
  const { t } = useTranslation();

  const textDisplay = useMemo(() => {
    switch (type) {
      case "404":
        return t("router_error_notFound");
      case "500":
        return t("errorBoundary_error_unexpected");
      default:
        return t("errorBoundary_error_unexpected");
    }
  }, [type, t]);

  return (
    <div className="flex flex-col gap-3 justify-center items-center absolute inset-0 h-screen overflow-hidden">
      <img className="h-[100px]" src={"/img/error.svg"} />
      <h1 className="text-[26px]/[30px] font-bold text-grayscale-80 -tracking-[0.26px] sm:max-w-[300px] mx-auto text-center">
        {textDisplay}
      </h1>
    </div>
  );
}
