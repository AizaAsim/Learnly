import { useTranslation } from "react-i18next";
import { useCallback, useMemo } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { firestore } from "@/services/firebase";
import { ReelData } from "@/types";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { logError } from "@/services/logging";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useModal } from "@/hooks/useModal";
import { useDispatch } from "react-redux";
import { updateReel } from "@/store/reducers/myVideosReducer";
import { useToast } from "@/components/ui/use-toast";
import { TextIcon } from "lucide-react";
import { DescriptionField } from "./EditReelDetails/DescriptionField";
import { useEditReelDetails } from "../hooks/useEditReelDetails";
import { LinkField } from "./EditReelDetails/LinkField";

const maxDescriptionLength = import.meta.env.VITE_MAX_DESCRIPTION_LENGTH;
const FormSchema = z.object({
  description: z
    .string()
    .max(maxDescriptionLength, "reelUpload_editDetails_description_error")
    .optional(),
  link: z
    .string()
    .optional()
    .refine(
      (value) =>
        !value ||
        /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})(\/[\w.-]*)*\/?$/.test(
          value
        ),
      {
        message: "reelUpload_editDetails_link_error",
      }
    ),
});
type FormData = z.infer<typeof FormSchema>;

export const EditDetailsForm = ({ reel }: { reel: ReelData }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { closeModal } = useModal();
  const {
    handleDescriptionChange,
    descriptionLength,
    maxDescriptionLength,
    link,
    handleLinkChange,
  } = useEditReelDetails();
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty, isValid },
  } = useForm<FormData>({
    mode: "onChange",
    resolver: zodResolver(FormSchema),
    defaultValues: {
      description: reel?.description || "",
      link: reel?.link || "",
    },
  });

  const onSubmit = useCallback(
    async (data: Record<string, string>) => {
      const reelRef = doc(firestore, `reels/${reel.id}`);

      try {
        const updated = {
          description: data.description,
          link: data.link,
        };

        await updateDoc(reelRef, updated);
        dispatch(updateReel({ id: reel.id, data: updated }));
        toast({
          text: "EduClip details updated",
          icon: <TextIcon />,
          variant: "blur",
        });
      } catch (error) {
        logError("Error updating document: ", error);
        toast({
          text: "Something went wrong!",
          variant: "destructive",
          duration: 5000,
        });
      } finally {
        closeModal();
      }
    },
    [closeModal, dispatch, reel.id, toast]
  );

  const buttonIsDisabled = useMemo(
    () => isSubmitting || !isDirty || !isValid,
    [isSubmitting, isDirty, isValid]
  );

  return (
    <form
      className="flex flex-col gap-3.5 md:gap-4 max-w-full md:w-[354px] mx-auto"
      onSubmit={handleSubmit(onSubmit)}
    >
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
      <div className="flex flex-col mt-1 md:mt-2.5">
        <Button type="submit" disabled={buttonIsDisabled}>
          {t("reelUpload_button_saveDetails")}
        </Button>
      </div>
    </form>
  );
};
