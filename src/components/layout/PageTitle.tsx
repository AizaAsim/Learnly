import { FC } from "react";

interface Props {
  title: string;
  description?: string;
}

export const PageTitle: FC<Props> = ({ title, description }) => {
  return (
    <div className="flex flex-col space-y-2.5 text-center mb-[30px]">
      <h2 className="text-xl/[26px] font-bold text-primaryBlue">{title}</h2>
      {description && (
        <p className="text-[15px]/5 text-dark-T60">{description}</p>
      )}
    </div>
  );
};
