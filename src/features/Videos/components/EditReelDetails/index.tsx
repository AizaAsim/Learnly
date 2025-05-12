import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { DescriptionField } from "./DescriptionField";
import { LinkField } from "./LinkField";
import { ScheduleField } from "./ScheduleField";
import { useEditReelDetails } from "../../hooks/useEditReelDetails";
import { useUploadLimits } from "../../hooks/useUploadLimits";
import { cn } from "@/lib/utils";

export const EditReelDetails = () => {
  const {
    register,
    handleSubmit,
    onSubmit,
    handleDescriptionChange,
    handleLinkChange,
    handleSaveDraft,
    descriptionLength,
    maxDescriptionLength,
    errors,
    scheduleDate,
    scheduleTime,
    isPublishingOrScheduling,
    isSavingDraft,
    link,
  } = useEditReelDetails();
  const { t } = useTranslation();
  const { scheduledUnderLimit, draftsUnderLimit } = useUploadLimits();

  return (
    <div>
      <form
        className="flex flex-col gap-4 max-w-[327px] md:max-w-full mx-auto"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="flex flex-col gap-3.5">
          <DescriptionField
            registerReturn={register("description", {
              onChange(event) {
                handleDescriptionChange(event);
              },
            })}
            descriptionLength={descriptionLength}
            maxDescriptionLength={maxDescriptionLength}
            errorMessage={errors.description?.message}
          />
          <LinkField
            registerReturn={register("link", {
              onChange(event) {
                handleLinkChange(event);
              },
            })}
            link={link}
            errorMessage={errors.link?.message}
          />

          <ScheduleField
            scheduleDate={scheduleDate}
            scheduleTime={scheduleTime}
            scheduledUnderLimit={scheduledUnderLimit}
          />
        </div>

        <div className="flex flex-col gap-4">
          <Button
            type="submit"
            disabled={isPublishingOrScheduling || isSavingDraft}
          >
            {scheduleDate && scheduleTime
              ? t("reelUpload_button_schedule")
              : t("reelUpload_button_publish")}
          </Button>
          <Button
            variant="ghost"
            size="none"
            onClick={handleSaveDraft}
            type="button"
            className={cn({ "text-grayscale-24": !draftsUnderLimit })}
            disabled={
              isPublishingOrScheduling || isSavingDraft || !draftsUnderLimit
            }
          >
            {t("reelUpload_button_saveAsDraft") +
              (draftsUnderLimit ? "" : ` (${t("reelUpload_limitOver")})`)}
          </Button>
        </div>
      </form>
    </div>
  );
};
