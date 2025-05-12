import { useState, useEffect, useCallback } from "react";
import { useSocials } from "../../hooks/useSocials";
import { SocialItem } from "@/components/SocialItem";

interface AddSocialsProps {
  onSave: (socials: { name: string }[]) => void;
}

export const AddSocials = ({ onSave }: AddSocialsProps) => {
  const { socials } = useSocials();
  const [connectedStatus, setConnectedStatus] = useState(
    Array(socials.length).fill(false)
  );

  useEffect(() => {
    const connectedSocials = socials
      .filter((_, index) => connectedStatus[index])
      .map(({ name }) => ({
        name,
      }));
    onSave(connectedSocials);
  }, [socials, connectedStatus, onSave]);

  const toggleConnection = useCallback(
    (index: number) => {
      const newStatus = [...connectedStatus];
      newStatus[index] = !newStatus[index];
      setConnectedStatus(newStatus);
    },
    [connectedStatus]
  );

  return (
    <div className="flex flex-col">
      <div className="flex flex-col gap-[14px]">
        {socials.map(({ name }, index) => (
          <SocialItem
            key={index}
            index={index}
            name={name}
            isConnected={connectedStatus[index]}
            toggleConnection={toggleConnection}
          />
        ))}
      </div>
    </div>
  );
};
