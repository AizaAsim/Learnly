import React from "react";
import { motion, Variants } from "framer-motion";
import { cn } from "@/lib/utils";

interface StatsDisplayProps {
  data: Record<string, React.ReactNode>;
  className?: string;
}

// Variants for container and item animations
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.2,
      staggerChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

export const StatsDisplay = ({ data, className }: StatsDisplayProps) => {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className={cn(
        "bg-grayscale-4 rounded-[18px] p-1 mt-5 md:mt-8",
        className
      )}
    >
      {Object.entries(data).map(([key, value], index) => (
        <motion.div key={key} variants={itemVariants} className="px-4 md:px-5">
          <div className="grid grid-cols-2 py-3.5 text-sm -tracking-[0.14px] capitalize md:py-[18px] md:-tracking-[0.16px]">
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="text-primaryBlue text-sm md:text-base leading-[18px] md:leading-[22px] font-semibold whitespace-nowrap"
            >
              {key}
            </motion.p>
            <motion.p
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="text-dark-T80 text-sm md:text-base leading-[18px] md:leading-[22px] font-medium truncate text-right"
            >
              {value}
            </motion.p>
          </div>
          {
            // do not display the horizontal rule if it is the last item
            key !== Object.keys(data)[Object.keys(data).length - 1] && (
              <motion.hr
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-grayscale-4"
              />
            )
          }
        </motion.div>
      ))}
    </motion.div>
  );
};

export default StatsDisplay;
