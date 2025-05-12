import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { ModalAvatarConfig } from "./type";

interface ModalAvatarProps {
  avatar?: ModalAvatarConfig;
}

export const ModalAvatar = ({ avatar }: ModalAvatarProps) => {
  if (!avatar) return null;

  return (
    <div className="flex flex-col gap-3.5 items-center absolute -top-[130px] md:-top-[115px] w-full">
      <div className="relative">
        <Avatar className="w-[112px] h-[112px] rounded-[30%] border-4 border-solid border-white">
          <AvatarImage src={avatar.imageUrl || "/img/avatar.png"} />
        </Avatar>
        {avatar.icon && (
          <img src={avatar.icon} className="absolute bottom-0 right-0" />
        )}
      </div>
    </div>
  );
};
