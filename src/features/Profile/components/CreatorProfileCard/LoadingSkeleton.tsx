import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Fragment } from "react/jsx-runtime";

interface LoadingSkeletonProps {
  className?: string;
}

export const LoadingSkeleton = ({ className }: LoadingSkeletonProps) => (
  <div className={cn("text-center", className)}>
    {/* Avatar */}
    <div className="relative rounded-[30%] h-[112px] md:h-[156px] w-[112px] md:w-[156px] mx-auto">
      <Skeleton className="h-full w-full rounded-[30%]" />
    </div>

    <div className="flex flex-col md:gap-4 gap-3.5 mt-2 md:mt-6 mb-5 md:mb-6">
      <div className="flex flex-col gap-3.5 md:gap-4 justify-center items-center">
        <div className="flex flex-col md:gap-2 gap-1.5">
          {/* Name and verification badge */}
          <div className="flex gap-1.5 justify-center items-center">
            <Skeleton className="h-6 md:h-[34px] w-32 md:w-56" />
            <Skeleton className="w-5 h-5 rounded-full" />
          </div>
          {/* Profile Link */}
          <Skeleton className="h-5 w-[290px] md:w-[442px] mx-auto" />
        </div>
        {/* Bio */}
        <Skeleton className="h-7 w-[290px] md:w-[442px] mx-auto" />
      </div>

      {/* Stats */}
      <div className="flex gap-[18px] md:gap-5 justify-center items-center">
        {[...Array(3)].map((_, index) => (
          <Fragment key={index}>
            {index !== 0 && (
              <Separator
                className="h-4 bg-grayscale-8 rounded-[1px]"
                orientation="vertical"
              />
            )}
            <div className="flex flex-col md:flex-row items-center gap-x-1.5 gap-y-0.5">
              <div className="flex gap-1 items-center">
                <Skeleton className="w-[18px] md:w-[28px] h-[18px] md:h-[28px]" />
                <Skeleton className="h-[22px] md:h-6 w-8 md:w-10" />
              </div>
              <Skeleton className="h-4 md:h-[22px] w-12 md:w-14" />
            </div>
          </Fragment>
        ))}
      </div>

      {/* Add socials button */}
      <Skeleton className="h-7 w-[118px] rounded-full mx-auto" />
    </div>

    {/* CTA button */}
    <Skeleton className="h-[50px] w-[272px] md:w-[442px] max-w-full mx-auto rounded-xl" />
  </div>
);
