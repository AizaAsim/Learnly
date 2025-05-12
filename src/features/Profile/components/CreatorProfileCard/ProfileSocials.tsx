import { useSocials } from "../../hooks/useSocials";

interface SocialLink {
  name: string;
}

const SocialLinkIcon = ({ name }: SocialLink) => {
  const { getSocialIconPath } = useSocials();
  return <img src={getSocialIconPath(name)} alt={name} className="h-6 w-6" />;
};

interface ProfileSocialsProps {
  socials: SocialLink[];
}

export const ProfileSocials = ({ socials }: ProfileSocialsProps) => {
  return (
    <>
      {socials.length !== 0 && (
        <div className="flex gap-4 justify-center">
          {socials.map((social, index) => (
            <SocialLinkIcon key={index} name={social.name} />
          ))}
        </div>
      )}
    </>
  );
};
