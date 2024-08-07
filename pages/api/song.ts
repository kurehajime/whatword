// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import OpenAI from 'openai';
type Data = {
  result?: string
  error?: string[]
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY // This is also the default, can be omitted
});

const generatePrompt = (keyword: string) => {
  return `「${keyword}」に関する4行の詩を日本語で作ってください。
  ただし歌詞の中で「${keyword}」や「${keyword}を意味する日本語」を絶対に使わないでください。`;
}
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (!openai.apiKey) {

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
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "あなたは詩人です。詩を作って喜怒哀楽を表現することができます。" },
        { role: "user", content: generatePrompt(keyword) }
      ],
      temperature: 0.6,
      max_tokens: 500
    });
    res.status(200).json({ result: completion.choices[0].message?.content ?? '' });
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