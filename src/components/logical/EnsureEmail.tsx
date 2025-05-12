import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function EnsureEmail() {
  const navigate = useNavigate();

  const isRecovered = JSON.parse(
    localStorage.getItem("isRecovered") || "false"
  );

  useEffect(() => {
    if (isRecovered) navigate("/auth/new-email");
  }, [isRecovered, navigate]);

  // Logical components don't render anything
  return null;
}
