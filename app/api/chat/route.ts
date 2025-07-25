// app/api/chat/route.ts
import { GoogleGenerativeAI } from '@google/generative-ai';
import { OpenAI } from 'openai';
import { NextResponse } from 'next/server';
import { AIModel } from '@/lib/types';
import { createClient } from '@/utils/supabase/server';

import { Memory } from 'mem0ai/oss';

const GEMINI_API_KEY = process.env.GOOGLE_API_KEY!;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY!;
  
//const memory = new Memory({
//    embedder: {
//      provider: 'gemini',
//      config: {
//        apiKey: process.env.GOOGLE_API_KEY,
//        model: 'models/text-embedding-004',
//      },
//    },
//    llm: {
//      provider: 'gemini',
//      config: {
//        apiKey: process.env.GOOGLE_API_KEY,
//        model: 'gemini-2.5-flash',  // or flash-lite
//        
//      },
//    }
//  });
  


const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const openai = new OpenAI({
    apiKey: OPENAI_API_KEY,
});

export async function POST(req: Request) {
    try {
        const { prompt, model, chatId } = await req.json();

        if (!prompt) {
            return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
        }

        // --- 1. Get User Info and Relevant Memories ---
        //const supabase = await createClient();
        //const { data: { user } } = await supabase.auth.getUser();
        //const userId = user?.id; // This will be null for anonymous chats


        let responseText: string;
        //const context = '';

        //if (userId == null) {
        //    const context = '';
        //} else {
        //    const result = await memory.search(prompt, { userId: userId, agentId: chatId });
        //    const memories = result.results;
        //    const context = memories
        //        .map(entry => entry.memory)
        //        .join('\n');
        //    console.log('Memory Context:', context);
        //}


        if (model === AIModel.GPT4) {
            console.log('Using GPT-4 model');
            console.log(OPENAI_API_KEY)
            const completion = await openai.chat.completions.create({
                model: "gpt-4.1-mini", // Use available GPT-4 model
                messages: [
                    {
                        role: "user",
                        //content: "context: " + context + "\n" + "user query: " + prompt,
                        content:  prompt,
                    }
                ],
                max_tokens: 1000,
            });

            responseText = completion.choices[0]?.message?.content || "Sorry, I couldn't generate a response.";

        } else {
            console.log('Using Gemini model');

            const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
            //const result = await model.generateContent("context: " + context + "\n" + "user query: " + prompt,);
            const result = await model.generateContent(prompt);
            const response = await result.response;
            responseText = response.text();

            console.log('Gemini Response:', responseText);
        }

        //const messages = [
        //    { "role": "user", "content": prompt },
        //    { "role": "assistant", "content": responseText }
        //]
        //
        //if (userId == null) {
        //    console.log('Anonymous user, not storing memories');
        //} else {
        //    await memory.add(messages, { userId: userId, agentId: chatId });
        //}

        return NextResponse.json({ response: responseText });

    } catch (error) {
        console.error("Error in API route:", error);
        return NextResponse.json({
            error: 'Something went wrong while generating response'
        }, { status: 500 });
    }
}