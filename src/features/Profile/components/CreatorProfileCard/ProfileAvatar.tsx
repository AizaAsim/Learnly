import { Avatar, AvatarImage } from "@/components/ui/avatar";
import dummyAvatar from "@/assets/avatar.png";
import { cn } from "@/lib/utils";
import { ChangeEvent, useRef, useState } from "react";
import { useAvatar } from "@/features/Profile/hooks/useAvatar";
import { useAuth } from "@/features/Auth/hooks/useAuth";
import { logError } from "@/services/logging";

interface ProfileAvatarProps {
  avatar_url: string | null;
  isOwner: boolean;
  className?: string;
}

export const ProfileAvatar = ({ avatar_url, isOwner, className }: ProfileAvatarProps) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { user } = useAuth();
  const { updateAvatarUrl, resizeImage, getStoragePath } = useAvatar();
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  const handleFileInputChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file && user) {
      try {
        const resizedImage = (await resizeImage(file, 100, 100)) as Blob;
        const storagePath = getStoragePath(user.role, user.uid);
        await updateAvatarUrl(user, storagePath, resizedImage);
        setSelectedFile(URL.createObjectURL(file));
      } catch (error) {
        logError(error);
      }
    }
  };

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className={cn("relative  h-[112px] md:h-[144px] w-[112px] md:w-[144px] mx-auto shadow-blur-sm md:shadow-none rounded-[0px]", className)}>
      <Avatar className="w-full h-full">
        <AvatarImage
          src={selectedFile || avatar_url || dummyAvatar}
          className=" border-4 md:border-none border-light-T100 object-cover rounded-[0px]"
          alt="Profile Picture"
        />
      </Avatar>
      {isOwner && !avatar_url && (
        <>
          <input
            type="file"
            ref={fileInputRef}
            accept=".png, .jpeg, .jpg, .webp"
            className="hidden"
            onChange={handleFileInputChange}
          />
          <button
            type="button"
            className={cn(
              "absolute bottom-0 right-0 w-[34px] h-[34px] md:w-[50px] md:h-[50px] border-[3px] md:border-[3.5px] border-light-T100 rounded-[20px] md:rounded-[30px] flex items-center justify-center",
              "bg-gradient-to-r from-dark-T8 to-dark-T8 bg-light-T100"
            )}
            onClick={handleButtonClick}
          >
            <img
              src="/icon/camera.svg"
              alt="camera"
              className="md:h-[25px] md:w-[25px]"
            />
          </button>
        </>
      )}
    </div>
  );
};
