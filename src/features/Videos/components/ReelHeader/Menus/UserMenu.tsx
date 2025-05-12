import { HeaderMenu } from "../HeaderMenu";
import { CopyLink } from "../Actions/CopyLink";
import { ReportReel } from "../Actions/ReportReel";

export const UserMenu = () => {
  return (
    <HeaderMenu>
      {(close) => (
        <>
          <CopyLink onClick={close} />
          <ReportReel onClick={close} />
        </>
      )}
    </HeaderMenu>
  );
};
