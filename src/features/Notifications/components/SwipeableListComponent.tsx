import { useEffect, useRef, createRef } from "react";
import {
  ActionAnimations,
  SwipeableList,
  SwipeableListItem,
} from "@sandstreamdev/react-swipeable-list";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import "@sandstreamdev/react-swipeable-list/dist/styles.css";
import { NotificationListItem } from "@/features/Notifications/components/NotificationListItem.tsx";
import { Notification } from "../types";
import { useNotificationActions } from "../hooks/useNotificationAction";

const BasicSwipeContent = ({ position }: { position: "left" | "right" }) => (
  <div
    className={`flex items-center h-full w-full bg-[#DC3840] ${position === "left" ? "justify-start pl-[21px]" : "justify-end pr-[21px]"}`}
  >
    <img src="/icon/delete.svg" alt="" />
  </div>
);

interface SwipeableListComponentProps {
  list: Notification[];
}

export const SwipeableListComponent = ({
  list,
}: SwipeableListComponentProps) => {
  const nodeRefs = useRef([]);
  const { handleClear } = useNotificationActions();

  useEffect(() => {
    nodeRefs.current = nodeRefs.current.slice(0, list.length);
  }, [list]);

  const deleteItemById = (id: string) => {
    setTimeout(
      () => {
        handleClear(id);
      },
      list.length > 1 ? 0 : 500
    );
  };

  const swipeRightOptions = (id: string) => ({
    content: <BasicSwipeContent position="left" />,
    actionAnimation: ActionAnimations.REMOVE,
    action: () => deleteItemById(id),
  });

  const swipeLeftOptions = (id: string) => ({
    content: <BasicSwipeContent position="right" />,
    actionAnimation: ActionAnimations.REMOVE,
    action: () => deleteItemById(id),
  });

  return (
    <SwipeableList threshold={0.33}>
      {({
        className,
        scrollStartThreshold,
        swipeStartThreshold,
        threshold,
      }) => (
        <TransitionGroup className={className} enter exit>
          {list.map((item, index) => {
            if (!nodeRefs.current[index]) {
              // eslint-disable-next-line
              // @ts-ignore
              nodeRefs.current[index] = createRef();
            }
            return (
              <CSSTransition
                nodeRef={nodeRefs.current[index]}
                key={item.id}
                classNames="my-node"
                timeout={500}
              >
                <div ref={nodeRefs.current[index]} className="w-full">
                  <SwipeableListItem
                    key={item.id}
                    scrollStartThreshold={scrollStartThreshold}
                    swipeLeft={swipeLeftOptions(item.id)}
                    swipeRight={swipeRightOptions(item.id)}
                    swipeStartThreshold={swipeStartThreshold}
                    threshold={threshold}
                  >
                    <NotificationListItem item={item} />
                  </SwipeableListItem>
                </div>
              </CSSTransition>
            );
          })}
        </TransitionGroup>
      )}
    </SwipeableList>
  );
};
