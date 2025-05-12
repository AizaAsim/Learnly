import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AreaChart } from "@/components/ui/area-chart";
import { AppDispatch } from "@/store";
import {
  fetchEarningsStats,
  setSelectedMonth,
} from "@/store/reducers/creatorStatsReducer";
import {
  selectMonthlyEarnings,
  selectEarningsStatsLoading,
  selectEarningsStatsError,
  selectSelectedMonth,
} from "@/store/selectors/creatorStatsSelectors";
import { Error } from "@/components/ui/error";
import { Spinner } from "@/components/ui/spinner";
import { convertToShortScale, formatFullMonth } from "@/lib/utils";
import { MonthAxisLabel } from "./MonthAxisLabel";
import { format } from "date-fns";
import { useDeviceType } from "@/hooks/useDeviceType";
import { EarningsDisplay } from "./EarningsDisplay";

export const Earnings = () => {
  const dispatch = useDispatch<AppDispatch>();

  const selectedMonth = useSelector(selectSelectedMonth);
  const monthlyData = useSelector(selectMonthlyEarnings);
  const loading = useSelector(selectEarningsStatsLoading);
  const error = useSelector(selectEarningsStatsError);

  const { isMobile } = useDeviceType();

  useEffect(() => {
    dispatch(fetchEarningsStats());
  }, [dispatch]);

  const selectedMonthEarnings = useMemo(() => {
    const selectedData = monthlyData?.find(
      (item) => formatFullMonth(item.month) === selectedMonth
    );
    return selectedData?.earnings || 0;
  }, [monthlyData, selectedMonth]);

  const displayLoader = useMemo(() => loading && !error, [error, loading]);
  const displayError = useMemo(() => error, [error]);
  const displayChart = useMemo(
    () => !error && !loading && monthlyData.length > 0,
    [error, loading, monthlyData.length]
  );

  const currentMonth = format(new Date(), "MMMM");

  const handleMonthSelect = (month: string) => {
    dispatch(setSelectedMonth(month));
  };

  // Filter data to show only the last 6 months if isMobile is true
  const filteredData = isMobile
    ? monthlyData.slice(-6) // Get the last 6 data points
    : monthlyData;

  // Change the color of the vertical grid line of selected month
  useEffect(() => {
    const selectedMonthIndex = filteredData.findIndex(
      (item) => formatFullMonth(item.month) === selectedMonth
    );

    const verticalGridLines = document.querySelectorAll(
      ".recharts-cartesian-grid-vertical line"
    );

    verticalGridLines.forEach((line, index) => {
      if (index === selectedMonthIndex)
        line.setAttribute("stroke", "#1E3A8A");
      else line.setAttribute("stroke", "#4299e1");
    });
  }, [selectedMonth, filteredData]);

  return (
    <div className="max-w-3xl mx-auto">
      {displayChart && (
        <div className="mt-1">
          <EarningsDisplay
            selectedMonth={selectedMonth}
            selectedMonthEarnings={selectedMonthEarnings}
            currentMonth={currentMonth}
          />
          <AreaChart
            className="mx-5 my-6"
            data={filteredData}
            height={isMobile ? 314 : 354}
            xDataKey="month"
            yDataKey="earnings"
            yAxisFormatter={(value) => convertToShortScale(value)}
            xAxisTick={(props) => (
              <MonthAxisLabel
                {...props}
                selectedMonth={selectedMonth}
                onMonthSelect={handleMonthSelect}
              />
            )}
          />
        </div>
      )}
      {displayLoader && <Spinner className="pt-16" />}
      {displayError && <Error className="mx-auto">{error}</Error>}
    </div>
  );
};
