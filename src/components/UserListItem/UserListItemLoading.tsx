import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

export const UserListItemSkeleton = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex items-center justify-between px-5 py-2"
    >
      <div className="flex items-center gap-2.5">
        <Skeleton className="w-[46px] h-[46px] md:w-[60px] md:h-[60px] rounded-2xl" />
        <div className="flex flex-col gap-1">
          <Skeleton className="h-5 w-32 md:h-6 rounded-md" />
          <Skeleton className="h-4 w-24 md:h-5 rounded-md" />
        </div>
      </div>
      <Skeleton className="h-[34px] w-[34px] md:w-10 md:h-10 rounded-[10px]" />
    </motion.div>
  );
};
