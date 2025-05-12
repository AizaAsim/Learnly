import { cva, type VariantProps } from "class-variance-authority";
import { ReactNode } from "react";
import { Button } from "./button";
import { useDeviceType } from "@/hooks/useDeviceType";

const notificationBannerVariants = cva("p-5 md:px-7 md:py-4", {
  variants: {
    variant: {
      destructive: "bg-red-t10",
      warning: "bg-yellow-t20",
      attention: "bg-orange-t20",
    },
  },
  defaultVariants: {
    variant: "attention",
  },
});

export type BannerVariants = VariantProps<typeof notificationBannerVariants>;

interface NotificationBannerProps extends BannerVariants {
  message: string | ReactNode;
  buttonText: string;
  buttonAction: () => void;
  isLoading?: boolean;
}

export const NotificationBanner = ({
  message,
  buttonText,
  buttonAction,
  variant,
  isLoading,
}: NotificationBannerProps) => {
  const { isMobile } = useDeviceType();

  return (
    <div className={notificationBannerVariants({ variant })}>
      <div className="max-w-full flex flex-col gap-4 md:flex-row md:justify-between mx-auto items-center">
        <p className="font-medium text-[15px] md:text-base leading-5 md:leading-[22px] text-center md:text-left -tracking-[0.225px] md:-tracking-[0.16px] md:max-w-[1082px]">
          {message}
        </p>
        <Button
          disabled={isLoading}
          variant={variant}
          size={isMobile ? "default" : "sm"}
          onClick={buttonAction}
          loading={isLoading}
          className="w-full md:w-auto"
        >
          {buttonText}
        </Button>
      </div>
    </div>
  );
};
