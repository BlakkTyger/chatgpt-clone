// app/api/chat/route.ts
import { GoogleGenerativeAI } from '@google/generative-ai';
import { OpenAI } from 'openai';
import { NextResponse } from 'next/server';
import { AIModel } from '@/lib/types';

export const runtime = 'edge';

const GEMINI_API_KEY = process.env.GOOGLE_API_KEY!;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY!;

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const openai = new OpenAI({
    apiKey: OPENAI_API_KEY,
});

export async function POST(req: Request) {
    try {
        const { prompt, model } = await req.json();

        if (!prompt) {
            return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
        }

        let responseText: string;


        if (model === AIModel.GPT4) {
            console.log('Using GPT-4 model');
            console.log(OPENAI_API_KEY)
            const completion = await openai.chat.completions.create({
                model: "gpt-4.1-mini", // Use available GPT-4 model
                messages: [
                    {
                        role: "user",
                        content: prompt
                    }
                ],
                max_tokens: 1000,
            });

            responseText = completion.choices[0]?.message?.content || "Sorry, I couldn't generate a response.";
            console.log('GPT-4 Response:', responseText);

        } else {
            console.log('Using Gemini model');
            
            const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
            const result = await model.generateContent(prompt);
            const response = await result.response;
            responseText = response.text();
            
            console.log('Gemini Response:', responseText);
        }

        return NextResponse.json({ response: responseText });

    } catch (error) {
        console.error("Error in API route:", error);
        return NextResponse.json({ 
            error: 'Something went wrong while generating response' 
        }, { status: 500 });
    }
}