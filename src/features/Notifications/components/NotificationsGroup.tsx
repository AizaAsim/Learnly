import { SwipeableListComponent } from "@/features/Notifications/components/SwipeableListComponent.tsx";
import { useDeviceType } from "@/hooks/useDeviceType";
import { NotificationListItem } from "./NotificationListItem";
import { Notification } from "../types";

interface NotificationsGroupProps {
  title: string;
  list: Notification[];
}

const NotificationsGroup = ({ title, list }: NotificationsGroupProps) => {
  const { isMobile } = useDeviceType();

  return (
    <div>
      <span className="text-dark-T50 text-sm md:text-base font-semibold mb-2 md:mb-0 px-5 md:px-2.5 leading-[18px] md:leading-[22px] block -tracking-[0.14px] md:-tracking-[0.16px]">
        {title}
      </span>
      {isMobile ? (
        <SwipeableListComponent list={list} />
      ) : (
        <>
          {list.map((item) => (
            <NotificationListItem key={item.id} item={item} />
          ))}
        </>
      )}
    </div>
  );
};

export default NotificationsGroup;
