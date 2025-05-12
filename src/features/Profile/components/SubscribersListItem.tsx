import { UserActionDropdown } from "@/components/UserActionDropdown";
import { UserListItem } from "@/components/UserListItem";
import { UserRootDoc } from "@/features/Auth/types";
import { Subscriber } from "@/features/Stripe/types";
import { useDocumentOnce } from "@/hooks/useDocumentOnce";
import { useModal } from "@/hooks/useModal";
import { MouseEvent } from "react";
import { SubscriberItem } from "./SubscriberItem";
import { Trans, useTranslation } from "react-i18next";
import { formatCurrency } from "@/lib/utils";
import { BlockedUserModal } from "./BlockedUserModal";

interface SubscribersListItemProps {
  subscription: Subscriber;
  onBlockUser: (id: string) => void;
}

export const SubscribersListItem = ({
  subscription,
  onBlockUser,
}: SubscribersListItemProps) => {
  const {
    document: subscriber,
    error,
    loading,
  } = useDocumentOnce<UserRootDoc>("users", subscription.subscriberId);
  const { openModal, setModal } = useModal();
  const { t } = useTranslation();

  const handleClick = (creatorName: string) => {
    setModal(
      <SubscriberItem
        subscription={subscription}
      // It is decided to not include subscriber billing history in the app
      // onPaymentClick={(subscriberId: string) => {
      //   navigate(`/learners/billing-history/${subscriberId}`);
      //   closeModal();
      // }}
      />,
      {
        title: creatorName,
        subtitle: t("subscription_info.amountPerMonth", {
          amount: formatCurrency(subscription.amount / 100),
        }),
      }
    );
    openModal();
  };

  const openBlockModal = (event: MouseEvent) => {
    event.stopPropagation();
    if (!subscriber) return;
    setModal(
      <BlockedUserModal
        subscriberId={subscriber?.id}
        onBlock={() => onBlockUser(subscription.id)}
      />,
      {
        title: t("blocked_user.headline"),
        subtitle: (
          <Trans
            i18nKey="blocked_user.description"
            components={{
              underline: <a className="underline font-bold" href="#" />,
            }}
          />
        ),
      }
    );
    openModal();
  };

  const actions = [
    {
      label: "Block",
      onClick: openBlockModal,
      iconSrc: "/icon/ban.svg",
      className: "text-red hover:text-red focus:text-red",
    },
  ];

  return (
    <UserListItem
      loading={loading}
      error={error?.message}
      leftTopContent={subscriber?.displayName}
      leftBottomContent={
        subscription.status === "trialing" ? "Active" : subscription.status
      }
      avatarUrl={subscriber?.avatar_url || null}
      onClick={() => handleClick(subscriber?.displayName || "Educator")}
      rightContent={
        <UserActionDropdown
          actions={actions}
          menuTriggerClassName="w-9 h-9 p-[9px] bg-grayscale-8 rounded-xl"
          menuTriggerIconSrc="/icon/subscriber-info.svg"
          menuTriggerIconClassName="w-[18px] h-[18px]"
        />
      }
    />
  );
};
