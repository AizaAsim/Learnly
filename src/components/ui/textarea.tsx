import * as React from "react";

import { cn } from "@/lib/utils";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> { }

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    // To adjust the height of the textarea dynamically
    const handleInput = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      event.target.style.height = "auto";
      event.target.style.height = `${event.target.scrollHeight}px`;
    };

    return (
      <textarea
        className={cn(
          "flex h-auto min-h-[92px] w-full rounded-xxl bg-dark-T4 px-4 md:px-[18px] pt-3.5 pb-6 overflow-hidden",
          "font-semibold text-primaryBlue text-sm leading-4.5 -tracking-[0.14px]",
          "placeholder:font-[500] placeholder:text-lightBlue placeholder:text-sm placeholder:leading-4.5 placeholder:-tracking-[0.14px]",
          "focus-visible:outline-none focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50 resize-none",
          className
        )}
        ref={ref}
        onInput={handleInput}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";

export { Textarea };
