import { useToast } from "@/components/ui/use-toast";
import { Settings } from "@/features/Settings/components/Settings";
import { useDeviceType } from "@/hooks/useDeviceType";
import { useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const SettingsPage = () => {
  const { isDesktop } = useDeviceType();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { toast } = useToast();
  const isEmailUpdated = JSON.parse(
    localStorage.getItem("isEmailUpdated") || "false"
  );

  const showEmailUpdatedToast = useCallback(() => {
    toast({
      variant: "success",
      text: t("settings_toast_emailUpdated"),
    });
    localStorage.removeItem("isEmailUpdated");
  }, [t, toast]);

  useEffect(() => {
    if (isEmailUpdated) showEmailUpdatedToast();
  }, [isEmailUpdated, showEmailUpdatedToast]);

  useEffect(() => {
    if (isDesktop) navigate("/settings/edit-profile");
  }, [isDesktop, navigate]);

  return (
    <Settings className="max-w-[665px] md:mx-auto rounded-[18px] bg-grayscale-4 xs:mx-5 mx-5 my-4 md:my-6 lg:my-7" />
  );
};

export default SettingsPage;
