import "dotenv/config";

async function imageUrlToBase64(url: string) {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`);
    }

    const mimeType = response.headers.get("content-type");
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Image = buffer.toString("base64");

    return `data:${mimeType};base64,${base64Image}`;
  } catch (error) {
    throw new Error("Unable to convert image to base64.");
  }
}

export async function GET() {
  var data = await fetch(
    `https://api.thedogapi.com/v1/images/search?limit=10&api_key=${process.env.DOG_API_KEY}`
  );
  var dog = (await data.json()) as any[];

  if (dog.length) {
    var url = dog[0].url;

    var base64 = await imageUrlToBase64(url);

    return new Response(JSON.stringify({ ...dog[0], base64 }));
  }
}
