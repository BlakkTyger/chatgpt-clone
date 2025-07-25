import { streamText } from 'ai';
import { google } from '@ai-sdk/google';
import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const { prompt, model } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }
    
    const aiModel = model || 'gemini-1.5-flash-latest';

    const result = await streamText({
      model: google(`models/${aiModel}`),
      prompt: prompt,
    });

    // ✨ FIX: Return the .response property directly
    return result.response;

  } catch (error) {
    console.error("Error in API route:", error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}