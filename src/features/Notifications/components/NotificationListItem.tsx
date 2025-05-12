import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
  Notification,
  NotificationIconMap,
  NotificationIconType,
  NotificationType,
} from "../types";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import { useCallback, useEffect, useRef } from "react";
import { useNotificationActions } from "../hooks/useNotificationAction";
import { cn, formatTimeDifference } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { logInfo } from "@/services/logging";
import { usePostNotificationModals } from "@/features/Videos/hooks/usePostNotificationModals";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store";
import {
  fetchBlockedReel,
  setBlockedReelId,
} from "@/store/reducers/blockedReelReducer";
import { UserActionDropdown } from "@/components/UserActionDropdown";

interface NotificationListItemProps {
  item: Notification;
}

export const NotificationListItem = ({ item }: NotificationListItemProps) => {
  const {
    id,
    iconType,
    message,
    title,
    readAt,
    type,
    iconStorageUrl,
    sentAt,
    metadata,
  } = item;
  // TODO: Handle isVerified
  const isVerified = false;
  const { isIntersecting, ref } = useIntersectionObserver({
    threshold: 1,
  });
  const { handleMarkAsRead, handleClear } = useNotificationActions();
  const { openPostRemovedModal, openPostRestoredModal, openPostDeletedModal } =
    usePostNotificationModals();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const dragStartX = useRef(0);

  useEffect(() => {
    (async () => {
      if (isIntersecting && !readAt) {
        await handleMarkAsRead(id);
      }
    })();
  }, [isIntersecting, handleMarkAsRead, id, readAt]);

  const getIconSrc = useCallback(() => {
    const defaultIcon = "/img/logo-icon-only.svg";
    switch (iconType) {
      case NotificationIconType.STATIC:
        return NotificationIconMap[type] || defaultIcon;
      case NotificationIconType.STORAGE:
        return iconStorageUrl || defaultIcon;
      default:
        return defaultIcon;
    }
  }, [iconStorageUrl, iconType, type]);

  // Handle onClick event based on notification type
  const handleNotificationClick = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    // Prevent click event if user swiped
    if (Math.abs(dragStartX.current - e.clientX) > 7) return;

    switch (type) {
      case NotificationType.USER_NEW_SUBSCRIPTION:
      case NotificationType.USER_CANCEL_SUBSCRIPTION:
      case NotificationType.USER_SCHEDULE_CANCEL_SUBSCRIPTION:
      case NotificationType.USER_PAYMENT_FAILED:
      case NotificationType.USER_BLOCKED:
      case NotificationType.USER_UNBLOCKED: {
        // Navigate user to creator profile
        const username = metadata?.creatorUsername;
        if (username) navigate(`/${username}`);
        break;
      }
      case NotificationType.USER_PAYMENT_METHOD_UPDATE:
        // Navigate to payment methods page
        navigate("/settings/payment-method");
        break;
      case NotificationType.USER_NEW_POST: {
        // Navigate to reel
        const reelId = metadata?.reelId;
        if (reelId) navigate(`/home/${reelId}`);
        break;
      }
      case NotificationType.CREATOR_EMAIL_UPDATE:
      case NotificationType.USER_EMAIL_UPDATE: {
        // Navigate to edit profile settings
        navigate("/settings/edit-profile");
        break;
      }
      case NotificationType.CREATOR_POST_REMOVED: {
        const reelId = metadata?.reelId;
        if (reelId && typeof reelId === "string") {
          dispatch(setBlockedReelId(reelId));
          dispatch(fetchBlockedReel());
          openPostRemovedModal();
        }
        break;
      }
      case NotificationType.CREATOR_POST_RESTORED: {
        const reelId = metadata?.reelId;
        if (reelId && typeof reelId === "string") {
          dispatch(setBlockedReelId(reelId));
          dispatch(fetchBlockedReel());
          openPostRestoredModal();
        }
        break;
      }
      case NotificationType.CREATOR_POST_DELETED: {
        const reelId = metadata?.reelId;
        if (reelId && typeof reelId === "string") {
          dispatch(setBlockedReelId(reelId));
          dispatch(fetchBlockedReel());
          openPostDeletedModal();
        }
        break;
      }
      default:
        logInfo(`No action defined for notification type: ${type}`);
        break;
    }
  };

  const actions = [
    {
      label: "Delete",
      onClick: () => handleClear(id),
      iconSrc: "/icon/delete-red-outlined.svg",
      className: "text-red md:p-3 w-40 h-11",
    },
  ];

  return (
    <div
      className="flex items-center justify-between px-5 py-2 md:p-2.5 min-w-full select-none rounded-xl cursor-pointer hover:bg-grayscale-4"
      ref={ref}
      onMouseDown={(e) => (dragStartX.current = e.clientX)}
      onMouseUp={handleNotificationClick}
    >
      <div className="flex items-center gap-2.5 w-full">
        <Avatar className="size-[52px] md:size-14">
          <AvatarImage
            className={cn("size-[52px] md:size-14 rounded-[30%] object-cover", {
              "bg-grayscale-4 p-1": iconType === NotificationIconType.STATIC,
            })}
            src={getIconSrc()}
            alt="notification icon"
          />
        </Avatar>
        <div className="flex flex-col gap-[3px] w-full overflow-auto">
          <div className="flex gap-1 items-center">
            <span className="text-primaryBlue text-[15px] md:text-base font-semibold capitalize leading-5 md:leading-[22px] -tracking-[0.15px] md:-tracking-[0.16px]">
              {title}
            </span>
            {isVerified && (
              <img
                src="/icon/verification-badge.svg"
                alt="verified"
                className="size-[18px]"
              />
            )}
          </div>
          <div className="flex w-full gap-1.5 relative">
            <span className="text-dark-T80 text-sm md:text-base font-medium leading-[18px] md:leading-[22px] capitalize truncate -tracking-[0.14px] md:-tracking-[0.16px]">
              {message}
            </span>
            <span className="text-dark-T50 text-sm md:text-base font-medium leading-[18px] md:leading-[22px] capitalize whitespace-nowrap -tracking-[0.14px] md:-tracking-[0.16px]">
              {formatTimeDifference(sentAt)}
            </span>
          </div>
        </div>
        <div
          className="w-10 hidden md:block"
          onMouseUp={(e) => e.stopPropagation()}
        >
          <UserActionDropdown
            actions={actions}
            menuTriggerClassName="bg-dark-T8 size-10"
            menuTriggerIconClassName="size-5"
            menuContentClassName="shadow-blur-2xl"
            modal={true}
          />
        </div>
      </div>
    </div>
  );
};
