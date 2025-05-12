import { Button } from "@/components/ui/button";
import { useAuth } from "@/features/Auth/hooks/useAuth";
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";
import { useState } from "react";
import { useTranslation } from "react-i18next";

interface StripeActiveModal {
  onCopy?: () => void;
}

export const StripeActiveModal = ({ onCopy }: StripeActiveModal) => {
  const [, copy] = useCopyToClipboard();
  const [isCopied, setIsCopied] = useState(false);
  const { user } = useAuth();
  const { t } = useTranslation(undefined, {
    keyPrefix: "subscritionActivated",
  });

  const handleCopy = async () => {
    if (isCopied) return;
    await copy(`learnly.com/${user?.username}`);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000); // Reset after 2 seconds
    onCopy?.();
  };

  return (
    <div className="flex flex-col max-w-[327px] md:max-w-full mx-auto">
      <Button
        variant="secondary"
        icon={
          <img
            src={isCopied ? "/icon/checkmark.svg" : "/icon/link-1.svg"}
            className="w-5 h-5 mr-2"
          />
        }
        className="text-[15px] font-semibold -tracking-[0.15px]"
        onClick={handleCopy}
      >
        {t(isCopied ? "copied_button" : "copy_button")}
      </Button>
    </div>
  );
};

export default StripeActiveModal;
