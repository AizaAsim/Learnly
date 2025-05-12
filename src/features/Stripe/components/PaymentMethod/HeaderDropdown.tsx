import { UserActionDropdown } from "@/components/UserActionDropdown";
import {
  selectPaymentMethods,
  selectPaymentMethodsLoading,
} from "@/store/selectors/paymentMethodsSelectors";
import { useSelector } from "react-redux";
import { useAddCardModal } from "../../hooks/useAddCardModal";
import { useTranslation } from "react-i18next";
import { useDeviceType } from "@/hooks/useDeviceType";

export const PaymentMethodsHeaderDropdown = () => {
  const { openAddCardModal } = useAddCardModal();
  const noOfCards = useSelector(selectPaymentMethods).length;
  const loading = useSelector(selectPaymentMethodsLoading);
  const { t } = useTranslation();
  const { isMobile } = useDeviceType();

  const actions = [
    {
      label: t("paymentMethod.addText"),
      onClick: openAddCardModal,
      iconSrc: "/icon/add-card.svg",
    },
  ];

  // Don't render anything while loading
  if (loading) {
    return null;
  }

  // Render the dropdown in mobile only if there are NO cards (since it has an "Add" button)
  // In desktop, always render the dropdown
  return noOfCards === 0 || !isMobile ? (
    <UserActionDropdown
      actions={actions}
      menuTriggerClassName="bg-transparent"
      menuContentOffset={isMobile ? 10 : 17}
    />
  ) : null;
};
