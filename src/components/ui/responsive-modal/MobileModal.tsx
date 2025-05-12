import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { DialogFooter } from "@/components/ui/dialog";
import { ModalCommonProps } from "./type";
import { cn } from "@/lib/utils";
import { BiSolidLockAlt } from "react-icons/bi";
import { ModalAvatar } from "./ModalAvatar";

export const MobileModal = ({
  isOpen,
  setIsOpen,
  children,
  title,
  subtitle,
  sheetContentClassNames,
  sheetHeaderClassNames,
  sheetTitleClassNames,
  sheetSubTitleClassNames,
  showBackIcon,
  onBackClick,
  showLogo,
  showFooter,
  avatar,
}: ModalCommonProps) => {
  const handleBack = () => {
    if (onBackClick) onBackClick();
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent
        side="bottom"
        className={cn(
          "bg-light-T100 rounded-t-[36px] py-8 px-6 outline-none",
          {
            "pt-[72px]": avatar,
          },
          sheetContentClassNames
        )}
        onPointerDownOutside={(e) => e.preventDefault()}
        aria-describedby={undefined}
        forceMount
      >
        {showBackIcon && (
          <div
            className="absolute w-auto left-[18px] top-[18px] cursor-pointer z-50"
            onClick={handleBack}
          >
            <img src="/icon/back.svg" alt="back" className="w-6 h-6" />
          </div>
        )}
        {showLogo && (
          <div className="flex justify-center mt-2 mb-9">
            <img src="/img/logo2.svg" width={98} height={32} alt="logo" />
          </div>
        )}
        <div className="relative">
          <ModalAvatar avatar={avatar} />
          {(title || subtitle) && (
            <SheetHeader
              className={cn(sheetHeaderClassNames, avatar && "mt-5")}
            >
              {title && (
                <SheetTitle className={cn("text-center", sheetTitleClassNames)}>
                  {title}
                </SheetTitle>
              )}
              {subtitle && (
                <SheetDescription className={sheetSubTitleClassNames}>
                  {subtitle}
                </SheetDescription>
              )}
            </SheetHeader>
          )}
          {children}
        </div>
        {showFooter && (
          <DialogFooter className="mt-8">
            <div className="flex justify-center items-center gap-[6px] mx-[-32px] mb-[-32px] pt-[11px] pb-6 bg-gray-50 border-t border-[#00000014]">
              <BiSolidLockAlt color="#7F7F83" size={12} />
              <span className="text-xs">learnly.com</span>
            </div>
          </DialogFooter>
        )}
      </SheetContent>
    </Sheet>
  );
};
