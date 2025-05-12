import { ButtonHTMLAttributes, forwardRef } from "react";
import { Button } from "./button";
import SvgIcon from "./svg-icon";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

interface SubscribeButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  subscriptionPrice: number;
  loading?: boolean;
  loadingIcon?: React.ReactNode;
  monthLabel?: "full" | "short";
  variant?: "dark" | "light";
}

export const SubscribeButton = forwardRef<
  HTMLButtonElement,
  SubscribeButtonProps
>(
  (
    {
      subscriptionPrice,
      className,
      loading,
      loadingIcon,
      monthLabel = "short",
      variant = "dark",
      ...props
    },
    ref
  ) => {
    const { t } = useTranslation(undefined, { keyPrefix: "subscribeButton" });
    return (
      <Button
        {...props}
        className={cn("gap-2 items-center max-w-full leading-5", className, {
          "bg-light-T90 text-grayscale-100 hover:bg-light-T100":
            variant === "light",
        })}
        aria-label={t("ariaLabel", { subscriptionPrice })}
        ref={ref}
        loading={loading}
        loadingIcon={loadingIcon}
      >
        <SvgIcon src="/icon/star.svg" className="w-5 h-5" />
        <span>
          <span>{t("subscribe")}</span>
          <span
            className={cn("text-light-T60", {
              "text-grayscale-60": variant === "light",
            })}
          >
            {t(
              monthLabel === "short"
                ? "pricePerMonth.short"
                : "pricePerMonth.full",
              { subscriptionPrice }
            )}
          </span>
        </span>
      </Button>
    );
  }
);
