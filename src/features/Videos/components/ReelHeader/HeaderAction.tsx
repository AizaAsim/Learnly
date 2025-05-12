import SvgIcon from "@/components/ui/svg-icon";
import { cn } from "@/lib/utils";

export const MenuActionButton = ({
  text,
  icon,
  action,
  className,
}: {
  text: string;
  icon: string;
  action: () => void;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "min-w-[140px] px-4 py-3 flex justify-between text-white text-sm font-semibold leading-[18px] tracking-[-0.14px] w-full cursor-pointer border-b border-white/10 last-of-type:border-none hover:bg-black/20 hover:text-white/70 active:bg-black/20 active:text-white/70 first-of-type:rounded-t-xl last-of-type:rounded-b-xl",
        className
      )}
      onClick={action}
    >
      <p>{text}</p>
      <SvgIcon className="w-5 h-5" src={icon} strokeWidth={"2.04"} />
    </div>
  );
};
