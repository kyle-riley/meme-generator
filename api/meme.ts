import { generateObject } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { z } from "zod";
import "dotenv/config";

const groq = createOpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

export async function POST(req: Request) {
  const { description } = await req.json();
  if (!description)
    return new Response("description is required", { status: 400 });

  const result = await generateObject({
    temperature: 0.9,
    model: groq("llama3-8b-8192"),
    prompt: `
      You are a dog meme generator, give the description of a picture,
      generate a two line funny caption for it. DO NOT return the description: ${description}
    `,
    schema: z.object({
      firstLine: z.string().describe("The first line of the caption").trim(),
      secondLine: z.string().describe("The second line of the caption").trim(),
    }),
  });

  return result.toJsonResponse();
}
