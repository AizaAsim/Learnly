import { useToast } from "@/components/ui/use-toast";
import { SetPrice } from "@/features/Stripe/components/SetPrice";
import { Trans, useTranslation } from "react-i18next";

function SubscriptionPricePage() {
  const { t } = useTranslation(undefined, {
    keyPrefix: "activateSubscription.setPrice",
  });
  const { toast } = useToast();

  const handleSuccessfulPriceSave = () => {
    toast({
      text: t("toast_sucess_message"),
      variant: "success",
      className: "w-[246px]",
    });
  };

  return (
    <div className="px-6 py-2 md:px-0 md:py-2.5 mx-auto flex flex-col gap-[30px] w-full md:max-w-[443px]">
      <p className="text-grayscale-60 font-medium leading-[22px] md:leading-6 -tracking-[0.16px] md:tracking-normal text-center">
        {t("description") + " "}
        <Trans
          i18nKey={"activateSubscription.setPrice.learn_more"}
          components={{
            underline: (
              <a className="text-grayscale-80 underline font-semibold underline-offset-4 md:-tracking-[0.16px]"></a>
            ),
          }}
        />
      </p>
      <SetPrice
        buttonText={t("button_changePrice")}
        onSuccess={handleSuccessfulPriceSave}
      />
      <div className="flex gap-2 rounded-[14px] bg-yellow-t20 backdrop-blur-[20px] py-3 pl-3 pr-4">
        <img src="/icon/info-orange.svg" className="size-6" />
        <p className="text-sm/[18px] md:text-[15px]/5 -tracking-[0.14px] md:-tracking-[0.225px] text-dark-T80 font-semibold">
          {t("price_update_note")}
        </p>
      </div>
    </div>
  );
}

export default SubscriptionPricePage;
