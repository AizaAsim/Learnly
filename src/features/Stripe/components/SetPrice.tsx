import { Button } from "@/components/ui/button";
import { Error } from "@/components/ui/error";
import { PriceInput } from "@/components/ui/price-input";
import { cn } from "@/lib/utils";
import { Trans, useTranslation } from "react-i18next";
import { useSetPrice } from "../hooks/useSetPrice";

interface SetPriceProps {
  buttonText?: string;
  onSuccess?: () => void;
  showNote?: boolean;
  className?: string;
  disableBasedOnIsModified?: boolean;
}

export const SetPrice = ({
  buttonText,
  onSuccess,
  showNote = false,
  className,
  disableBasedOnIsModified = true,
}: SetPriceProps) => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "activateSubscription.setPrice",
  });

  const { register, handleSubmit, errors, onSubmit, price, isModified } =
    useSetPrice(onSuccess);

  return (
    <div className={cn("flex flex-col items-stretch gap-y-3", className)}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="relative mb-4 md:mb-5 flex flex-col gap-1.5">
          <PriceInput
            placeholder={t("input_placeholder")}
            {...register("price")}
            containerClassName={cn({
              [classes.errorState]: errors.price,
            })}
            price={price}
          />
          {errors.price && (
            <Error className={classes.errorMsg}>
              <img src="/icon/info.svg" alt="info" />
              <p>{errors.price.message}</p>
            </Error>
          )}
        </div>

        <Button
          className="w-full"
          disabled={
            !price ||
            !!errors.price?.message ||
            (disableBasedOnIsModified && !isModified)
          }
        >
          {buttonText ?? t("button_continue")}
        </Button>
      </form>
      {showNote && (
        <p className="text-center font-medium text-dark-T50 text-xs/4 -tracking-[0.12px]">
          <Trans
            i18nKey={"activateSubscription.setPrice.note"}
            components={{
              span: <span className="text-dark-T80 underline" />,
            }}
          />
        </p>
      )}
    </div>
  );
};

const classes = {
  errorState: "border-red bg-red-t4",
  errorMsg: "flex items-center gap-1.5",
};
