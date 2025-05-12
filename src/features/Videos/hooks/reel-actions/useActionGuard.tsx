import { useModal } from "@/hooks/useModal";
import { useCallback } from "react";
import { ActionGuard } from "../../components/ActionGuard";
import { ButtonProps } from "@/components/ui/button";

export function useActionGuard() {
  const { setModal, closeModal, openModal } = useModal();

  const openActionGuard = useCallback(
    ({
      title,
      subtitle,
      confirmText,
      cancelText,
      onConfirm,
      onCancel,
      confirmVariant,
    }: {
      title?: string;
      subtitle?: string;
      confirmText?: string;
      cancelText?: string;
      onConfirm: () => void;
      onCancel?: () => void;
      confirmVariant?: ButtonProps["variant"];
    }) => {
      setModal(
        <ActionGuard
          confirmText={confirmText || "Confirm"}
          confirmVariant={confirmVariant}
          cancelText={cancelText || "Cancel"}
          onConfirm={() => {
            onConfirm();
            closeModal();
          }}
          onCancel={() => {
            onCancel && onCancel();
            closeModal();
          }}
        />,
        {
          title: title || "Are you sure?",
          subtitle: subtitle || "This action cannot be undone.",
        }
      );
      openModal();
    },
    [closeModal, setModal, openModal]
  );

  return { openActionGuard };
}
