import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useDeviceType } from "@/hooks/useDeviceType";
import { TooltipArrow } from "@radix-ui/react-tooltip";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  tooltipText: string;
};

export const SideMenuTooltip = ({ children, tooltipText }: Props) => {
  const { isMobile } = useDeviceType();

  if (isMobile) return children;

  return (
    <Tooltip delayDuration={300}>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent
        side="right"
        sideOffset={-2}
        className="bg-[#F5F5F5] text-grayscale-60 text-lg font-medium rounded-[10px] px-[14px] py-2 border-none"
      >
        <p>{tooltipText}</p>
        <TooltipArrow width={16} height={10} className="fill-grayscale-4" />
      </TooltipContent>
    </Tooltip>
  );
};
