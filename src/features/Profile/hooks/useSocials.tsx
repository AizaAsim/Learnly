export const useSocials = () => {
  const socials = [{ name: "Tiktok" }, { name: "Instagram" }];

  const getSocialIconPath = (platform: string) =>
    `/icon/socials/${platform.toLowerCase()}.svg`;

  return {
    socials,
    getSocialIconPath,
  };
};
