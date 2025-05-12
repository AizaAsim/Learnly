import SvgIcon from "@/components/ui/svg-icon";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useDeviceType } from "@/hooks/useDeviceType";

export const ReelLink = ({
  url,
  onClick,
  className,
}: {
  url: string;
  onClick: () => void;
  className?: string;
}) => {
  const { isMobile } = useDeviceType();
  return (
    <div className={cn("max-w-max flex items-center justify-start", className)}>
      <motion.div
        className={cn(
          "w-full flex items-center justify-start gap-1 cursor-pointer",
          {
            "h-[30px] pl-2.5 pr-3 py-[7px] bg-white/20 rounded-[20px] backdrop-blur-[25px]":
              isMobile,
            "h-8 px-3 py-1.5 bg-black/5 rounded-[20px]": !isMobile,
          }
        )}
        onClick={onClick}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        key={url}
      >
        <SvgIcon
          className={cn("flex-shrink-0", {
            "text-white w-4 h-4": isMobile,
            "text-black/60 w-5 h-5": !isMobile,
          })}
          src="/icon/link-white.svg"
          strokeWidth={isMobile ? "2" : "2.5"}
        />
        <p
          className={cn("max-w-full font-semibold truncate", {
            "text-light-T90 text-[13px] leading-4 -tracking-[0.195px]":
              isMobile,
            "text-dark-T60 text-[15px] leading-tight": !isMobile,
          })}
        >
          {url}
        </p>
      </motion.div>
    </div>
  );
};
