import { ScheduleReel } from "../Actions";
import { DeleteReel } from "../Actions/DeleteReel";
import { EditDetails } from "../Actions/EditDetails";
import { UnarchiveReel } from "../Actions/UnarchiveReel";
import { HeaderMenu } from "../HeaderMenu";

export const ArchivedMenu = () => {
  return (
    <HeaderMenu>
      {(close) => (
        <>
          <ScheduleReel onClick={close} />
          <EditDetails onClick={close} />
          <UnarchiveReel onClick={close} />
          <DeleteReel onClick={close} />
        </>
      )}
    </HeaderMenu>
  );
};
