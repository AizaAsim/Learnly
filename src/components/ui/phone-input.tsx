import * as React from "react";
import * as RPNInput from "react-phone-number-input";
import flags from "react-phone-number-input/flags";
import { Button } from "@/components/ui/button";
import ChevronIcon from "/icon/chevron-dropdown.svg";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Input, InputProps } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { CheckIcon } from "lucide-react";

type PhoneInputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "onChange" | "value"
> &
  Omit<RPNInput.Props<typeof RPNInput.default>, "onChange"> & {
    onChange?: (value: RPNInput.Value) => void;
    error?: boolean;
  };

const PhoneInput: React.ForwardRefExoticComponent<PhoneInputProps> =
  React.forwardRef<React.ElementRef<typeof RPNInput.default>, PhoneInputProps>(
    (
      { className, value, onChange, defaultCountry = "US", error, ...props },
      ref
    ) => {
      const [isFocused, setIsFocused] = React.useState(false);
      return (
        <RPNInput.default
          ref={ref}
          className={cn(
            "flex rounded-xxl z-[1000000000]",
            isFocused && "ring-[1.6px] ring-primaryBlue",
            error && "ring-[1.6px] ring-red",
            className
          )}
          flagComponent={FlagComponent}
          countrySelectComponent={(countrySelectProps) => (
            <CountrySelect
              {...countrySelectProps}
              isFocused={isFocused}
              error={error}
            />
          )}
          inputComponent={InputComponent}
          initialValueFormat="national"
          defaultCountry={defaultCountry}
          value={value}
          onChange={(value) => onChange?.(value || ("" as RPNInput.Value))}
          {...props}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          error={error}
        />
      );
    }
  );
PhoneInput.displayName = "PhoneInput";

const InputComponent = React.forwardRef<
  HTMLInputElement,
  InputProps & { error?: boolean }
>(({ error, ...props }, ref) => (
  <Input
    variant={!error ? "styled" : "error"}
    placeholder="(000) 000-0000"
    {...props}
    className={cn(
      "py-[15px] px-3 rounded-l-none font-medium border-0 focus-visible:border-0"
    )}
    ref={ref}
  />
));
InputComponent.displayName = "InputComponent";

type CountrySelectOption = { label: string; value: RPNInput.Country };

type CountrySelectProps = {
  disabled?: boolean;
  value: RPNInput.Country;
  onChange: (value: RPNInput.Country) => void;
  options: CountrySelectOption[];
  isFocused: boolean;
  error: boolean;
};

const CountrySelect = ({
  disabled,
  value,
  onChange,
  options,
  isFocused,
  error,
}: CountrySelectProps) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleOpenChange = React.useCallback(
    (open: boolean) => {
      setIsOpen(open);
    },
    [setIsOpen]
  );

  const handleSelect = React.useCallback(
    (country: RPNInput.Country) => {
      onChange(country);
    },
    [onChange]
  );

  return (
    <Popover onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <div className="focus-within:bg-light-T100 rounded-l-xxl">
          <Button
            type="button"
            variant={"outline"}
            className={cn(
              "flex justify-start items-center gap-x-1.5 !rounded-l-xxl rounded-r-none md:!rounded-l-xxl md:rounded-r-none p-3 pr-2.5 bg-dark-T4 h-12 border-l-0 border-t-0 border-b-0 border-r border-r-dark-T4",
              isFocused && "bg-light-T100",
              error && "bg-red-t4 !rounded-l-xxl md:!rounded-l-xxl"
            )}
            disabled={disabled}
          >
            <FlagComponent country={value} countryName={value} isSelected />
            <p className="text-sm font-medium leading-4.5 -tracking-[0.14px] text-primaryBlue">
              {value} {`+${RPNInput.getCountryCallingCode(value)}`}
            </p>
            <div className="w-5 h-5">
              {isOpen ? (
                <img src={ChevronIcon} className="transform rotate-180" />
              ) : (
                <img src={ChevronIcon} />
              )}
            </div>
          </Button>
        </div>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-[117px] rounded-2xl bg-primaryBlue my-2">
        <Command>
          <CommandList>
            <ScrollArea className="w-[117px] bg-light-T100">
              <CommandGroup className="p-0">
                {options
                  .filter((x) => x.value)
                  .map((option) => (
                    <CommandItem
                      className="gap-2 p-3 hover:bg-hover-gradient"
                      key={option.value}
                      onSelect={() => handleSelect(option.value)}
                    >
                      <span className="w-5 h-5 overflow-hidden rounded-sm">
                        <FlagComponent
                          country={option.value}
                          countryName={option.label}
                        />
                      </span>
                      {option.value && (
                        <span className="text-sm text-primaryBlue font-semibold leading-[18px] -tracking-[0.14px]">
                          {`+${RPNInput.getCountryCallingCode(option.value)}`}
                        </span>
                      )}
                      <CheckIcon
                        className={cn(
                          "ml-auto h-4 w-4",
                          option.value === value ? "opacity-100" : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  ))}
              </CommandGroup>
            </ScrollArea>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

const FlagComponent = ({
  country,
  countryName,
  isSelected = false,
}: RPNInput.FlagProps & { isSelected?: boolean }) => {
  const Flag = flags[country];

  return (
    <div
      className={cn(
        "flex items-center justify-center overflow-hidden rounded-md relative",
        isSelected ? "w-6 h-6 max-w-6 max-h-6" : "w-5 h-5 max-w-5 max-h-5"
      )}
    >
      <span
        className={cn(
          "absolute inset-0 flex items-center",
          isSelected ? "scale-200" : "scale-150"
        )}
      >
        {Flag && <Flag title={countryName} />}
      </span>
    </div>
  );
};

FlagComponent.displayName = "FlagComponent";

export { PhoneInput };
