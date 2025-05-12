import { UserActionDropdown } from "@/components/UserActionDropdown";
import { useTranslation } from "react-i18next";
import {
  deleteCustomerCard,
  makeCustomerCardDefault,
} from "../../services/callable";
import { useToast } from "@/components/ui/use-toast";
import { logError } from "@/services/logging";
import { useDispatch, useSelector } from "react-redux";
import {
  startDeletingPaymentMethod,
  finishDeletingPaymentMethod,
} from "@/store/reducers/paymentMethodsReducer";
import { selectPendingDeletions } from "@/store/selectors/paymentMethodsSelectors";
import { AppDispatch } from "@/store";
interface ActionMenuProps {
  isActive: boolean;
  paymentMethodId: string;
}

export const ActionMenu = ({ isActive, paymentMethodId }: ActionMenuProps) => {
  const { t } = useTranslation(undefined, { keyPrefix: "paymentMethod.menu" });
  const { toast } = useToast();
  const dispatch = useDispatch<AppDispatch>();
  const pendingDeletions = useSelector(selectPendingDeletions);
  const isDeleting = pendingDeletions.includes(paymentMethodId);

  const handleDelete = async (id: string) => {
    if (isDeleting) return; // Prevent multiple deletion attempts
    dispatch(startDeletingPaymentMethod(id));
    try {
      await deleteCustomerCard({ paymentMethodId: id });
      // The actual removal will be handled by the Firestore listener
    } catch (error) {
      logError(error);
      dispatch(finishDeletingPaymentMethod(id)); // Remove from pending deletions
      toast({
        variant: "destructive",
        text: "Failed to delete card",
      });
    }
  };

  const actions = [
    {
      label: t("setDefault"),
      onClick: async () => await makeCustomerCardDefault({ paymentMethodId }),
      iconSrc: "/icon/checkmark-circular-black.svg",
      className: "text-grayscale-80 leading-[18px] border-b border-grayscale-4",
    },
    {
      label: t("delete"),
      onClick: () => handleDelete(paymentMethodId),
      iconSrc: "/icon/delete-red-outlined.svg",
      className: "text-red leading-[18px]",
    },
  ];

  if (isActive) return null;

  return (
    <UserActionDropdown
      actions={actions}
      menuTriggerClassName="bg-grayscale-8 p-[9px] rounded-xl"
      menuTriggerIconSrc="/icon/more-card.svg"
      menuTriggerIconClassName="w-[18px] h-[18px]"
    />
  );
};
