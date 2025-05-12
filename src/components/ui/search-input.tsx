import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { InputHTMLAttributes, useCallback, useRef, useState } from "react";

interface SearchInputProps extends InputHTMLAttributes<HTMLInputElement> {
  value: string;
  handleValueChange: (value: string) => void;
  handleClear?: () => void;
  containerClassName?: string;
  isLoading?: boolean;
}

const SearchInput = ({
  value,
  handleValueChange,
  handleClear,
  className,
  containerClassName,
  isLoading = false,
  ...props
}: SearchInputProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  const handleClearInput = useCallback(() => {
    if (handleClear) handleClear();
    else {
      handleValueChange("");
      inputRef.current?.focus();
    }
  }, [handleValueChange, handleClear]);

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  return (
    <div
      className={cn(
        "flex flex-1 items-center gap-1.5 bg-lightBlue/20 rounded-[22px] md:rounde-[28px] px-3 py-[11px] border-[1.6px] border-transparent max-h-11 min-h-11 md:max-h-[50px] md:min-h-[50px]",
        {
          "border-primaryBlue": isFocused,
        },
        containerClassName
      )}
      onClick={() => inputRef.current?.focus()}
    >
      <div className="flex-1 flex items-center gap-1">
        <img
          src={isFocused ? "/icon/search-dark.svg" : "/icon/search-light.svg"}
          alt="search"
          className="pointer-events-none select-none size-[22px]"
        />
        <Input
          placeholder="Search"
          className={cn(
            "border-none bg-transparent rounded-t-none rounded-b-none placeholder:text-mediumBlue placeholder:text-sm placeholder:font-semibold text-primaryBlue p-0 h-auto",
            className
          )}
          ref={inputRef}
          value={value}
          onChange={(e) => handleValueChange(e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...props}
        />
      </div>
      {isLoading && (
        <img
          src="/icon/loading.svg"
          className="size-[22px] animate-spin"
          alt="loading"
        />
      )}
      {value && !isLoading && (
        <img
          src="/icon/search-cross.svg"
          className="size-[22px] cursor-pointer z-20"
          onClick={handleClearInput}
          alt="clear search"
        />
      )}
    </div>
  );
};

SearchInput.displayName = "SearchInput";

export { SearchInput };
