import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { ReactNode } from "react";
import { motion, Variants } from "framer-motion";
import { UserListItemSkeleton } from "./UserListItemLoading";
import { UserListItemError } from "./UserListItemError";

interface UserListItemProps {
  leftTopContent?: ReactNode;
  leftBottomContent?: ReactNode;
  rightContent?: ReactNode;
  avatarUrl: string | null;
  onClick?: () => void;
  loading?: boolean;
  error?: string;
}

const itemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
    },
  },
};

export const UserListItem = ({
  leftTopContent,
  leftBottomContent,
  rightContent,
  avatarUrl,
  onClick,
  loading,
  error,
}: UserListItemProps) => {
  if (loading) return <UserListItemSkeleton />;
  if (error) return <UserListItemError message={error} />;

  return (
    <motion.div
      variants={itemVariants}
      initial="hidden"
      animate="visible"
      className="flex items-center justify-between px-5 py-2 cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-center gap-2.5">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Avatar className="w-[52px] h-[52px] md:w-[60px] md:h-[60px]">
            <AvatarImage
              src={avatarUrl || "/img/list-item-default-avatar.png"}
              className="border-[2.5px] border-white rounded-2xl"
              alt={`User avatar`}
            />
          </Avatar>
        </motion.div>
        <div className="flex flex-col gap-1">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1, duration: 0.3 }}
            className="text-primaryBlue text-[15px] leading-5 font-semibold -tracking-[0.225px] capitalize md:text-lg md:leading-6 flex items-center gap-1"
          >
            {leftTopContent}
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.3 }}
            className="text-dark-T70 text-sm leading-[18px] font-medium -tracking-[0.14px] capitalize md:text-grayscale-80 md:text-base md:leading-[22px] md:-tracking-[0.16px]"
          >
            {leftBottomContent}
          </motion.div>
        </div>
      </div>
      {rightContent && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.3 }}
        >
          {rightContent}
        </motion.div>
      )}
    </motion.div>
  );
};
