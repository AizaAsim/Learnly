import OpenAI from "openai";
import { ModerationMultiModalInput } from "openai/resources";

const getOpenAIClient = () => {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OpenAI API key not found");
  }
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
};

export const moderateImage = async (image: string) => {
  const openai = getOpenAIClient();
  const imageInput: ModerationMultiModalInput = {
    type: "image_url",
    image_url: { url: image },
  };

  const moderation = await openai.moderations.create({
    model: "omni-moderation-latest",
    input: [imageInput],
  });

  return moderation;
};

export const moderateText = async (text: string) => {
  const openai = getOpenAIClient();
  const moderation = await openai.moderations.create({
    model: "omni-moderation-latest",
    input: [{ type: "text", text }],
  });

  return moderation;
};
