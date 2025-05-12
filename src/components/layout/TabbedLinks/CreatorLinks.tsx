import { VariantProps } from "class-variance-authority";
import { AddReelButton } from "../AddReelButton";
import { BottomNavLink } from "./BottomNavLink";
import { TabbedLinkVariants } from "./variants";
import { cn } from "@/lib/utils";

interface CreatorLinksProps {
  variant?: VariantProps<typeof TabbedLinkVariants>["variant"];
}

export const CreatorLinks: React.FC<CreatorLinksProps> = ({ variant }) => {
  return (
    <>
      <BottomNavLink variant={variant} icon="/icon/home.svg" to="/home" />
      <AddReelButton
        iconClass={cn({
          "text-dark-T70": variant !== "blurred",
          "text-light-T60": variant === "blurred",
        })}
        iconOnly={true}
        iconWidth="28"
        iconHeight="28"
      />
      <BottomNavLink
        variant={variant}
        icon="/icon/notification.svg"
        to="/notifications"
        opts={{ activeStrokeWidth: "2.33" }}
        showBadge
      />

      <BottomNavLink
        icon="/icon/user.svg"
        to="/my-profile"
        opts={{ activeStrokeWidth: "2.33" }}
        variant={variant}
      />
    </>
  );
};
