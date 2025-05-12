import { Button, ButtonProps } from "@/components/ui/button";
import { ReactNode } from "react";

export function ActionGuard({
  confirmText,
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  confirmVariant = "destructive",
  cancelVariant = "ghost",
}: {
  confirmText: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel?: () => void;
  confirmVariant?: ButtonProps["variant"];
  cancelVariant?: ButtonProps["variant"];
  confirmIcon?: ReactNode;
  cancelIcon?: ReactNode;
}) {
  return (
    <div className="flex flex-col w-full mt-6">
      <Button onClick={onConfirm} variant={confirmVariant}>
        {confirmText}
      </Button>
      <Button
        onClick={onCancel}
        variant={cancelVariant}
        className="text-dark-T50"
      >
        {cancelText}
      </Button>
    </div>
  );
}
