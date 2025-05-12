import { useToast } from "@/components/ui/use-toast";
import { UserActionDropdown } from "@/components/UserActionDropdown";
import { useUnsubscribeModal } from "@/features/Stripe/hooks/useUnsubscribeModal";
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";
import { useReport } from "@/hooks/useReport";
import { ReportType } from "@/services/callable";
import {
  selectCancelAtPeriodEnd,
  selectCreatorId,
  selectIsSubscribed,
} from "@/store/selectors/creatorProfileSelectors";
import { useSelector } from "react-redux";
import { useReportProfile } from "../hooks/useReportProfile";
import { useTranslation } from "react-i18next";

export const CreatorProfileHeaderDropdown = () => {
  const [, copyUrl] = useCopyToClipboard();
  const { toast } = useToast();
  const { t } = useTranslation();
  const creatorId = useSelector(selectCreatorId);
  const isSubscribed = useSelector(selectIsSubscribed);
  const cancelAtPeriodEnd = useSelector(selectCancelAtPeriodEnd);
  const { handleReport } = useReportProfile();
  const { report } = useReport(ReportType.USER, handleReport);
  const { openUnsubscribeModal } = useUnsubscribeModal();

  const handleCopyLink = async () => {
    const isCopied = await copyUrl(window.location.href);
    if (isCopied)
      toast({
        text: t("link_copy"),
        variant: "success",
      });
    else toast({ text: "Failed to copy link", variant: "destructive" });
  };

  const actions = [
    {
      label: "Copy Link",
      onClick: handleCopyLink,
      iconSrc: "/icon/link-black.svg",
    },
    ...(isSubscribed && !cancelAtPeriodEnd
      ? [
          {
            label: "Unsubscribe",
            onClick: () => creatorId && openUnsubscribeModal(creatorId),
            iconSrc: "/icon/no-star.svg",
          },
        ]
      : []),
    {
      label: "Report",
      onClick: report,
      iconSrc: "/icon/flag-black.svg",
    },
  ];

  if (!creatorId) return null;

  return (
    <UserActionDropdown
      actions={actions}
      menuTriggerClassName="bg-transparent"
    />
  );
};
