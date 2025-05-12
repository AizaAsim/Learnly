import { NoContentDisplay } from "@/components/NoContentDisplay";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  hasUnreadNotificationsSelector,
  notificationsCountSelector,
} from "@/store/selectors/notificationSelectors";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useNotificationActions } from "../hooks/useNotificationAction";
import NotificationList from "./NotificationList";
import { useState } from "react";
import { cn } from "@/lib/utils";

export const NotificationMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const notificationsCount = useSelector(notificationsCountSelector);
  const hasUnreadNotification = useSelector(hasUnreadNotificationsSelector);
  const { t } = useTranslation();
  const { handleClearAll } = useNotificationActions();

  return (
    <DropdownMenu open={isOpen}>
      <DropdownMenuTrigger
        onClick={() => setIsOpen((prev) => !prev)}
        className={cn(
          "relative size-11 hover:bg-grayscale-4 text-grayscale-100 rounded-2xl flex justify-center items-center p-0 focus-visible:outline-none select-none",
          { "bg-grayscale-4": isOpen }
        )}
      >
        <img src="/icon/notifications_icon.svg" className="size-7" />
        {hasUnreadNotification && (
          <div className="absolute top-2 right-2.5 w-2.5 h-2.5 bg-red border-[2px] border-light-T100 rounded-full" />
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="rounded-[32px] border border-grayscale-8 relative w-[480px] max-h-[600px] min-h-[316px] p-0 flex flex-col"
        onPointerDownOutside={() => setIsOpen(false)}
      >
        <DropdownMenuLabel className="flex justify-between items-center pt-7 pb-3.5 px-8 bg-light-T100 border-b border-dark-T8 z-10">
          <h3 className="text-xl font-bold leading-[26px] -tracking-[0.2px] text-primaryBlue">
            Notifications
          </h3>
          {notificationsCount > 0 && (
            <Button
              variant="ghost"
              className="py-0 px-0 h-auto text-grayscale-60 hover:bg-transparent"
              onClick={handleClearAll}
            >
              Clear All
            </Button>
          )}
        </DropdownMenuLabel>

        <div className="overflow-y-scroll flex-1">
          {notificationsCount > 0 ? (
            <NotificationList />
          ) : (
            <NoContentDisplay
              text={t("notifications_empty_text")}
              iconSrc="/icon/notifications-light.svg"
              className="relative w-[368px] py-12 mx-auto"
            />
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
