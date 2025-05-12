import { Button, ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";

export function HeaderButton({
  children,
  to,
  className,
  size,
}: {
  className?: string;
  size?: ButtonProps["size"];
  children: ReactNode;
  to: string | number;
}) {
  const navigate = useNavigate();

  return (
    <Button
      className={cn(
        "flex items-center justify-center w-7 h-7 p-0 hover:bg-transparent md:w-12 md:h-12 md:bg-grayscale-4 md:hover:bg-grayscale-4 md:hover:scale-105 duration-200 focus:outline-none",
        className
      )}
      variant={"ghost"}
      onClick={() => (to === -1 ? navigate(-1) : navigate(to as string))}
      size={size || "default"}
    >
      {children}
    </Button>
  );
}
