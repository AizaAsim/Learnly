import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { ReelData } from "@/types";
import { motion } from "framer-motion";
import dummyAvatar from "@/assets/avatar.png";
import { cn } from "@/lib/utils";
import { useDeviceType } from "@/hooks/useDeviceType";

export const ReelAvatar = ({
  reel,
  className,
}: {
  reel?: ReelData;
  className?: string;
}) => {
  const { isMobile } = useDeviceType();
  return (
    <motion.div
      className={className}
      key={reel?.creator?.avatar_url}
      initial={{ opacity: 0, y: 0 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
    >
      <Avatar
        className={cn({
          "w-[52px] h-[52px]": !isMobile,
          "w-10 h-10": isMobile,
        })}
      >
        <AvatarImage
          src={reel?.creator?.avatar_url || dummyAvatar}
          className="rounded-[12px] object-cover border-2 border-white box-border"
          alt="Profile Picture"
        />
      </Avatar>
    </motion.div>
  );
};
