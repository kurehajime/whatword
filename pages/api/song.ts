// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import OpenAI from 'openai';
type Data = {
  result?: string
  error?: string[]
}

const generatePrompt = (keyword: string) => {
  return `「${keyword}」に関する4行の詩を日本語で作ってください。
  ただし歌詞の中で「${keyword}」や「${keyword}を意味する日本語」を絶対に使わないでください。`;
}
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    res.status(405).json({ error: ['POSTでリクエストしてください。'] });
    return;
  }

  let body: unknown = req.body;
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch {
      res.status(400).json({ error: ['リクエストの形式が正しくありません。'] });
      return;
    }
  }
  const keyword = body && typeof body === 'object' && 'keyword' in body
    ? body.keyword : undefined;
  if (typeof keyword !== 'string' || keyword.trim().length === 0) {
    res.status(400).json({ error: ['キーワードを入力してください。'] });
    return;
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.error('OpenAI API key not configured');
    res.status(503).json({ error: ['現在、出題サービスを利用できません。'] });
    return;
  }

  try {
    const openai = new OpenAI({ apiKey });
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "あなたは詩人です。詩を作って喜怒哀楽を表現することができます。" },
        { role: "user", content: generatePrompt(keyword.trim()) }
      ],
      temperature: 0.6,
      max_tokens: 500
    });
    const result = completion.choices[0]?.message?.content;
    if (!result?.trim()) {
      res.status(502).json({ error: ['ポエムを作れませんでした。もう一度お試しください。'] });
      return;
    }
    res.status(200).json({ result });
  } catch (error: unknown) {
    if (error instanceof OpenAI.APIError) {
      console.error('OpenAI API request failed', {
        status: error.status,
        code: error.code,
        type: error.type,
        requestId: error.requestID
      });
      if (error.status === 429) {
        res.status(503).json({ error: [error.code === 'insufficient_quota' || error.code === 'credit_balance_exhausted'
          ? '現在、出題サービスの利用枠に達しています。'
          : '出題が混み合っています。少し待ってからもう一度お試しください。'] });
        return;
      }
    } else {
      console.error('Unexpected error while generating a poem');
    }
    res.status(503).json({
      error: ['現在、出題サービスを利用できません。時間をおいてもう一度お試しください。']
    });
  }
}
