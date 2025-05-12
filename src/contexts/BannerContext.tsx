import {
  BannerVariants,
  NotificationBanner,
} from "@/components/ui/notification-banner";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/features/Auth/hooks/useAuth";
import { Roles } from "@/features/Auth/types";
import { useActivateSubscriptionModals } from "@/features/Stripe/hooks/useActivateSubscriptionModals";
import { useCompletePaymentModal } from "@/features/Stripe/hooks/useCompletePaymentModal";
import { useCreatorStripeData } from "@/features/Stripe/hooks/useCreatorStripeData";
import { getStripeOnboardingLink } from "@/features/Stripe/services/callable";
import { StripeConnectOnboardError } from "@/features/Stripe/types";
import { constructStripeDashboardUrl } from "@/features/Stripe/utils";
import { logError, logInfo } from "@/services/logging";
import {
  selectCreatorProfileData,
  selectIsPastDue,
} from "@/store/selectors/creatorProfileSelectors";
import { format, fromUnixTime } from "date-fns";
import {
  ReactNode,
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  useRef,
} from "react";
import { Trans, useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

export type BannerData = {
  variant: BannerVariants["variant"];
  text: ReactNode; // Required for bold text in middle of translation
  buttonText: string;
  action: () => void;
  isLoading?: boolean;
};

export type BannerContextType = {
  hasBanner: boolean;
  banner: ReactNode;
  bannerData: BannerData | null;
  setBannerData: (bannerData: BannerData | null) => void;
  bannerHeight: number;
};

export const BannerContext = createContext<BannerContextType | undefined>(
  undefined
);

type GetBannerDataParams = {
  t: (key: string) => string;
  i18nKey: string;
  variant: BannerVariants["variant"];
  buttonKey: string;
  action: () => void;
  isLoading?: boolean;
  errors?: StripeConnectOnboardError[];
  currentDeadline?: number | null;
  creatorName?: string;
};

const getBannerData = ({
  t,
  i18nKey,
  variant,
  buttonKey,
  action,
  isLoading,
  errors,
  currentDeadline,
  creatorName,
}: GetBannerDataParams): BannerData => {
  let text: ReactNode;

  if (
    i18nKey === "stripe_banner.issue.description" &&
    errors &&
    errors.length > 0
  ) {
    text = errors.map((error) => <>{error.reason}</>);
  } else {
    const formattedDeadline = currentDeadline
      ? format(fromUnixTime(currentDeadline), "MMMM do, yyyy")
      : "-";
    text = (
      <Trans
        i18nKey={i18nKey}
        components={{
          strong: <span className="font-bold -tracking-[0.15px]" />,
        }}
        values={{ deadline: formattedDeadline, creatorName }}
      />
    );
  }

  return {
    variant,
    text,
    buttonText: t(buttonKey),
    action,
    isLoading,
  };
};

export const BannerProvider = ({ children }: { children: ReactNode }) => {
  const { t } = useTranslation();
  const { openSetPriceModal } = useActivateSubscriptionModals();
  const { openCompletePaymentModal } = useCompletePaymentModal();
  const { stripeData, isLoading } = useCreatorStripeData();
  const [bannerData, setBannerData] = useState<BannerData | null>(null);
  const [hasBanner, setHasBanner] = useState(false);
  const [isOnboardingLinkLoading, setIsOnboardingLinkLoading] = useState(false);
  const [bannerHeight, setBannerHeight] = useState(0);
  const { toast } = useToast();
  const { user } = useAuth();
  const bannerRef = useRef<HTMLDivElement>(null);
  const params = useParams();
  const isProfilePage = Object.keys(params).includes("username");
  const isPastDue = useSelector(selectIsPastDue);
  const creatorProfile = useSelector(selectCreatorProfileData);

  useEffect(() => {
    const updateBannerHeight = () => {
      if (bannerRef.current) {
        setBannerHeight(bannerRef.current.getBoundingClientRect().height);
      }
    };
    requestAnimationFrame(updateBannerHeight);
    window.addEventListener("resize", updateBannerHeight);
    return () => {
      window.removeEventListener("resize", updateBannerHeight);
    };
  }, [bannerData]);

  const getOnboardingLink = useCallback(async () => {
    setIsOnboardingLinkLoading(true);
    try {
      const { data } = await getStripeOnboardingLink();
      window.location.href = data.url;
    } catch (error) {
      logError("Failed to get onboarding link:", error);
      toast({
        text: t("stripe_banner.error.onboarding_link"),
      });
      setIsOnboardingLinkLoading(false);
    }
  }, [t, toast]);

  const handleSetUpRecovery = useCallback(() => {
    window.location.href = "/settings/add-recovery-method";
  }, []);

  useEffect(() => {
    if (isLoading || !user) {
      setHasBanner(false);
      setBannerData(null);
      return;
    }

    if (user.role === Roles.CREATOR && stripeData) {
      const {
        stripeConnectId,
        charges_enabled: chargesEnabled,
        payouts_enabled: payoutsEnabled,
        requirements: {
          currently_due: currentlyDue,
          past_due: pastDue,
          pending_verification: pendingVerification,
          errors,
          current_deadline: currentDeadline,
        },
        isOnboardingStarted,
        hasShownActivationModal,
      } = stripeData;

      const hasPendingVerificationIssues =
        pendingVerification.length > 0 && !chargesEnabled && !payoutsEnabled;

      const showBanner =
        !chargesEnabled ||
        !payoutsEnabled ||
        currentlyDue.length > 0 ||
        pastDue.length > 0 ||
        hasPendingVerificationIssues ||
        errors.length > 0;
      setHasBanner(showBanner);

      if (showBanner) {
        if (!isOnboardingStarted) {
          setBannerData(
            getBannerData({
              t,
              i18nKey: "stripe_banner.activate_subscription.description",
              variant: "warning",
              buttonKey: "stripe_banner.activate_subscription.button",
              action: () => openSetPriceModal(),
            })
          );
        } else if (pastDue.length > 0 && !hasShownActivationModal) {
          setBannerData(
            getBannerData({
              t,
              i18nKey:
                "stripe_banner.missing_before_once_activiated.description",
              variant: "warning",
              buttonKey: "stripe_banner.missing_before_once_activiated.button",
              action: getOnboardingLink,
              isLoading: isOnboardingLinkLoading,
              errors,
            })
          );
        } else if (pastDue.length > 0 && hasShownActivationModal) {
          setBannerData(
            getBannerData({
              t,
              i18nKey: "stripe_banner.issue.description",
              variant: "destructive",
              buttonKey: "stripe_banner.issue.button",
              action: getOnboardingLink,
              isLoading: isOnboardingLinkLoading,
              errors,
            })
          );
        } else if (currentlyDue.length > 0) {
          setBannerData(
            getBannerData({
              t,
              i18nKey: "stripe_banner.stripe_issue.description",
              variant: "destructive",
              buttonKey: "stripe_banner.stripe_issue.button",
              action: getOnboardingLink,
              isLoading: isOnboardingLinkLoading,
              currentDeadline,
            })
          );
        } else if (pendingVerification.length > 0) {
          setBannerData(
            getBannerData({
              t,
              i18nKey: "stripe_banner.under_verification.description",
              variant: "warning",
              buttonKey: "stripe_banner.under_verification.button",
              action: () => {
                if (stripeConnectId) {
                  const dashboardUrl =
                    constructStripeDashboardUrl(stripeConnectId);
                  window.location.href = dashboardUrl;
                }
              },
            })
          );
        } else {
          setBannerData(
            getBannerData({
              t,
              i18nKey: "stripe_banner.account_limited.description",
              variant: "warning",
              buttonKey: "stripe_banner.account_limited.button",
              action: () => logInfo("Contact Support Banner button clicked"),
            })
          );
        }
      }
    } else if (user.role === Roles.USER) {
      const showBanner = isProfilePage && isPastDue;
      setHasBanner(showBanner);
      if (showBanner) {
        setBannerData(
          getBannerData({
            t,
            i18nKey: "payment_failed_banner.description",
            variant: "destructive",
            buttonKey: "payment_failed_banner.button",
            action: openCompletePaymentModal,
            creatorName:
              creatorProfile?.displayName ||
              creatorProfile?.username ||
              "Educator",
          })
        );
      }
    }
  }, [
    stripeData,
    isLoading,
    t,
    openSetPriceModal,
    isOnboardingLinkLoading,
    getOnboardingLink,
    user,
    handleSetUpRecovery,
    isPastDue,
    isProfilePage,
    creatorProfile,
    openCompletePaymentModal,
  ]);

  const banner = useMemo(() => {
    return (
      hasBanner &&
      bannerData && (
        <div ref={bannerRef}>
          <NotificationBanner
            variant={bannerData.variant}
            message={bannerData.text}
            buttonText={bannerData.buttonText}
            buttonAction={bannerData.action}
            isLoading={bannerData.isLoading}
          />
        </div>
      )
    );
  }, [bannerData, hasBanner]);

  return (
    <BannerContext.Provider
      value={{
        hasBanner,
        banner,
        bannerData,
        setBannerData,
        bannerHeight,
      }}
    >
      {children}
    </BannerContext.Provider>
  );
};
