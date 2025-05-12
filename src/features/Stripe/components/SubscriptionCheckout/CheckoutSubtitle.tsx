import { motion } from "framer-motion";
import {
  checkoutContainerVariants,
  checkoutItemVariants,
} from "./animation-variants";
import { Trans } from "react-i18next";

interface CheckoutSubtitleProps {
  creatorName: string;
}

export const CheckoutSubtitle = ({ creatorName }: CheckoutSubtitleProps) => {
  return (
    <motion.span
      initial="hidden"
      animate="visible"
      variants={checkoutContainerVariants}
    >
      <motion.span variants={checkoutItemVariants}>
        <Trans
          i18nKey="checkout.headline"
          components={{
            strong: <span className="font-bold text-grayscale-80" />,
          }}
          values={{ creatorName }}
        />
      </motion.span>
    </motion.span>
  );
};
