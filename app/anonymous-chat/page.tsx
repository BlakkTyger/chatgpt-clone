"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Message } from "@/types";
import { AIModel } from "@/lib/types";
import { AnonymousForm } from "./_components/anonymous-form";
import { Body } from "../chat/[chatId]/_components/body";
import { Button } from "@/components/ui/button";
import { LogOut, ChevronDown, Gem, Zap, Sparkles } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

const AnonymousChatPage = () => {
    const router = useRouter();
    const [messages, setMessages] = useState<Message[]>([]);
    const [selectedModel, setSelectedModel] = useState<AIModel>(AIModel.GeminiFlash);
    const [openSelect, setOpenSelect] = useState(false);

    const handleExit = () => {
        localStorage.removeItem("anonymous_chat");
        router.push("/");
    };

    const handleSendMessage = async (content: string) => {
        const userMessage: Message = { id: crypto.randomUUID(), role: 'user', content, created_at: new Date().toISOString(), chat_id: "anonymous", user_id: "anonymous" };
        const assistantPlaceholder: Message = { id: crypto.randomUUID(), role: 'assistant', content: 'Generating...', created_at: new Date().toISOString(), isLoading: true, chat_id: "anonymous", user_id: "anonymous" };

        setMessages(prev => [...prev, userMessage, assistantPlaceholder]);

        try {
            const response = await fetch('/api/chat', { 
                method: 'POST', 
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    prompt: content, 
                    model: selectedModel 
                }) 
            });
            
            if (!response.ok) {
                throw new Error("API request failed.");
            }

            const { response: assistantResponse } = await response.json();

            setMessages(prev => prev.map(msg => 
                msg.id === assistantPlaceholder.id 
                    ? { ...msg, content: assistantResponse, isLoading: false } 
                    : msg
            ));
        } catch (error: any) {
            toast.error(error.message || "An error occurred.");
            setMessages(prev => prev.map(msg => 
                msg.id === assistantPlaceholder.id 
                    ? { ...msg, content: "Sorry, an error occurred.", isLoading: false } 
                    : msg
            ));
        }
    };
    
    
    let modelVersionText;
    switch (selectedModel) {
        case AIModel.GPT4: modelVersionText = "GPT-4"; break;
        case AIModel.GeminiFlash: modelVersionText = "Gemini"; break;
        default: modelVersionText = "Gemini";
    }

    return (
        <div className="bg-neutral-800 w-full h-full flex flex-col">
            <div className="flex h-[100px] justify-between items-center p-5 border-b border-neutral-700">
                <div className="flex items-center gap-4">
                    <h1 className="text-xl font-semibold">Anonymous Chat</h1>
                    {/* ✨ New Model Selector Popover */}
                    <Popover open={openSelect} onOpenChange={setOpenSelect}>
                        <PopoverTrigger onClick={() => setOpenSelect(p => !p)} className="flex space-x-2 font-semibold items-center outline-none">
                            <p className="text-white/50">{modelVersionText}</p>
                            <ChevronDown className="text-white/50 w-5 h-5" />
                        </PopoverTrigger>
                        <PopoverContent className="flex flex-col border-0 bg-neutral-700 text-white p-3 space-y-1">
                            <div onClick={() => { setSelectedModel(AIModel.GeminiFlash); setOpenSelect(false); }} className="flex items-center text-start cursor-pointer rounded-md justify-start space-x-2 p-2 w-full h-full hover:bg-neutral-600">
                                <Gem className="w-6 h-6 text-blue-400" />
                                <div className="w-full"><p>Gemini 2.5 Flash</p><p className="text-white/70 text-xs">Fast and efficient.</p></div>
                                <Checkbox checked={selectedModel === AIModel.GeminiFlash} />
                            </div>
                            
                            <div onClick={() => { setSelectedModel(AIModel.GPT4); setOpenSelect(false); }} className="flex items-center text-start cursor-pointer rounded-md justify-start space-x-2 p-2 w-full h-full hover:bg-neutral-600">
                                <Sparkles className="w-6 h-6" />
                                <div className="w-full"><p>GPT-4</p><p className="text-white/70 text-xs">Our smartest model.</p></div>
                                <Checkbox checked={selectedModel === AIModel.GPT4} />
                            </div>
                        </PopoverContent>
                    </Popover>
                </div>
                <Button onClick={handleExit} variant="destructive" className="flex items-center gap-2">
                    <LogOut className="w-4 h-4" />
                    Exit & Clear
                </Button>
            </div>
            <div className="flex flex-col h-full w-full">
                <Body messages={messages} onLoadMore={() => {}} hasMoreMessages={false} isLoadingMore={false} />
                <div className="w-full fixed bottom-0">
                    <AnonymousForm onSendMessage={handleSendMessage} />
                    <p className="w-full text-center text-xs text-neutral-400 my-2">Your anonymous chat is stored locally and will be cleared when you exit.</p>
                </div>
            </div>
        </div>
    );
};

export default AnonymousChatPage;