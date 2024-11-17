import "dotenv/config";

export async function GET(req: Request) {
    var data = await fetch(`https://api.thedogapi.com/v1/images/search?limit=10&api_key=${process.env.DOG_API_KEY}`)
    var dog = await data.json()

    return new Response(JSON.stringify({ ...dog[0] }))
}