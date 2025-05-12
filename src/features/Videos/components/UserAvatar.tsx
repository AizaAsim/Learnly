import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import verificationImage from "../../../assets/verification.png";

export const UserAvatar = ({
  userName,
  photoURL,
  isVerified,
}: {
  userName: string | null | undefined;
  photoURL: string;
  isVerified: boolean | undefined;
}) => {
  return (
    <div className="flex flex-col gap-1.5">
      <Avatar className="w-10 h-10">
        <AvatarImage
          className="rounded-[30%] border-[3px] border-white"
          src={photoURL}
        />
      </Avatar>
      <div className="flex flex-row items-center justify-center gap-1">
        <Label className="text-white font-bold text-base leading-5">
          @{userName?.replace(" ", ".").toLocaleLowerCase()}
        </Label>
        {isVerified && <img className="w-5 h-5" src={verificationImage} />}
      </div>
    </div>
  );
};
