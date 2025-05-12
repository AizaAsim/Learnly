import PhoneIcon from "@/assets/phone.svg";
import EmailIcon from "@/assets/envelope.svg";
import { useTranslation } from "react-i18next";
import { AddRecoveryMethodLink } from "@/features/Settings/components/AddRecoveryMethodLink";
import { useRecoveryMethodModals } from "@/features/Settings/hooks/useRecoveryMethodModals";
import { RecoveryMethod, RecoveryMethods } from "@/features/Auth/types";
import { useEffect, useState } from "react";
import { formatPhoneNumber } from "@/lib/utils";
import { logError } from "@/services/logging";
import { Spinner } from "@/components/ui/spinner";
import { fetchRecoveryMethods } from "@/features/Settings/services/callable";

const AddRecoveryMethodPage = () => {
  const { t } = useTranslation();
  const { openRecoveryMethodModal } = useRecoveryMethodModals();
  const [recoveryPhone, setRecoveryPhone] = useState<string | null>(null);
  const [recoveryEmail, setRecoveryEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    async function getRecoveryMethods() {
      try {
        setLoading(true);

        const { data } = await fetchRecoveryMethods();

        setRecoveryPhone(
          data.recoveryPhone ? formatPhoneNumber(data.recoveryPhone) : null
        );
        setRecoveryEmail(data.recoveryEmail);
      } catch (error) {
        logError("Error fetching recovery methods:", error);
      }
      setLoading(false);
    }
    getRecoveryMethods();
  }, []);

  const handleAddRecoveryMethodLink = (
    recoveryMethod: RecoveryMethod,
    existingValue?: string
  ) => {
    openRecoveryMethodModal(recoveryMethod, existingValue);
  };

  return loading ? (
    <Spinner />
  ) : (
    <div className="w-full max-w-[678px] mx-auto">
      <div className="w-full flex flex-col items-center pt-3 pb-[26px] px-6 md:pt-2.5 md:pb-8 max-w-[442px] mx-auto">
        <p className="text-primaryBlue font-medium text-[15px] leading-5 -tracking-[0.225px] text-center">
          {t("settings_accountRecovery_description")}
        </p>
      </div>
      <div className="bg-lightBlue/40 my-2 md:py-0 mx-5 rounded-3xl ">
        <AddRecoveryMethodLink
          icon={PhoneIcon}
          text={recoveryPhone || t("settings_accountRecovery_phone")}
          onClick={() =>
            handleAddRecoveryMethodLink(
              RecoveryMethods.PHONE,
              recoveryPhone ? recoveryPhone : ""
            )
          }
        />
        <AddRecoveryMethodLink
          icon={EmailIcon}
          text={recoveryEmail || t("settings_accountRecovery_email")}
          onClick={() =>
            handleAddRecoveryMethodLink(
              RecoveryMethods.EMAIL,
              recoveryEmail ? recoveryEmail : ""
            )
          }
        />
      </div>
    </div>
  );
};

export default AddRecoveryMethodPage;
