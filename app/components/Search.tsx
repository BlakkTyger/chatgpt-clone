"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/utils/supabase/client"; 
import { useRouter } from "next/navigation";
import React, { useRef, useState } from "react";
import { BsRobot } from "react-icons/bs";
import { PiSealQuestionThin } from "react-icons/pi";
import { useToast } from "@/components/ui/use-toast";
import { stripIndent, oneLine } from "common-tags";

interface QnaPair {
    id: number;
    question: string;
    answer: string | null;
    isLoading: boolean;
}

export default function Search() {
    const router = useRouter();
    const inputRef = useRef<HTMLInputElement>(null);
    const { toast } = useToast();
    const [qnaPairs, setQnaPairs] = useState<QnaPair[]>([]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.refresh();
    };

    const toastError = (message = "Something went wrong") => {
        toast({
            title: "Error",
            description: message,
            variant: "destructive",
        });
    };

    const handleSearch = async () => {
        const searchText = inputRef.current?.value;
        if (!searchText || searchText.trim() === "") return;

        const currentId = Date.now();
        const newQnaPair: QnaPair = { id: currentId, question: searchText, answer: null, isLoading: true };
        setQnaPairs(prev => [...prev, newQnaPair]);
        
        if(inputRef.current) {
            inputRef.current.value = "";
        }

        try {
            const embeddingResponse = await fetch("/api/embedding", {
                method: "POST",
                body: JSON.stringify({ text: searchText.replace(/\n/g, " ") }),
            });
            if (!embeddingResponse.ok) throw new Error("Failed to get embedding.");
            const { embedding } = await embeddingResponse.json();

            const { data: documents, error: rpcError } = await supabase.rpc(
                "match_documents",
                {
                    query_embedding: embedding,
                    match_threshold: 0.78,
                    match_count: 5,
                }
            );
            if (rpcError) throw new Error("Failed to match documents.");

            let tokenCount = 0;
            let contextText = "";
            for (const doc of documents) {
                tokenCount += doc.token_count;
                if (tokenCount > 1500) break;
                contextText += `${doc.content.trim()}\n--\n`;
            }

            if (contextText === "") {
                throw new Error("Sorry, I don't have enough information to answer that.");
            }

            const prompt = generatePrompt(contextText, searchText);

            const chatResponse = await fetch("/api/chat", {
                method: "POST",
                body: JSON.stringify({ prompt }),
            });
            if (!chatResponse.ok) throw new Error("Failed to get answer from AI.");
            const { choices } = await chatResponse.json();

            setQnaPairs(prev => prev.map(pair => 
                pair.id === currentId ? { ...pair, answer: choices[0].text, isLoading: false } : pair
            ));

        } catch (error: any) {
            toastError(error.message);
            setQnaPairs(prev => prev.map(pair => 
                pair.id === currentId ? { ...pair, answer: "An error occurred. Please try again.", isLoading: false } : pair
            ));
        }
    };

    const generatePrompt = (contextText: string, searchText: string) => {
        return stripIndent`${oneLine`
            You are a very enthusiastic DailyAI representative who loves to help people! Given the following sections from the DailyAI documentation, answer the question using only that information, outputted in markdown format. If you are unsure and the answer is not explicitly written in the documentation, say "Sorry, I don't know how to help with that."`}

            Context sections:
            ${contextText}

            Question: """
            ${searchText}
            """

            Answer as markdown (including related code snippets if available):
        `;
    };

    return (
        <div className="flex flex-col h-full">
            <div className="flex items-center justify-between border-b p-4">
                <div className="flex items-center gap-2">
                    <BsRobot className="w-5 h-5" />
                    <h1 className="font-semibold">Daily AI</h1>
                </div>
                <Button onClick={handleLogout} variant="outline" size="sm">Logout</Button>
            </div>
            
            <div className="flex-1 p-4 overflow-y-auto space-y-8">
                {/* ✨ Render from the single Q&A state array */}
                {qnaPairs.map(({ id, question, answer, isLoading }) => (
                    <div className="space-y-3" key={id}>
                        <div className="flex items-center gap-2 font-semibold">
                            <PiSealQuestionThin className="w-5 h-5 flex-shrink-0" />
                            <h1>{question}</h1>
                        </div>
                        <div className="flex items-start gap-2 pl-7 text-neutral-300">
                           <BsRobot className="w-5 h-5 flex-shrink-0 text-indigo-400 mt-1" />
                           {isLoading ? <p>Loading...</p> : <p className="leading-relaxed">{answer}</p>}
                        </div>
                    </div>
                ))}
            </div>

            <div className="p-4 border-t">
                <Input
                    ref={inputRef}
                    placeholder="Ask daily ai a question..."
                    onKeyDown={(e) => {
                        if (e.key === "Enter") handleSearch();
                    }}
                />
            </div>
        </div>
    );
}