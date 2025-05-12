import { useVideoUploadModals } from "@/features/Videos/hooks/useVideoUploadModals";
import { useModal } from "@/hooks/useModal";

export const AddReelProfileButton = () => {
  const { isOpen, openModal } = useModal();
  const { openFilePicker } = useVideoUploadModals();

  const addReel = () => {
    if (isOpen) return;
    openFilePicker();
    openModal();
  };
  return (
    <div className="w-full min-h-[216px] h-full flex items-center justify-center md:p-5 md:pt-0">
      <div
        className="w-full md:max-w-[874px] h-full bg-lightBlue/5 flex-1 flex items-center justify-center cursor-pointer p-8 md:rounded-[20px]"
        onClick={addReel}
      >
        <img src="/icon/add-large.svg" alt="add-icon" />
      </div>
    </div>
  );
};
