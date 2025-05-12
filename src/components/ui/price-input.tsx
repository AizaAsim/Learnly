import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { useTranslation } from "react-i18next";

interface PriceInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  containerClassName?: string;
  price: number;
}

export const PriceInput = forwardRef<HTMLInputElement, PriceInputProps>(
  (
    { className, containerClassName, price, value, onBlur, onFocus, ...props },
    ref
  ) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const { t } = useTranslation(undefined, {
      keyPrefix: "activateSubscription.setPrice",
    });

    const [isFocused, setIsFocused] = useState(false);

    useImperativeHandle(ref, () => inputRef.current as HTMLInputElement, []);

    const handleFocus = () => setIsFocused(true);
    const handleBlur = () => setIsFocused(false);

    const handleClick = () => {
      // Focus the input element when the div is clicked
      if (inputRef.current) {
        inputRef.current.focus();
      }
    };

    return (
      <div
        className={cn(
          "flex items-center gap-x-1.5 bg-dark-T4 rounded-xxl h-12 w-full py-[15px] md:py-3.5 px-4 font-medium text-dark-T50 text-sm/[18px] md:text-[15px]/5 -tracking-[0.14px] md:-tracking-[0.225px] border-[1.6px] border-transparent",
          {
            "border-grayscale-100": isFocused,
          },
          containerClassName
        )}
        onClick={handleClick}
      >
        <span
          className={cn({
            "text-primaryBlue font-semibold": isFocused || price,
          })}
        >
          {t("input_label")}
        </span>
        <Input
          type="number"
          step="any"
          className={cn(
            "bg-transparent h-auto p-0 text-primaryBlue rounded-t-none rounded-b-none",
            className
          )}
          ref={inputRef}
          value={value}
          {...props}
          onBlur={(e) => {
            handleBlur();
            onBlur?.(e);
          }}
          onFocus={(e) => {
            handleFocus();
            onFocus?.(e);
          }}
        />
        <span className="inline-block min-w-[70px] md:min-w-[73px] text-dark-T40">
          {t("input_sublabel")}
        </span>
      </div>
    );
  }
);
