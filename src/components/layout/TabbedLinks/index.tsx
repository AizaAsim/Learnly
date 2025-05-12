import { useAuth } from "@/features/Auth/hooks/useAuth";
import { Roles } from "../../../features/Auth/types";
import { CreatorLinks } from "./CreatorLinks";
import { UserLinks } from "./UserLinks";
import { VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { TabbedLinkVariants } from "./variants";

interface TabbedLinksProps {
  className?: string;
  variant?: VariantProps<typeof TabbedLinkVariants>["variant"];
}

export const TabbedLinks: React.FC<TabbedLinksProps> = ({
  className,
  variant = "solid",
}) => {
  const { currentRole } = useAuth();
  return (
    <div className={cn(TabbedLinkVariants({ variant }), className)}>
      {currentRole === Roles.CREATOR ? (
        <CreatorLinks variant={variant} />
      ) : (
        <UserLinks variant={variant} />
      )}
    </div>
  );
};
