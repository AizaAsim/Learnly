import { ReactNode, RefObject } from "react";

export type ModalAvatarConfig = {
  imageUrl?: string;
  icon?: string;
};

export interface ResponsiveModalProps {
  title?: string | ReactNode;
  subtitle?: string | ReactNode;
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  children?: ReactNode;
  ref?: RefObject<HTMLDivElement>;
  sheetContentClassNames?: string;
  sheetHeaderClassNames?: string;
  sheetTitleClassNames?: string;
  dialogContentClassNames?: string;
  dialogTitleClassNames?: string;
  sheetSubTitleClassNames?: string;
  dialogSubTitleClassNames?: string;
  showBackIcon?: boolean;
  onBackClick?: () => void;
  showLogo?: boolean;
  showFooter?: boolean;
  avatar?: ModalAvatarConfig;
}

export interface ModalCommonProps extends Omit<ResponsiveModalProps, "ref"> {
  children?: ReactNode;
}
