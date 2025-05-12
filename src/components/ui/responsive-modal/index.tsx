import { useDeviceType } from "@/hooks/useDeviceType";
import { forwardRef } from "react";
import { DesktopModal } from "./DesktopModal";
import { MobileModal } from "./MobileModal";
import { ResponsiveModalProps } from "./type";

export const ResponsiveModal = forwardRef<HTMLDivElement, ResponsiveModalProps>(
  (
    {
      isOpen,
      setIsOpen,
      children,
      title,
      subtitle,
      sheetContentClassNames,
      sheetHeaderClassNames,
      sheetTitleClassNames,
      dialogContentClassNames,
      dialogTitleClassNames,
      sheetSubTitleClassNames,
      dialogSubTitleClassNames,
      showBackIcon,
      onBackClick,
      showLogo,
      showFooter,
      avatar,
    },
    ref
  ) => {
    const { isMobile } = useDeviceType();

    return (
      <div ref={ref}>
        {isMobile ? (
          <MobileModal
            aria-describedby={undefined}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            title={title}
            subtitle={subtitle}
            sheetContentClassNames={sheetContentClassNames}
            sheetHeaderClassNames={sheetHeaderClassNames}
            sheetTitleClassNames={sheetTitleClassNames}
            sheetSubTitleClassNames={sheetSubTitleClassNames}
            showBackIcon={showBackIcon}
            onBackClick={onBackClick}
            showLogo={showLogo}
            showFooter={showFooter}
            avatar={avatar}
          >
            {children}
          </MobileModal>
        ) : (
          <DesktopModal
            aria-describedby={undefined}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            title={title}
            subtitle={subtitle}
            dialogContentClassNames={dialogContentClassNames}
            dialogTitleClassNames={dialogTitleClassNames}
            dialogSubTitleClassNames={dialogSubTitleClassNames}
            showBackIcon={showBackIcon}
            onBackClick={onBackClick}
            avatar={avatar}
          >
            {children}
          </DesktopModal>
        )}
      </div>
    );
  }
);
