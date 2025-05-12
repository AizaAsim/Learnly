import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { deleteAccount } from "@/features/Profile/services/callable";
import { useModal } from "@/hooks/useModal";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";

export const DeleteAccount = () => {
  const { t } = useTranslation(undefined, { keyPrefix: "deleteAccount" });
  const { toast } = useToast();
  const { closeModal } = useModal();
  const [loading, setLoading] = useState(false);

  const handleDelete = useCallback(async () => {
    try {
      setLoading(true);
      await deleteAccount();
      toast({
        text: t("success"),
        variant: "success",
        className: "w-[260px]",
      });
      window.location.href = "/auth";
    } catch (error) {
      toast({ text: t("error"), variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, [t, toast]);

  return (
    <div className="flex flex-col gap-4 max-w-[327px] mx-auto md:max-w-full">
      <Button
        variant="destructive"
        onClick={handleDelete}
        disabled={loading}
        loading={loading}
      >
        {t("delete_button")}
      </Button>
      <Button
        variant="ghost"
        size="none"
        onClick={closeModal}
        disabled={loading}
      >
        {t("cancel_button")}
      </Button>
    </div>
  );
};
