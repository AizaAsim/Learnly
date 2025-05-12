import { Button } from "@/components/ui/button";
import { useModal } from "@/hooks/useModal";
import { blockUser } from "../services/callable";
import { logError } from "@/services/logging";
import { useToast } from "@/components/ui/use-toast";
import { useTranslation } from "react-i18next";
import { useState } from "react";

interface BlockedUserModalProps {
  subscriberId: string;
  onBlock: () => void;
}

export const BlockedUserModal = ({
  subscriberId,
  onBlock,
}: BlockedUserModalProps) => {
  const { closeModal } = useModal();
  const { toast } = useToast();
  const { t } = useTranslation(undefined, { keyPrefix: "blocked_user" });
  const [isBlocking, setIsBlocking] = useState(false);

  const handleBlock = async () => {
    try {
      if (!subscriberId) return;
      setIsBlocking(true);
      await blockUser({ userId: subscriberId });
      onBlock();
      toast({ text: "User blocked successfully" });
      closeModal();
    } catch (error) {
      let message = "Failed to block user";
      if (error instanceof Error) message = error.message;
      toast({
        text: message,
        variant: "destructive",
        className: "w-60 text-center",
      });
      logError(message, error);
    } finally {
      setIsBlocking(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <Button
        variant="destructive"
        onClick={handleBlock}
        disabled={isBlocking}
        className="disabled:opacity-70"
      >
        {t("confirm")}
      </Button>
      <Button
        variant="ghost"
        className="text-grayscale-50 w-full h-auto py-0 hover:bg-inherit -tracking-[0.15px] font-semibold text-[15px] leading-5"
        onClick={closeModal}
        disabled={isBlocking}
      >
        {t("cancel")}
      </Button>
    </div>
  );
};
