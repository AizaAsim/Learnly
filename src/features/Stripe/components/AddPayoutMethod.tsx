import { Button } from "@/components/ui/button";
import { logError } from "@/services/logging";
import { FirebaseError } from "firebase/app";
import { getStripeOnboardingLink } from "../services/callable";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useToast } from "@/components/ui/use-toast";

export const AddPayoutMethod = () => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "activateSubscription.addPayoutMethod_modal",
  });
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const navigateToHostedOnboarding = async () => {
    try {
      setLoading(true);
      const { data } = await getStripeOnboardingLink();
      window.location.href = data.url;
    } catch (error) {
      logError(error);
      let message = "Failed to fetch account session";
      if (error instanceof FirebaseError) {
        message = error.message;
        toast({
          text: message,
          variant: "destructive",
          duration: 5000,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Button
        className="w-full"
        onClick={async () => {
          await navigateToHostedOnboarding();
        }}
        disabled={loading}
        loading={loading}
      >
        {t("button")}
      </Button>
    </div>
  );
};
