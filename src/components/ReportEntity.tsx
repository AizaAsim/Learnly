import { Button } from "@/components/ui/button";
import { logError } from "@/services/logging";
import { useState } from "react";

export interface ReportEntityProps {
  reportClick: () => Promise<void> | void;
  closeModal: () => void;
  reportButtonText: string;
  cancelButtonText: string;
}

export const ReportEntity = ({
  reportClick,
  closeModal,
  reportButtonText,
  cancelButtonText,
}: ReportEntityProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleReport = async () => {
    setIsSubmitting(true);
    try {
      await reportClick();
    } catch (error) {
      logError(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col w-full gap-1">
      <Button
        onClick={handleReport}
        variant="default"
        className="w-full"
        disabled={isSubmitting}
        loading={isSubmitting}
      >
        {reportButtonText}
      </Button>
      <div className="flex justify-center">
        <Button
          type="button"
          onClick={closeModal}
          variant="ghost"
          disabled={isSubmitting}
          className="w-full"
        >
          {cancelButtonText}
        </Button>
      </div>
    </div>
  );
};
