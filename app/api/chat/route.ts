import { google } from '@ai-sdk/google';
import { streamText } from 'ai';

export async function POST(req: Request) {
  const { messages } = await req.json();

  // Vercel AI SDK の streamText 関数を使用して LLM とのストリーミング通信を開始
  const result = streamText({
    model: google('gemini-2.5-pro-exp-03-25'),
    messages,
  });

  // ストリーミング応答をクライアントに返す
  return result.toDataStreamResponse();
}
