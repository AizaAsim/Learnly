import { Timestamp } from "firebase-admin/firestore";
import { Role } from "../types/roles";
import { firestore } from "./firebaseAdmin";
import { logError, logInfo } from "./logging";
import { v4 as uuidv4 } from "uuid";
import {
  createQueueTask,
  deleteScheduledTask,
} from "../shared/helpers/cloudTasks";
import { TasksQueueNames } from "../types/cloudTasks";

interface OtpDocument {
  email: string;
  otp: string;
  role: Role;
  deleteOtpTaskId: string;
  createdAt: FirebaseFirestore.Timestamp;
  expiresAt: FirebaseFirestore.Timestamp;
}

interface VerifyOtpResult {
  isValid: boolean;
  message: string;
  role?: Role;
}

const OTP_COLLECTION = "userVerificationCodes";

export const generateAndSaveOtp = async (
  email: string,
  role: Role
): Promise<string | null> => {
  // Check if an OTP already exists for this email
  const existingOtpQuery = await firestore
    .collection(OTP_COLLECTION)
    .where("email", "==", email)
    .where("expiresAt", ">", Timestamp.now())
    .limit(1)
    .get();

  if (!existingOtpQuery.empty) {
    // An unexpired OTP already exists for this email
    return null;
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  // Create an otp document with a random ID
  const otpRef = firestore.collection(OTP_COLLECTION).doc();

  const now = Timestamp.now();
  const expirationTime = Timestamp.fromMillis(now.toMillis() + 2 * 60 * 1000); // 120 seconds expiration
  const otpId = otpRef.id;

  // Add task to queue for OTP deletion
  const taskId = await createDeleteOtpTask(otpId, expirationTime);

  await otpRef.set({
    email,
    otp,
    role,
    deleteOtpTaskId: taskId,
    createdAt: now,
    expiresAt: expirationTime,
  });

  return otp;
};

export const verifyOtp = async (
  email: string,
  otp: string
): Promise<VerifyOtpResult> => {
  try {
    const result = await firestore.runTransaction(async (transaction) => {
      const otpQuery = await transaction.get(
        firestore
          .collection(OTP_COLLECTION)
          .where("email", "==", email)
          .where("otp", "==", otp)
          .limit(1)
      );

      if (otpQuery.empty) {
        return { isValid: false, message: "Invalid or expired OTP" };
      }

      const otpDoc = otpQuery.docs[0];
      const otpData = otpDoc.data() as OtpDocument;

      if (otpData.expiresAt < Timestamp.now()) {
        return { isValid: false, message: "OTP has expired" };
      }

      // Delete the OTP document
      transaction.delete(otpDoc.ref);

      // Delete the scheduled delete otp task
      try {
        await deleteScheduledTask(
          TasksQueueNames.DeleteOtp,
          otpData.deleteOtpTaskId
        );
        logInfo(
          `Deleted scheduled task ${otpData.deleteOtpTaskId} for OTP ${otpDoc.id}`
        );
      } catch (error) {
        logError(
          `Failed to delete scheduled task ${otpData.deleteOtpTaskId} for OTP ${otpDoc.id}:`,
          error
        );
        // Note: We don't change the result here because the OTP verification was successful
      }

      return {
        isValid: true,
        message: "OTP verified successfully",
        role: otpData.role,
      };
    });

    return result;
  } catch (error) {
    logError("Error verifying OTP:", error);
    return {
      isValid: false,
      message: "Error occurred while verifying OTP",
    };
  }
};

async function createDeleteOtpTask(otpId: string, expirationTime: Timestamp) {
  const taskId = uuidv4();
  const payload = { otpId };
  const functionUrl = "auth-deleteOtp";

  try {
    await createQueueTask(
      TasksQueueNames.DeleteOtp,
      taskId,
      payload,
      functionUrl,
      expirationTime
    );
    logInfo(`Created delete task ${taskId} for OTP ${otpId}`);
    return taskId;
  } catch (error) {
    logError(`Failed to create delete task for OTP ${otpId}:`, error);
    return;
  }
}

export const deleteOtp = async (otpId: string): Promise<boolean> => {
  try {
    const otpRef = firestore.collection(OTP_COLLECTION).doc(otpId);
    const otpDoc = await otpRef.get();

    if (!otpDoc.exists) {
      logInfo(`OTP ${otpId} not found for deletion`);
      return false;
    }

    await otpRef.delete();
    logInfo(`Successfully deleted OTP ${otpId}`);
    return true;
  } catch (error) {
    logError(`Error deleting OTP ${otpId}:`, error);
    return false;
  }
};
