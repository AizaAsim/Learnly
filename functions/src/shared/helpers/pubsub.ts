import { PubSub } from "@google-cloud/pubsub";
import { CloudEvent } from "firebase-functions/v2/core";
import { MessagePublishedData } from "firebase-functions/v2/pubsub";
import { TopicType } from "../../types/pubsub";

/**
 * Publishes a message to a specified Pub/Sub topic.
 * @template T - The type of the data to be published.
 * @param {TopicType} topic - The name of the Pub/Sub topic to publish the message to.
 * @param {T} data - The data to be published as the message.
 * @returns {Promise<string>} - A promise that resolves to the message ID.
 */
export const publishMessage = async <T>(
  topic: TopicType,
  data: T
): Promise<string> => {
  const pubsub = new PubSub();
  const msgId = await pubsub.topic(topic).publishMessage({
    json: data,
  });
  return msgId;
};
/**
 * Parses a CloudEvent message, decoding it from base64 and parsing it as JSON.
 * @template T - The type of the parsed JSON object.
 * @param {CloudEvent<MessagePublishedData<T>>} event - The CloudEvent containing the message to be parsed.
 * @returns {T} - The parsed JSON object of the specified type.
 */
export const parseCloudEventMessage = <T>(
  event: CloudEvent<MessagePublishedData<T>>
): T => {
  const base64Data = event.data.message.data;
  const messageBuffer = Buffer.from(base64Data, "base64");
  const messageString = messageBuffer.toString("utf-8");
  const parsedData: T = JSON.parse(messageString);
  return parsedData;
};
