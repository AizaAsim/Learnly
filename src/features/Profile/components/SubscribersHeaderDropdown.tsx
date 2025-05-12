import { UserActionDropdown } from "@/components/UserActionDropdown";
import { useNavigate } from "react-router-dom";

export const SubscribersHeaderDropdown = () => {
  const navigate = useNavigate();

  const actions = [
    {
      label: "Blocked Users",
      onClick: () => navigate("/blocked-users"),
      iconSrc: "/icon/ban-black.svg",
    },
  ];

  return (
    <UserActionDropdown
      actions={actions}
      menuTriggerClassName="bg-transparent"
    />
  );
};
