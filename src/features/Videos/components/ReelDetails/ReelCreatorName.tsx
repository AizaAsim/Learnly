import { ReelData } from "@/types";
import { motion } from "framer-motion";
import verified from "@/assets/verification.png";
import { cn } from "@/lib/utils";
import { useDeviceType } from "@/hooks/useDeviceType";

export const ReelCreatorName = ({
  className,
  creator,
}: {
  className?: string;
  creator?: ReelData["creator"];
}) => {
  const { isMobile } = useDeviceType();
  return (
    <motion.div
      key={creator?.username}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className={cn("flex", className)}
    >
      <h1
        className={cn("font-bold flex gap-1.5", {
          "text-white text-base leading-snug items-end -tracking-[0.16px]":
            isMobile,
          "text-black text-lg leading-normal items-center": !isMobile,
        })}
      >
        {creator?.displayName}
        {creator?.isVerified && (
          <img
            className={cn("aspect-square mt-1", {
              "w-5 h-5": isMobile,
              "w-6 h-6": !isMobile,
            })}
            src={verified}
          />
        )}
      </h1>
    </motion.div>
  );
};
