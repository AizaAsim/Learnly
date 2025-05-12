import { cva } from "class-variance-authority";

export const inputVariants = cva(
  "flex h-12 w-full rounded-xxl border-0 bg-secondaryGrey/10 px-4 py-3.5 font-semibold text-sm leading-[18px] -tracking-[0.14px] placeholder:text-primaryBlue/40 placeholder:font-medium placeholder:text-sm placeholder:leading-[18px] placeholder:-tracking-[0.14px] ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 disabled:cursor-not-allowed text-primaryBlue",
  {
    variants: {
      variant: {
        default: "focus-visible:ring-0",
        styled: "focus-visible:border-[1.6px] focus-visible:border-primaryBlue",
        error:
          "border-[1.6px] border-red bg-red-t4 focus-visible:border-[1.6px] focus-visible:border-red",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);
