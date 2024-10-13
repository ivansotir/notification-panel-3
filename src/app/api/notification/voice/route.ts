import { prisma } from "../../../../../prisma/prisma";
import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";
import { Notification } from "@prisma/client";
import { NotificationType } from "@/types/notification";
import { ElevenLabsClient } from "elevenlabs";

const elevenLabsClient = new ElevenLabsClient({
  apiKey: process.env.ELEVENLABS_API_KEY!,
});

const createAudioStreamFromText = async (
  text: string
): Promise<Buffer> => {
  const audioStream = await elevenLabsClient.generate({
    voice: "Rachel",
    model_id: "eleven_turbo_v2_5",
    text,
  });

  const chunks: Buffer[] = [];
  for await (const chunk of audioStream) {
    chunks.push(chunk);
  }

  const content = Buffer.concat(chunks);
  return content;
};

const promptStart = `You are a helpful assistant that reads notifications and announces them aloud. Summarize the notifications in a few sentences. Here are the notifications: `;

const getPrompt = (notifications: Notification[]) => {
  const notificationText = notifications
    .map((notification, index) => {
      if (notification.type === NotificationType.PLATFORM_UPDATE) {
        return `${index + 1}. ${notification.createdAt.toLocaleString()} ${notification.type}: ${notification.update}`;
      }
      return `${notification.createdAt.toLocaleString()}: ${index + 1}. ${notification.type}: ${notification.personName}`;
    })
    .join("\n");
  return promptStart + notificationText;
};

export async function GET() {
  const notifications = await prisma.notification.findMany({
    where: { read: false },
  });
  const prompt = getPrompt(notifications);
  const { text } = await generateText({
    model: openai("gpt-4o"),
    prompt: prompt,
  });
  const audioBuffer = await createAudioStreamFromText(text);
  return new Response(audioBuffer);
}
