import {
  Dialog,
  DialogHeader,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { ModalCommonProps } from "./type";
import { cn } from "@/lib/utils";
import { ChevronLeft } from "lucide-react";
import { ModalAvatar } from "./ModalAvatar";

export const DesktopModal = ({
  isOpen,
  setIsOpen,
  children,
  title,
  subtitle,
  dialogContentClassNames,
  dialogTitleClassNames,
  dialogSubTitleClassNames,
  showBackIcon,
  onBackClick,
  avatar,
}: ModalCommonProps) => {
  const handleBack = () => {
    if (onBackClick) onBackClick();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent
        className={cn("bg-white p-11 w-[484px]", dialogContentClassNames)}
        onPointerDownOutside={(e) => e.preventDefault()}
        forceMount
        aria-description="modal"
        aria-describedby={undefined}
      >
        {showBackIcon && (
          <ChevronLeft
            className="absolute left-5 top-5 text-dark-T4 cursor-pointer"
            onClick={handleBack}
          />
        )}
        <div className="relative">
          <ModalAvatar avatar={avatar} />
          {(title || subtitle) && (
            <DialogHeader
              className={cn(
                "mb-8 flex flex-col gap-2.5",
                avatar && "mt-[38px]"
              )}
            >
              {title && (
                <DialogTitle
                  className={cn(
                    "text-center capitalize text-[22px] font-bold leading-6 -tracking-[0.22px] text-primaryBlue",
                    dialogTitleClassNames
                  )}
                >
                  {title}
                </DialogTitle>
              )}
              {subtitle && (
                <DialogDescription
                  className={cn(
                    "text-center text-base font-semibold leading-[22px] -tracking-[0.16px] text-dark-T60",
                    dialogSubTitleClassNames
                  )}
                >
                  {subtitle}
                </DialogDescription>
              )}
            </DialogHeader>
          )}
          {children}
        </div>
      </DialogContent>
    </Dialog>
  );
};
