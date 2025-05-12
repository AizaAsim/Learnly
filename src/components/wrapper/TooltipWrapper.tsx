import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

export const TooltipWrapper = ({
  children,
  text,
  shouldWrap = true,
}: {
  children: React.ReactNode;
  text: string;
  shouldWrap?: boolean;
}) => {
  return shouldWrap ? (
    <Tooltip>
      <TooltipTrigger>{children}</TooltipTrigger>
      <TooltipContent>{text}</TooltipContent>
    </Tooltip>
  ) : (
    <>{children}</>
  );
};
