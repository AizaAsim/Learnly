import { useAuth } from "@/features/Auth/hooks/useAuth";
import { Roles } from "../../../features/Auth/types";
import { CommonLinks } from "./CommonLinks";
import { CreatorLinks } from "./CreatorLinks";
import { UserLinks } from "./UserLinks";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useBanner } from "@/hooks/useBanner";
import { useState } from "react";
import { MenuIcon } from "lucide-react";
import { useLoaderData } from "react-router-dom";
import { cn } from "@/lib/utils";

export const MobileMenu = () => {
  const { currentRole, isLoggedIn } = useAuth();
  const { hasBanner, bannerHeight } = useBanner();
  const [isOpen, setIsOpen] = useState(false);

  const loaderData = useLoaderData() as { id: string };
  const isReelPage = loaderData?.id; // all pages with a reel have an id

  return (
    <DropdownMenu modal={false} open={isOpen}>
      <DropdownMenuTrigger onClick={() => setIsOpen((prev) => !prev)}>
        <MenuIcon
          className={isReelPage ? "text-white/70" : "text-primaryBlue"}
          size={28}
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        sideOffset={12}
        align="start"
        className={cn(
          "p-2 rounded-[18px] w-[212px] flex flex-col items-stretch gap-y-1",
          {
            "backdrop-blur-lg bg-white/20 shadow-lg border-none": isReelPage,
          }
        )}
        // Conditionally translateY the menu to avoid it being pushed off screen by the banner
        style={{
          ...(hasBanner && { transform: `translateY(-${bannerHeight}px)` }),
        }}
        onPointerDownOutside={() => setIsOpen(false)}
      >
        <DropdownMenuLabel className="px-2.5 pt-2 pb-1">
          <img
            src="/img/mobile-menu-logo.svg"
            className={cn({
              "filter brightness-0 invert": isReelPage,
            })}
          />
        </DropdownMenuLabel>
        <DropdownMenuSeparator
          className={cn("my-1 -mx-2", {
            "bg-grayscale-8": !isReelPage,
            "bg-light-T70": isReelPage,
          })}
        />
        {isLoggedIn &&
          (currentRole === Roles.USER ? (
            <UserLinks setIsMenuOpen={setIsOpen} />
          ) : (
            <CreatorLinks setIsMenuOpen={setIsOpen} />
          ))}
        <DropdownMenuSeparator
          className={cn("my-1 -mx-2", {
            "bg-grayscale-8": !isReelPage,
            "bg-light-T70": isReelPage,
          })}
        />
        {isLoggedIn && <CommonLinks setIsMenuOpen={setIsOpen} />}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
