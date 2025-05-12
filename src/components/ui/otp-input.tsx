import { cn } from "@/lib/utils";
import { useState, useRef, useEffect, Fragment } from "react";
import separator from "@/assets/separator.svg";
import separatorRed from "@/assets/separator-red.svg";

type OtpInputProps = {
  onComplete: (pin: string) => void;
  length?: number;
  hasError?: boolean;
  isDisabled?: boolean;
};

export const OtpInput = ({
  onComplete,
  length = 6,
  hasError = false,
  isDisabled = false,
}: OtpInputProps) => {
  const inputRef = useRef<HTMLInputElement[]>(Array(length).fill(null));
  const [otp, setOtp] = useState<string[]>(Array(length).fill(""));

  useEffect(() => {
    // Auto-focus the first input on mount
    inputRef.current[0]?.focus();
  }, []);

  useEffect(() => {
    // When isDisabled changes, focus the last non-empty input
    if (!isDisabled) {
      let lastFilledIndex = -1;
      for (let i = otp.length - 1; i >= 0; i--) {
        if (otp[i] !== "") {
          lastFilledIndex = i;
          break;
        }
      }
      if (lastFilledIndex !== -1) {
        inputRef.current[lastFilledIndex]?.focus();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDisabled]);

  const handleTextChange = (input: string, index: number) => {
    if (!/^\d*$/.test(input)) return; // Only allow numeric inputs

    const newOtp = [...otp];
    newOtp[index] = input;
    setOtp(newOtp);

    if (input.length === 1) {
      if (index < length - 1) {
        inputRef.current[index + 1]?.focus(); // Move focus to the next field if input is filled
      }
    } else {
      if (index > 0) {
        inputRef.current[index - 1]?.focus(); // Move focus back if the field becomes empty
      }
    }

    if (newOtp.every((digit) => digit !== "")) {
      onComplete(newOtp.join(""));
    } else {
      // Re-focus the first empty field if not all fields are completed
      const firstEmptyIndex = newOtp.indexOf("");
      if (firstEmptyIndex !== -1 && input.length === 0) {
        inputRef.current[firstEmptyIndex]?.focus();
      }
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace" && otp[index] === "") {
      if (index > 0) {
        inputRef.current[index - 1]?.focus();
        const newPin = [...otp];
        newPin[index - 1] = "";
        setOtp(newPin);
      }
    }
  };

  const handleBlur = () => {
    setTimeout(() => {
      // Check if any input still has focus (if user hasn't clicked outside)
      const hasFocus = inputRef.current.some(
        (input) => input === document.activeElement
      );

      if (!hasFocus) {
        const firstEmptyIndex = otp.findIndex((digit) => digit === "");
        if (firstEmptyIndex !== -1) {
          inputRef.current[firstEmptyIndex]?.focus();
        }
      }
    }, 100); // Delay to avoid immediate refocusing issues
  };

  // Add a paste event handler to distribute pasted content across fields
  const handlePaste = (
    e: React.ClipboardEvent<HTMLInputElement>,
    index: number
  ) => {
    e.stopPropagation();
    e.preventDefault();

    const pastedData = e.clipboardData.getData("text").trim();

    if (!/^\d+$/.test(pastedData)) return; // Allow only numeric pastes

    const newOtp = [...otp];
    const pasteChars = pastedData.slice(0, length).split(""); // Ensure only length-sized input

    for (let i = 0; i < pasteChars.length; i++) {
      const currentIndex = index + i;
      if (currentIndex < length) {
        newOtp[currentIndex] = pasteChars[i]; // Fill subsequent fields
      }
    }

    setOtp(newOtp);

    // Move focus to the first empty field or complete the OTP
    const nextEmptyIndex = newOtp.indexOf("");
    if (nextEmptyIndex !== -1) {
      inputRef.current[nextEmptyIndex]?.focus();
    } else if (newOtp.every((digit) => digit !== "")) {
      onComplete(newOtp.join(""));
    }
  };

  return (
    <div className="flex w-full justify-center items-center">
      {Array.from({ length }, (_, index) => (
        <Fragment key={index}>
          <input
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={otp[index]}
            onChange={(e) => handleTextChange(e.target.value, index)}
            onPaste={(e) => handlePaste(e, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            ref={(ref) => (inputRef.current[index] = ref as HTMLInputElement)}
            onBlur={handleBlur}
            disabled={isDisabled}
            className={cn(
              "w-[44px] h-[50px] bg-dark-T4 border-0 border-dark-T4",
              (index === 0 || index === 3) && "rounded-l-xxl",
              (index === 2 || index === 5) && "rounded-r-xxl",
              "text-primaryBlue text-lg font-bold leading-6 text-center",
              "focus:outline-none focus:ring-0",
              !hasError &&
              "focus:border-[1.6px] focus:border-primaryBlue focus:bg-dark-T2",
              hasError &&
              "border-[1.6px] border-red bg-red-t4 focus:border-red",
              (index === 1 || index === 4) && [
                "border-l border-r",
                hasError && "border-l-0 border-r-0",
              ]
            )}
          />
          {index === Math.floor(length / 2) - 1 && (
            <img
              className="w-6 h-6"
              src={hasError ? separatorRed : separator}
            />
          )}
        </Fragment>
      ))}
    </div>
  );
};
