import { Timestamp } from "firebase-admin/firestore";
import { firestore } from "../../services/firebaseAdmin";
import { logInfo } from "../../services/logging";
import { TopicData, TopicType } from "../../types/pubsub";

export const notificationHandler = async (
  userId: string,
  props: TopicData<TopicType.COMMUNICATION>
) => {
  logInfo("Sending notfication", props);

  const notificationColl = firestore
    .collection("users")
    .doc(userId)
    .collection("notifications");

  const id = notificationColl.doc().id;
  const notification = {
    id,
    ...props.data,
    sentAt: Timestamp.now(),
    readAt: null,
    clearAt: null,
  };
  await notificationColl.doc(id).set(notification);
};
