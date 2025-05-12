import { Button } from "@/components/ui/button";
import { firebaseTimestampToReadAbleDate } from "@/lib/utils";
import { FirebaseTimestamp } from "@/types";
import { Trans, useTranslation } from "react-i18next";

interface UnsubscribeCreatorProps {
  onConfirm: () => void;
  expirationDate: FirebaseTimestamp;
}

export const SuccessfulUnsubscribeModal = ({
  onConfirm,
  expirationDate,
}: UnsubscribeCreatorProps) => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "cancel_subscription_success",
  });

  return (
    <div>
      <h3 className="font-bold text-center text-xl leading-[26px] mb-2.5">
        {t("headline")}
      </h3>

      <p className="text-grayscale-60 font-medium -tracking-[0.16px] text-center mb-8">
        <Trans
          i18nKey="cancel_subscription_success.description"
          values={{
            expirationDate: firebaseTimestampToReadAbleDate(expirationDate),
          }}
          components={{
            strong: <span className="font-semibold" />,
          }}
        />
      </p>
      <Button className="w-full" onClick={onConfirm} variant="secondary">
        {t("confirm")}
      </Button>
    </div>
  );
};
