import { cva } from "class-variance-authority";

export const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-xxl md:rounded-2xl text-[15px] leading-5 md:leading-[22px] -tracking-[0.16px] font-semibold font-[Inter] ring-offset-background transition-colors focus-visible:outline-none disabled:pointer-events-none",
  {
    variants: {
      variant: {
        default:
          "bg-mediumBlue text-light-T100 hover:bg-primaryBlue active:bg-lightBlue disabled:text-light-T80",
        destructive:
          "bg-red text-light-T100 hover:bg-red-d1 active:bg-red-d2 disabled:bg-red-t50 disabled:text-light-T50",
        outline:
          "border border-lightBlue/50 bg-transparent text-mediumBlue hover:bg-lightBlue/10 hover:border-none active:bg-dark-T12 active:border-none disabled:border-dark-T12 disabled:text-dark-T50",
        secondary:
          "bg-dark-T8 text-primaryBlue hover:bg-dark-T16 active:bg-dark-T24 disabled:bg-dark-T8 disabled:opacity-50",
        ghost: "text-dark-T50 hover:text-dark-T60",
        link: "text-primary",
        blank: "",
        warning:
          "bg-yellow hover:bg-yellow-d1 active:bg-yellow-d1 disabled:bg-yellow-t50 disabled:text-dark-T50 font-semibold text-primaryBlue",
        attention:
          "bg-orange hover:bg-orange-d1 active:bg-orange-d1 disabled:bg-orange-t50",
      },
      size: {
        default:
          "h-12 md:h-[52px] px-6 py-3.5 md:py-[15px] text-[15px] leading-5 -tracking-[0.225px] rounded-xxl md:rounded-2xl md:text-base md:leading-[22px] md:-tracking-[0.16px] gap-2",
        sm: "h-9 md:h-10 px-4 py-[9px] md:py-2.5 text-sm leading-[18px] -tracking-[14px] rounded-xl md:rounded-xl md:text-[15px] md:leading-5 md:-tracking-[0.225px] ga-1.5",
        icon: "size-12 md:size-[52px]",
        iconSm: "size-9 md:size-10",
        none: "h-auto p-0 w-fit mx-auto",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);
