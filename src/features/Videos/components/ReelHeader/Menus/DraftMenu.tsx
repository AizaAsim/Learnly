import { HeaderMenu } from "../HeaderMenu";
import { PublishReel } from "../Actions/PublishReel";
import { ScheduleReel } from "../Actions/ScheduleReel";
import { EditDetails } from "../Actions/EditDetails";
import { ArchiveReel } from "../Actions/ArchiveReel";
import { DeleteReel } from "../Actions/DeleteReel";

export const DraftMenu = () => {
  return (
    <HeaderMenu>
      {(close) => (
        <>
          <PublishReel onClick={close} />
          <ScheduleReel onClick={close} />
          <EditDetails onClick={close} />
          <ArchiveReel onClick={close} />
          <DeleteReel onClick={close} />
        </>
      )}
    </HeaderMenu>
  );
};
