import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { PAYMENT_METHOD_NAMES_AND_ICONS } from "../../CONST";
import { PaymentMethod } from "../../types";
import { ActionMenu } from "./ActionMenu";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { selectPendingDeletions } from "@/store/selectors/paymentMethodsSelectors";
import { Button } from "@/components/ui/button";
import { router } from "@/router";
import { useCallback } from "react";
import { useModal } from "@/hooks/useModal";

interface PaymentMethodProps {
  paymentMethod: PaymentMethod;
  className?: string;
  isCheckout?: boolean;
}

const getIcon = (brand: string) => {
  const matchedBrand = PAYMENT_METHOD_NAMES_AND_ICONS.find(
    (item) => item.name === brand
  );
  return matchedBrand?.icon || "/icon/payment-methods/card.svg";
};

const PaymentMethodCard = ({
  paymentMethod,
  className,
  isCheckout = false,
}: PaymentMethodProps) => {
  const {
    brand: cardBrand,
    last4: cardNumber,
    expMonth,
    expYear,
    isActive,
    id,
  } = paymentMethod;
  const { t } = useTranslation(undefined, { keyPrefix: "paymentMethod" });
  const pendingDeletions = useSelector(selectPendingDeletions);
  const isDeleting = pendingDeletions.includes(paymentMethod.id);
  const { closeModal } = useModal();

  const handleChange = useCallback(() => {
    router.navigate("/settings/payment-method");
    closeModal();
  }, [closeModal]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: isDeleting ? 0.5 : 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 20,
        }}
        className={cn(
          "flex justify-between items-center px-5 py-2 md:py-2.5",
          { "pointer-events-none": isDeleting },
          className
        )}
      >
        <div className="flex gap-2.5">
          <motion.div
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.5 }}
            className="w-[46px] h-[46px] md:w-14 md:h-14 bg-grayscale-4 rounded-full flex justify-center items-center"
          >
            <img
              src={getIcon(cardBrand)}
              alt={`${cardBrand} Card Icon`}
              className="w-6 h-6 md:w-7 md:h-7"
            />
          </motion.div>
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.3 }}
            className="flex flex-col gap-1"
          >
            <div className="flex gap-1">
              <p className="font-semibold text-[15px] md:text-lg leading-5 -tracking[0.15px]">
                {`•••• ${cardNumber} `}
                {isActive && !isCheckout && t("activeLable")}
              </p>
            </div>
            <p className="font-medium text-sm text-grayscale-70 leading-[18px] -tracking-[0.14px]">
              {t("expire")}: {expMonth || "--"}/{expYear || "----"}
            </p>
          </motion.div>
        </div>
        {!isCheckout && <ActionMenu isActive={isActive} paymentMethodId={id} />}
        {isCheckout && (
          <Button
            variant="ghost"
            className="p-0 text-grayscale-80 h-auto"
            onClick={handleChange}
            type="button"
          >
            {t("change_card")}
          </Button>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default PaymentMethodCard;
