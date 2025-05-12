import { useTranslation } from "react-i18next";

export const EarningsDisplay = ({
  selectedMonth,
  selectedMonthEarnings,
  currentMonth,
}: {
  selectedMonth: string;
  selectedMonthEarnings: number;
  currentMonth: string;
}) => {
  const { t } = useTranslation(undefined, { keyPrefix: "earning_insights" });
  return (
    <div className="flex flex-col gap-1 pt-11 pb-6 items-center md:pb-7">
      <h4 className="text-5xl font-bold leading-[54px] -tracking-[0.48px] md:text-6xl md:leading-[72px] text-primaryBlue">
        ${selectedMonthEarnings.toLocaleString("en-US")}
      </h4>
      <p className="text-primaryBlue text-sm/[18px] font-medium -tracking-[0.14px]">
        {selectedMonth === currentMonth
          ? t("current_month")
          : `In ${selectedMonth}`}
      </p>
    </div>
  );
};
