# Dipping our Paws into Generative AI

As a full-time software engineer, during my day job, I’ve had my fair share of run-ins with generative AI and large language models (LLMs). However when my son decided to create a dog meme generator for a session at the [Prestwich Code Club](https://prestwichcodeclub.org.uk), it was a whole new ballgame. The idea? Take a fairly simple application and sprinkle in a little AI magic. The results? Barking brilliant.

The project began with a conversation that went something like this:

> **Son:** Let’s make a dog meme generator for Code Club!
>
> **Me:** A meme generator? How about with a touch of AI? I like where this is going.
>
> **Son:** But it has to be really funny. Like, “rolling on the floor laughing” funny.
>
> **Me:** No pressure, then. Challenge accepted — let’s give AI a sense of humor!

Now, I’m no stranger to AI’s capabilities, but using it in a personal project? That’s a different beast. My first thought: _“How can I do this without spending a penny?”_ As a self-proclaimed frugal developer, the idea of paying for LLM calls — no matter how small the amount — just didn’t sit right with me. After all, why dip into the wallet when you can flex some creativity instead?

I started my journey researching options that wouldn’t break the bank. [Google Gemini](https://ai.google.dev)’s free tier looked tempting, but with my credit card linked to Google Cloud, my inner budget hawk started squawking. I needed a solution that let me experiment without worrying about surprise costs.

Enter [GroqCloud](https://console.groq.com/docs/quickstart). This nifty platform provided free access to Meta’s [Llama](https://www.llama.com) (an LLM, not an actual llama, though that would’ve been amazing) and other providers. It was well-documented, easy to use, and most importantly, cost-free for my needs. Winner, winner, doggy dinner.

With the AI engine sorted, the next step was hosting. For this, I turned to [Vercel](https://vercel.com), a platform with a generous free tier that I use to host all my personal projects. Their platform is not only incredibly reliable but also effortless to work with. It allowed us to not only host our application but also run serverless functions — little bits of code executed in the cloud. This made handling calls to GroqCloud and accessing our AI-powered meme generator completely hassle-free. It was like finding the perfect spot to throw a frisbee for your dog — effortless, ideal, and exactly where we needed it to be.

After setting up a code repository on [GitHub](https://github.com/kyle-riley/meme-generator), which is a platform for storing and managing code, we connected it to Vercel. This made it easy to instantly launch our application on the web whenever we added a new feature or made changes. GitHub helped keep everything organised, while Vercel took care of quickly updating the live version for everyone to see.

Next, it was time to dive into writing the code in [TypeScript](https://www.typescriptlang.org), a superset of JavaScript that adds static typing and other helpful features. In this case, the use of TypeScript is minimal, so you can think of it as essentially JavaScript.

The source code is accessible here: [`api/meme.ts`](https://github.com/kyle-riley/meme-generator/blob/main/api/meme.ts)

### Importing the tools

```js
import { generateObject } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { z } from "zod";
import "dotenv/config";
```

This section imports various third party packages as the 'tools' needed for the project:

- `generateObject`: Used to interact with the AI to create captions.
- `createOpenAI`: A function that helps set up communication with the AI API.
- `z`: A validation library to ensure the data returned by the AI is correctly formatted.
- `dotenv/config`: Loads secret variables, like the API key, from a special file.

### Connecting to GroqCloud

```js
const groq = createOpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});
```

Here, we create a connection to GroqCloud using the API key stored securely in an environment variable. This ensures sensitive information isn’t hardcoded in the app.

### Handling Requests

This is the beginning of our [Vercel Function](https://vercel.com/docs/functions), which allows us to handle HTTP POST requests. Vercel Functions are lightweight, serverless, and automatically scale to meet demand, making them an ideal choice for quickly deploying APIs or handling backend logic without the need to manage servers.

```js
export async function POST(req: Request) {
  const { description } = await req.json();
  if (!description)
    return new Response("description is required", { status: 400 });
```

This function is triggered when a POST request is made to the server. It:

- Extracts the `description` field from the request body.
- Checks if the `description` is provided. If not, it returns a 400 error with a message explaining the issue.

### Generating the Meme Caption

```js
const result = await generateObject({
  temperature: 0.9,
  model: groq("llama3-8b-8192"),
  prompt: `
    You are a dog meme generator. Given the description of a picture,
    generate a two-line funny caption for it. DO NOT return the description: ${description}
  `,
  schema: z.object({
    firstLine: z.string().describe("The first line of the caption").trim(),
    secondLine: z.string().describe("The second line of the caption").trim(),
  }),
});
```

This is the heart of the app. It:

- Uses the `generateObject` function to send a prompt to the AI.
- Sets a `temperature` of `0.9` to make the AI's responses more creative.
- Specifies the AI model (`llama3-8b-8192`) provided by GroqCloud.
- Passes the user-provided description to the AI in a prompt.
- Validates the returned caption using a schema with two required lines, ensuring the output is clean and usable.

### Returning the Result

```js
  return result.toJsonResponse();
}
```

The last step converts the AI’s response into JSON format and sends it back to the user. This makes the generated meme caption easily accessible for the frontend or wherever it’s needed.

Summary of How It Works:

1. **User Request**: The user sends a picture description.
2. **AI Generation**: The app uses GroqCloud’s AI to create a funny, two-line caption.
3. **Validation**: The caption is checked to ensure it’s formatted correctly.
4. **Response**: The app sends the caption back to the user in JSON format.

The above code highlights how a combination of AI and simple serverless functions can create something creative and fun!

The final product was simple yet effective. The app took a description of an image — something like, “A dog looking guilty next to a shredded slipper” — and generated a meme-worthy caption to go with it. The results ranged from surprisingly witty to downright hilarious, and my son had a great time laughing at some of the auto-generated gems.

If you’ve been curious about trying out generative AI, my advice is simple: start small, use free tools, and just have fun with it. Whether you’re working solo or teaming up with family, it’s a great way to dive into AI — and maybe end up with a collection of dog memes to brighten your day.

- AI doesn’t have to be expensive or complex to add a spark to small, creative projects.
- Tools like GroqCloud and Vercel make experimenting with generative AI accessible and beginner-friendly.
- Dogs will always be the undisputed kings of meme-worthy content.

If you're interested in diving deeper or experimenting with building your own AI application, I highly recommend checking out the [Vercel SDK Guides](https://sdk.vercel.ai/docs/guides) as a great starting point.
