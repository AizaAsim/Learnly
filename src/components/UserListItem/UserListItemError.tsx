import { AlertCircle } from "lucide-react";

interface UserListItemErrorProps {
  message?: string;
}

export const UserListItemError = ({
  message = "Something went wrong.",
}: UserListItemErrorProps) => {
  return (
    <div className="flex items-center justify-between min-h-[68px] px-5 py-2 bg-red-50 border ">
      <div className="flex items-center gap-2.5 text-red-700">
        <AlertCircle className="h-5 w-5" />
        <span className="text-sm font-medium">{message}</span>
      </div>
    </div>
  );
};
