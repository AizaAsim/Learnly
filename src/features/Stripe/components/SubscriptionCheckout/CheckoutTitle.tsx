import { motion } from "framer-motion";
import {
  checkoutContainerVariants,
  checkoutItemVariants,
} from "./animation-variants";

interface CheckoutTitleProps {
  creatorName: string;
}

export const CheckoutTitle = ({ creatorName }: CheckoutTitleProps) => {
  return (
    <motion.span
      initial="hidden"
      animate="visible"
      variants={checkoutContainerVariants}
    >
      <motion.span
        variants={checkoutItemVariants}
        className="flex items-center justify-center gap-1"
      >
        {creatorName}
        {/* TODO: update condition after verification badge is implemented */}
        {false && (
          <img
            src="/icon/verification-badge-checkout.svg"
            className="w-5 h-5"
          />
        )}
      </motion.span>
    </motion.span>
  );
};
