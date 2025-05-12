import { useEffect, RefObject, DependencyList } from "react";

type ClickAwayProps = {
  ref: RefObject<HTMLElement>;
  callback: () => void;
};

export function useClickAway(
  { ref, callback }: ClickAwayProps,
  deps: DependencyList = []
) {
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      // event.target is of type EventTarget, so we need to cast it to Node
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref, callback, ...deps]);
}
