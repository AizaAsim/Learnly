import { FC } from "react";
import { cn } from "@/lib/utils";

interface Props {
  title: string;
  description?: string | JSX.Element;
  containerClassName?: string;
}

export const AuthTitle: FC<Props> = ({
  title,
  description,
  containerClassName,
}) => {
  return (
    <div
      className={cn(
        "flex flex-col gap-y-3 md:gap-y-2.5 text-center mb-8 md:mb-[34px]",
        containerClassName
      )}
    >
      <h2 className="font-bold text-mediumBlue text-[26px]/[30px] -tracking-[0.26px] px-3.5">
        {title}
      </h2>
      {description && (
        <p className="font-medium text-secondaryGrey text-base/[22px] -tracking-[0.16px]">
          {description}
        </p>
      )}
    </div>
  );
};
