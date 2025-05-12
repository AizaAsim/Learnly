import { cva } from "class-variance-authority";

export const TabbedLinkVariants = cva(
  "flex justify-center items-center px-6 py-2 gap-[52px] h-[52px] z-50 border-t border-dark-T8 border",
  {
    variants: {
      variant: {
        solid: "bg-white border-t-transparent",
        blurred:
          "backdrop-blur-lg text-white bg-opacity-[8%] border-t-[rgba(255, 255, 255, .16)]",
      },
    },
    defaultVariants: {
      variant: "solid",
    },
  }
);
