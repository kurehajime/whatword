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
const generatePrompt = (keyword: string) => {
  return `「${keyword}」に関する4行の詩を日本語で作ってください。
  ただし歌詞の中で「${keyword}」や${keyword}を意味する日本語を絶対に使わないでください。`;
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
  console.log(req.body)
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
      max_tokens: 500
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
