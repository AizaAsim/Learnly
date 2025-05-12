import { NoContentDisplay } from "@/components/NoContentDisplay";
import { Error } from "@/components/ui/error";
import { Spinner } from "@/components/ui/spinner";
import { useAuth } from "@/features/Auth/hooks/useAuth";
import { AddPaymentMethodButton } from "@/features/Stripe/components/PaymentMethod/AddButton";
import PaymentMethodCard from "@/features/Stripe/components/PaymentMethod";
import { PaymentMethodCardSkeleton } from "@/features/Stripe/components/PaymentMethod/Skeleton";
import { usePaymentMethodsListener } from "@/features/Stripe/hooks/usePaymentMethodsListener";
import {
  selectPaymentMethods,
  selectPaymentMethodsError,
  selectPaymentMethodsLoading,
  selectPendingAdditions,
} from "@/store/selectors/paymentMethodsSelectors";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { ScrollViewContainer } from "@/components/wrapper/ScrollViewContainer";
import { AnimatePresence, motion } from "framer-motion";

const PaymentMethodPage = () => {
  const { user } = useAuth();
  const cards = useSelector(selectPaymentMethods);
  const loading = useSelector(selectPaymentMethodsLoading);
  const error = useSelector(selectPaymentMethodsError);
  const pendingAdditions = useSelector(selectPendingAdditions);
  const { t } = useTranslation(undefined, { keyPrefix: "paymentMethod" });

  // Set up Firestore listener
  usePaymentMethodsListener(user?.uid);

  if (error) {
    return <Error>{error}</Error>;
  }

  return (
    <ScrollViewContainer className="overflow-y-auto max-w-[678px] mx-auto">
      <div className="flex flex-col mt-3 md:mt-5">
        {loading && <Spinner />}

        {/* Render skeleton loaders for pending additions */}
        {pendingAdditions.map((tempId) => (
          <PaymentMethodCardSkeleton key={tempId} />
        ))}

        {/* Render actual payment methods and add payment method button */}
        {!loading && cards.length !== 0 && (
          <AnimatePresence>
            {cards.map((card) => (
              <motion.div
                key={card.id}
                layout={true}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <PaymentMethodCard paymentMethod={card} />
              </motion.div>
            ))}
            <motion.div
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <AddPaymentMethodButton />
            </motion.div>
          </AnimatePresence>
        )}

        {!loading && cards.length === 0 && pendingAdditions.length === 0 && (
          <NoContentDisplay
            text={t("emptyText")}
            iconSrc="/icon/card-light.svg"
          />
        )}
      </div>
    </ScrollViewContainer>
  );
};

export default PaymentMethodPage;
