import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronUp } from "lucide-react";

export const ReelListControls = ({
  className,
  onNext,
  onPrevious,
  hasNext,
  hasPrevious,
}: {
  className?: string;
  onNext: () => void;
  onPrevious: () => void;
  hasNext: boolean;
  hasPrevious: boolean;
}) => {
  return (
    (hasNext || hasPrevious) && (
      <div
        className={cn(
          "-translate-y-1/2 flex flex-col px-4 lg:p-6 gap-5 z-10 text-white/70",
          className
        )}
      >
        <Button
          onClick={onPrevious}
          variant="blank"
          className="rounded-full flex justify-center items-center bg-white/20 backdrop-blur-lg w-11 h-11"
          disabled={!hasPrevious}
        >
          <span>
            <ChevronUp size={28} strokeWidth={"3"} />
          </span>
        </Button>
        <Button
          onClick={onNext}
          variant="blank"
          className="rounded-full flex justify-center items-center bg-white/20 backdrop-blur-lg w-11 h-11"
          disabled={!hasNext}
        >
          <span>
            <ChevronDown className="w-7 h-7" strokeWidth={"3"} />
          </span>
        </Button>
      </div>
    )
  );
};
