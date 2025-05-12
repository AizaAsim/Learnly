import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface UserActionDropdownProps {
  actions: {
    label: string;
    onClick: (event: React.MouseEvent) => void;
    iconSrc: string;
    className?: string;
  }[];
  menuTriggerClassName?: string;
  menuTriggerIconSrc?: string;
  menuTriggerIconClassName?: string;
  menuContentClassName?: string;
  menuContentOffset?: number;
  modal?: boolean;
}

export const UserActionDropdown = ({
  actions,
  menuTriggerClassName,
  menuContentClassName,
  menuTriggerIconClassName,
  menuTriggerIconSrc,
  menuContentOffset,
  modal = false,
}: UserActionDropdownProps) => {
  return (
    <DropdownMenu modal={modal}>
      <DropdownMenuTrigger
        className={cn(
          "disabled:bg-grayscale-4 text-grayscale-100 disabled:text-grayscale-50 rounded-[10px] flex justify-center items-center p-0 focus-visible:outline-none",
          menuTriggerClassName
        )}
      >
        <img
          src={menuTriggerIconSrc || "/icon/more-header.svg"}
          className={cn("size-7", menuTriggerIconClassName)}
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className={cn(
          "rounded-2xl p-0 min-w-[140px] border-none shadow-blur-xl",
          menuContentClassName
        )}
        sideOffset={menuContentOffset}
      >
        {actions.map((action, index) => (
          <DropdownMenuItem
            key={index}
            className={cn(
              "font-semibold text-grayscale-80 -tracking-[0.14px] leading-[18px] md:text-base gap-5 md:gap-8 p-3 pl-4 md:p-4 cursor-pointer bg-light-T100 backdrop-blur-[20px] border-b border-b-dark-T4 last:border-b-0",
              action.className
            )}
            onClick={action.onClick}
          >
            {action.label}
            <DropdownMenuShortcut className="opacity-100">
              <img src={action.iconSrc} className="size-5" />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
