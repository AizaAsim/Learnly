import { ScrollArea } from "@/components/ui/scroll-area";
import { ComponentProps, ReactNode, forwardRef, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { Spinner } from "./spinner";
import { Error } from "./error";

interface InfiniteScrollListProps extends ComponentProps<"div"> {
  loading: boolean;
  fetchData: () => void;
  hasMore: boolean;
  error?: string | null;
  loader?: ReactNode;
}

export const InfiniteScrollList = forwardRef<
  HTMLDivElement,
  InfiniteScrollListProps
>(({ children, loading, fetchData, hasMore, loader, error, ...props }, ref) => {
  const [elToMonitorRef, inView] = useInView();

  useEffect(() => {
    // Fetch more only when user has scrolled to Spinner element, results are not loading and there are more results to fetch
    if (inView && !loading && hasMore && !error) {
      fetchData();
    }
  }, [inView, loading, hasMore, fetchData, error]);

  return (
    <div ref={ref} {...props}>
      <ScrollArea>{children}</ScrollArea>
      {hasMore && !error && (
        <div ref={elToMonitorRef}>
          {loading && loader ? loader : <Spinner fullScreen />}
        </div>
      )}
      {error && <Error className="block text-center p-6">{error}</Error>}
    </div>
  );
});
