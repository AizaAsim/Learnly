import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface PaymentMethodSkeletonProps {
  className?: string;
}

export const PaymentMethodCardSkeleton = ({
  className,
}: PaymentMethodSkeletonProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 20,
      }}
      className={cn("flex justify-between items-center px-5 py-2", className)}
    >
      <div className="flex gap-2.5">
        {/* Card Icon Skeleton */}
        <div className="w-[46px] h-[46px] md:w-14 md:h-14 rounded-full overflow-hidden">
          <Skeleton className="w-full h-full bg-grayscale-4" />
        </div>

        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.3 }}
          className="flex flex-col gap-1"
        >
          {/* Card Number and Active Badge Skeleton */}
          <div className="flex gap-1">
            <Skeleton className="h-5 w-32 md:w-40 bg-grayscale-4" />
            <Skeleton className="h-5 w-14 bg-grayscale-4 rounded" />
          </div>

          {/* Expiration Date Skeleton */}
          <Skeleton className="h-[18px] w-28 bg-grayscale-4" />
        </motion.div>
      </div>

      {/* Action Button Skeleton */}
      <Skeleton className="w-9 h-9 rounded-xl bg-grayscale-8" />
    </motion.div>
  );
};
