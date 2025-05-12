import SvgIcon from "@/components/ui/svg-icon";
import { cn } from "@/lib/utils";
import ChevronRight from "/icon/mini-chevron-right.svg";
import { ComponentPropsWithoutRef, ReactNode, forwardRef } from "react";

interface AddRecoveryMethodLinkProps extends ComponentPropsWithoutRef<"div"> {
  text: string;
  icon?: string;
  children?: ReactNode;
}

export const AddRecoveryMethodLink = forwardRef<
  HTMLDivElement,
  AddRecoveryMethodLinkProps
>(({ text, icon, onClick, onMouseEnter, onMouseLeave }, ref) => {
  const isInteractive = !!onClick;

  return (
    <>
      <div
        ref={ref}
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        className={cn(
          "flex items-center first-of-type:rounded-t-3xl last-of-type:rounded-b-3xl cursor-not-allowed min-h-[52px] px-4 py-3.5 first-of-type:pt-[18px] last-of-type:pb-[18px]  md:h-16 md:px-6 md:py-[18px]",
          {
            "cursor-pointer opacity-100": isInteractive,
          }
        )}
      >
        <div className="flex w-full items-center justify-between">
          <div className={cn("flex items-center gap-x-2")}>
            {icon && <img className="h-6 w-6" src={icon} />}
            <h2
              className={cn(
                "text-sm font-semibold leading-[18px] -tracking-[0.14px] text-primaryBlue"
              )}
            >
              {text}
            </h2>
          </div>

          <SvgIcon src={ChevronRight} strokeWidth="1.6" />
        </div>
      </div>

      <hr className="border-dark-T4 -translate-y-0.5 last-of-type:hidden mx-4 h-[1px] md:mx-6" />
    </>
  );
});

AddRecoveryMethodLink.displayName = "AddRecoveryMethodLink";
