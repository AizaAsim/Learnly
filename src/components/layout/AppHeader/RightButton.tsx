import { Button } from "@/components/ui/button";
import { useAuth } from "@/features/Auth/hooks/useAuth";
import NotificationHeaderDropdown from "@/features/Notifications/components/NotificationHeaderDropdown";
import { NotificationMenu } from "@/features/Notifications/components/NotificationMenu";
import { CreatorProfileHeaderDropdown } from "@/features/Profile/components/CreatorProfileHeaderDropdown";
import { PaymentMethodsHeaderDropdown } from "@/features/Stripe/components/PaymentMethod/HeaderDropdown";
import { useDeviceType } from "@/hooks/useDeviceType";
import { ROUTES } from "@/lib/CONST";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate, useParams } from "react-router-dom";

export const RightButton = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const params = useParams();
  const { isLoggedIn } = useAuth();
  const { isMobile } = useDeviceType();
  const { t } = useTranslation();

  const getMainContent = () => {
    if (!isLoggedIn && params.username) {
      return (
        <Button
          size="sm"
          variant="link"
          className="h-auto p-0 text-base/[22px] -leading-[0.16px] text-dark-T70"
          onClick={() => navigate(ROUTES.AUTH, { state: { tab: "user" } })}
        >
          {t("header_sign_in")}
        </Button>
      );
    }

    if (params.username) return <CreatorProfileHeaderDropdown />;
    if (pathname === ROUTES.MY_PROFILE) {
      return (
        <div className="cursor-pointer" onClick={() => navigate("/settings")}>
          <img src="/icon/settings.svg" alt="settings" />
        </div>
      );
    }
    if (pathname === ROUTES.NOTIFICATIONS)
      return <NotificationHeaderDropdown />;
    if (pathname === ROUTES.PAYMENT_METHODS)
      return <PaymentMethodsHeaderDropdown />;

    return null;
  };

  const mainContent = getMainContent();
  const shouldShowNotification = !isMobile && isLoggedIn;

  if (!shouldShowNotification) return mainContent;
  if (!mainContent) return <NotificationMenu />;

  return (
    <div className="flex items-center gap-3">
      <NotificationMenu />
      {mainContent}
    </div>
  );
};
