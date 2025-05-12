import { ResponsiveModal } from "@/components/ui/responsive-modal";
import { ModalAvatarConfig } from "@/components/ui/responsive-modal/type";
import {
  ReactNode,
  RefObject,
  createContext,
  useCallback,
  useRef,
  useState,
} from "react";

export type ContentOptions = {
  title?: string | ReactNode;
  subtitle?: string | ReactNode;
  sheetContentClassNames?: string;
  sheetHeaderClassNames?: string;
  sheetTitleClassNames?: string;
  dialogContentClassNames?: string;
  dialogTitleClassNames?: string;
  sheetSubTitleClassNames?: string;
  dialogSubTitleClassNames?: string;
  showLogo?: boolean;
  avatar?: ModalAvatarConfig;
};

export type BackButtonOptions = {
  showBackIcon?: boolean;
  onBackClick?: () => void;
};

export type ModalContextType = BackButtonOptions & {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  modalContent: ReactNode;
  modalTitle: string | ReactNode;
  modalSubtitle: string | ReactNode;
  setModal: (
    content: ReactNode,
    opts?: ContentOptions,
    backOptions?: BackButtonOptions
  ) => void;
  openModal: () => void;
  closeModal: () => void;
  modalRef: RefObject<HTMLDivElement>;
  setOnCloseModal: (onCloseModal: (() => void) | undefined) => void;
  showLogo?: boolean;
};

export const ModalContext = createContext<ModalContextType | undefined>(
  undefined
);

export const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [modalContent, setModalContent] = useState<ReactNode>(null);
  const [modalTitle, setModalTitle] = useState<string | ReactNode>("");
  const [modalSubtitle, setModalSubtitle] = useState<string | ReactNode>("");
  const [showLogo, setShowLogo] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  const [sheetContentClassNames, setSheetContentClassNames] =
    useState<string>();
  const [sheetHeaderClassNames, setSheetHeaderClassNames] = useState<string>();
  const [sheetTitleClassNames, setSheetTitleClassNames] = useState<string>();
  const [dialogContentClassNames, setDialogContentClassNames] =
    useState<string>();
  const [dialogTitleClassNames, setDialogTitleClassNames] = useState<string>();
  const [sheetSubTitleClassNames, setSheetSubTitleClassNames] =
    useState<string>();
  const [dialogSubTitleClassNames, setDialogSubTitleClassNames] =
    useState<string>();

  const [showBackIcon, setShowBackIcon] = useState(false);
  const [avatar, setAvatar] = useState<ModalAvatarConfig>();

  const onBackClickRef = useRef<() => void>();
  const customCloseModalRef = useRef<() => void>();

  const openModal = useCallback(() => {
    setIsOpen(true);
  }, []);

  const closeModal = useCallback((destroy = true) => {
    if (customCloseModalRef.current) {
      customCloseModalRef.current();
      return;
    }

    setIsOpen(false);
    if (destroy) {
      setModalContent(null);
      setModalTitle("");
      setModalSubtitle("");
    }
  }, []);

  const setModal = useCallback(
    (
      content: ReactNode,
      opts?: ContentOptions,
      backOptions?: BackButtonOptions
    ) => {
      setModalContent(content);
      opts?.title ? setModalTitle(opts.title) : setModalTitle("");
      opts?.subtitle ? setModalSubtitle(opts.subtitle) : setModalSubtitle("");
      opts?.showLogo ? setShowLogo(opts.showLogo) : setShowLogo(false);
      setSheetContentClassNames(opts?.sheetContentClassNames);
      setSheetHeaderClassNames(opts?.sheetHeaderClassNames);
      setSheetTitleClassNames(opts?.sheetTitleClassNames);
      setDialogContentClassNames(opts?.dialogContentClassNames);
      setDialogTitleClassNames(opts?.dialogTitleClassNames);
      setShowBackIcon(backOptions?.showBackIcon ?? false);
      onBackClickRef.current = backOptions?.onBackClick;
      setSheetSubTitleClassNames(opts?.sheetSubTitleClassNames);
      setDialogSubTitleClassNames(opts?.dialogSubTitleClassNames);
      setAvatar(opts?.avatar);
    },
    []
  );

  const setOnCloseModal = useCallback(
    (onCloseModal: (() => void) | undefined) => {
      customCloseModalRef.current = onCloseModal;
    },
    []
  );

  return (
    <ModalContext.Provider
      value={{
        isOpen,
        setIsOpen,
        modalContent,
        modalTitle,
        modalSubtitle,
        setModal,
        openModal,
        closeModal,
        modalRef,
        showBackIcon,
        onBackClick: onBackClickRef.current,
        setOnCloseModal,
        showLogo,
      }}
    >
      {children}
      <ResponsiveModal
        ref={modalRef}
        title={modalTitle}
        subtitle={modalSubtitle}
        isOpen={isOpen}
        setIsOpen={closeModal}
        sheetContentClassNames={sheetContentClassNames}
        sheetHeaderClassNames={sheetHeaderClassNames}
        sheetTitleClassNames={sheetTitleClassNames}
        dialogContentClassNames={dialogContentClassNames}
        dialogTitleClassNames={dialogTitleClassNames}
        showBackIcon={showBackIcon}
        onBackClick={onBackClickRef.current}
        sheetSubTitleClassNames={sheetSubTitleClassNames}
        dialogSubTitleClassNames={dialogSubTitleClassNames}
        showLogo={showLogo}
        avatar={avatar}
      >
        {modalContent}
      </ResponsiveModal>
    </ModalContext.Provider>
  );
};
