import { Button } from "@/components/ui/button";
import { COUNTRIES_SUPPORTED_BY_STRIPE } from "../CONST";
import { useActivateSubscriptionModals } from "../hooks/useActivateSubscriptionModals";

export const CountriesSupported = () => {
  const { openAddPayoutMethodModal } = useActivateSubscriptionModals();

  return (
    <div>
      <div className="grid grid-cols-2 gap-[9px] md:gap-4 max-h-[70vh] overflow-y-scroll">
        {COUNTRIES_SUPPORTED_BY_STRIPE.map(({ name, Flag }) => {
          return (
            <Button
              key={name}
              className="rounded-[15px] bg-dark-T4 hover:bg-dark-T6 px-3.5 py-[13px] md:px-4 md:py-[18px] gap-1.5 justify-start"
              onClick={openAddPayoutMethodModal}
            >
              <div className="w-6 h-6 flex items-center justify-center">
                <Flag className="w-5 rounded-sm" />
              </div>
              <span className="font-semibold text-sm text-dark-T70 leading-4.5 -tracking-[0.14px] text-ellipsis overflow-hidden whitespace-nowrap text-left">
                {name}
              </span>
            </Button>
          );
        })}
      </div>
    </div>
  );
};
