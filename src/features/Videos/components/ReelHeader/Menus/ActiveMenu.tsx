import { HeaderMenu } from "../HeaderMenu";
import { CopyLink } from "../Actions/CopyLink";
import { DeleteReel } from "../Actions/DeleteReel";
import { EditDetails } from "../Actions/EditDetails";
import { ArchiveReel } from "../Actions";

export const ActiveMenu = () => {
  return (
    <HeaderMenu>
      {(close) => (
        <>
          <CopyLink onClick={close} />
          <EditDetails onClick={close} />
          <ArchiveReel onClick={close} />
          <DeleteReel onClick={close} />
        </>
      )}
    </HeaderMenu>
  );
};
