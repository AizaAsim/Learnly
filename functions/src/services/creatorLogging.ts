import { CreatorLogType } from "../types/creatorLogging";
import { z } from "zod";
import { firestore } from "./firebaseAdmin";
import { logError } from "./logging";

const schema = z
  .object({
    type: z.nativeEnum(CreatorLogType),
    creatorId: z.string(),
    data: z.unknown(),
  })
  .refine(
    async (parsed) => {
      const { creatorId } = parsed;
      const docRef = firestore.collection("creators").doc(creatorId);
      const doc = await docRef.get();

      const exists = doc.exists;
      if (!exists) return false;

      const creator = doc?.data();
      const hasBeenDeleted = !!creator?.deleted_at;
      return !hasBeenDeleted;
    },
    {
      message: "Educator does not exist.",
      path: ["creatorId"],
    }
  );

/**
 * Logs creator events to the database
 */

export const logCreatorEvent = async ({
  type,
  creatorId,
  ...data
}: {
  type: CreatorLogType;
  creatorId: string;
  data: unknown;
}) => {
  try {
    const validatedData = await schema.parseAsync({ type, creatorId, ...data });
    const logRef = firestore.doc(
      `creators/${validatedData.creatorId}/logs/${Date.now()}`
    );
    await logRef.set({ ...validatedData });
  } catch (error) {
    logError("Error logging creator event", error);
  }
};
