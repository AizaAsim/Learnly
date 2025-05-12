import { convertToShortScale } from "@/lib/utils";

export const VideoActionButton = ({
  icon,
  count,
  action,
}: {
  icon: string;
  count: number;
  action: () => void;
}) => {
  return (
    <div
      className="flex flex-col justify-center items-center gap-1.5 cursor-pointer"
      onClick={action}
    >
      <img src={icon} className="w-6 h-6" />
      <p className="font-medium text-[13px]">{convertToShortScale(count)}</p>
    </div>
  );
};
