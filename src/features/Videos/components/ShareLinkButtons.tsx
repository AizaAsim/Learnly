import SvgIcon from "@/components/ui/svg-icon";

export const ShareLinkButtons = ({
  icon,
  strok,
  text,
  action,
}: {
  icon: string;
  strok: string;
  text: string;
  action: () => void;
}) => {
  return (
    <div
      className="w-[54px] h-[66px] gap-[6px] flex flex-col items-center justify-center cursor-pointer"
      onClick={action}
    >
      <div className="h-11 w-11 flex justify-center items-center rounded-full bg-black/[0.06]">
        <SvgIcon className="w-7 h-7" src={icon} strokeWidth={strok} />
      </div>
      <p className="font-semibold text-[11px] leading-4">{text}</p>
    </div>
  );
};
