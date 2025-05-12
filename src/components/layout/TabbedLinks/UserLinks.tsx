import { VariantProps } from "class-variance-authority";
import { BottomNavLink } from "./BottomNavLink";
import { TabbedLinkVariants } from "./variants";
import { useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

interface CreatorLinksProps {
  variant?: VariantProps<typeof TabbedLinkVariants>["variant"];
}

export const UserLinks: React.FC<CreatorLinksProps> = ({ variant }) => {
  const location = useLocation();
  const routeIsActive = (route: string) => location.pathname.includes(route);

  return (
    <>
      <BottomNavLink icon="/icon/home.svg" to={"/home"} variant={variant} />
      <BottomNavLink
        icon="/icon/search.svg"
        to="/search"
        variant={variant}
        opts={{
          strokeWidth: "1",
          activeStrokeWidth: "1",
          opacity: "0.6",
        }}
      />
      <BottomNavLink
        variant={variant}
        icon="/icon/notification.svg"
        to="/notifications"
        opts={{ activeStrokeWidth: "2.33" }}
        showBadge
      />
      <BottomNavLink
        icon="/icon/setting.svg"
        to="/settings"
        variant={variant}
        className={cn({
          "stroke-white": routeIsActive("/settings") && variant !== "blurred",
          "stroke-dark-T80":
            !routeIsActive("/settings") && variant !== "blurred",
          "stroke-light-T80":
            routeIsActive("/settings") && variant === "blurred",
          "stroke-light-T70":
            !routeIsActive("/settings") && variant === "blurred",
        })}
      />
    </>
  );
};
