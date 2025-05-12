import { Button } from "@/components/ui/button";
import { useAddCardModal } from "../../hooks/useAddCardModal";
import { useTranslation } from "react-i18next";

export const AddPaymentMethodButton = () => {
  const { openAddCardModal } = useAddCardModal(true);
  const { t } = useTranslation();
  return (
    <Button
      variant="ghost"
      className="h-[62px] gap-2.5 justify-start py-2 px-5 hover:bg-transparent"
      onClick={() => openAddCardModal()}
      icon={
        <span className="w-[46px] h-[46px] md:w-14 md:h-14 flex justify-center items-center bg-grayscale-4 rounded-full">
          <img
            src="/icon/add-without-border.svg"
            alt="Add Payment Method"
            className="w-6 h-6"
          />
        </span>
      }
    >
      {t("paymentMethod.addText")}
    </Button>
  );
};
