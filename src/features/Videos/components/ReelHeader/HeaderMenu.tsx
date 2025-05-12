import { ReactNode, useEffect, useState } from "react";
import { Popover } from "@radix-ui/react-popover";
import { PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useDeviceType } from "@/hooks/useDeviceType";
import { cn } from "@/lib/utils";
import { useLocation } from "react-router-dom";
import { EllipsisIcon } from "lucide-react";

export const HeaderMenu = ({
  children,
}: {
  children?: (close: () => void) => ReactNode;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { isMobile } = useDeviceType();

  const location = useLocation();
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  function close() {
    setIsOpen(false);
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger
        className={cn("w-11 h-11 rounded-xxl flex items-center justify-end", {
          "backdrop-blur-lg bg-white/20 justify-center": !isMobile,
        })}
      >
        <EllipsisIcon className="w-7 h-7" />
      </PopoverTrigger>
      <PopoverContent
        className={cn(
          "mt-4 mr-[14px] min-w-[128px] backdrop-blur-lg bg-white/20 shadow-lg z-10 first-of-type:rounded-t-xl last-of-type:rounded-b-xl",
          {
            "-translate-x-10": !isMobile,
            "-translate-y-5": isMobile,
          }
        )}
      >
        {children?.(close)}
      </PopoverContent>
    </Popover>
  );
};
