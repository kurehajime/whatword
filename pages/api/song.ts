// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { Configuration, OpenAIApi } from "openai";
type Data = {
  result?: string
  error?: string[]
}

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);
const generatePrompt = (animal: string) => {
  const capitalizedAnimal =
    animal[0].toUpperCase() + animal.slice(1).toLowerCase();
  return `Suggest three names for an animal that is a superhero.
Animal: Cat
Names: Captain Sharpclaw, Agent Fluffball, The Incredible Feline
Animal: Dog
Names: Ruff the Protector, Wonder Canine, Sir Barks-a-Lot
Animal: ${capitalizedAnimal}
Names:`;
}
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (!configuration.apiKey) {

    res.status(500).json({
      error: ["OpenAI API key not configured"]
    });
    return;
  }
  const body = JSON.parse(req.body)
  const keyword = body?.keyword || '';
  if (keyword.trim().length === 0) {
    res.status(400).json({
      error: ["Please enter keyword "]
    });
    return;
  }


  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: generatePrompt(keyword),
      temperature: 0.6,
    });
    res.status(200).json({ result: completion.data.choices[0].text });
  } catch (error: any) {
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: ["An error occurred during your request."]
      });
    }
  }
}
