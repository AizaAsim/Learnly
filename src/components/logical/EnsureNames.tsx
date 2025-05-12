import { useEffect } from "react";
import { useAuth } from "@/features/Auth/hooks/useAuth";
import { Roles } from "@/features/Auth/types";
import { useNavigate } from "react-router-dom";

export function EnsureNames() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.role === Roles.USER) {
      if (!user?.displayName) {
        navigate("/auth/name");
      }
    } else {
      if (!user?.displayName) {
        navigate("/auth/display-name");
      } else if (!user?.username) {
        navigate("/auth/username");
      }
    }
  }, [user?.displayName, user?.username, user?.role, navigate]);

  // Logical components don't render anything
  return null;
}
