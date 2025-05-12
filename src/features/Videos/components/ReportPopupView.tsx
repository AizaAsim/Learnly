import { ReactNode } from "react";

export const ReportPopupView = ({
  text,
  icon,
}: {
  text: string;
  icon?: ReactNode;
}) => {
  return (
    <div className="flex text-white w-full gap-2 py-3 pl-3 pr-4 items-center z-10">
      {icon}
      <p className="text-sm font-semibold">{text}</p>
    </div>
  );
};
