import { ScheduleReel } from "../Actions";
import { ArchiveReel } from "../Actions/ArchiveReel";
import { DeleteReel } from "../Actions/DeleteReel";
import { EditDetails } from "../Actions/EditDetails";
import { PublishReel } from "../Actions/PublishReel";
import { HeaderMenu } from "../HeaderMenu";

export const ScheduledMenu = () => {
  return (
    <HeaderMenu>
      {(close) => (
        <>
          <PublishReel onClick={close} />
          <ScheduleReel onClick={close} reschedule />
          <EditDetails onClick={close} />
          <ArchiveReel onClick={close} />
          <DeleteReel onClick={close} />
        </>
      )}
    </HeaderMenu>
  );
};
