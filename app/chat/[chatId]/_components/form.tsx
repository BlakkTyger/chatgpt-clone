// app/chat/[chatId]/_components/form.tsx
"use client";

import { Input } from "@/components/ui/input";
import { useUser } from "@/hooks/useUser";
import { supabase } from "@/utils/supabase/client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AIModel } from "@/lib/types";

interface FormProps {
    chatId: string;
}

export const Form = ({ chatId }: FormProps) => {
    const { user } = useUser();
    const router = useRouter();
    const [message, setMessage] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const generateAIResponse = async (currentChatId: string, currentUserId: string, currentUserModel: string, userMessage: string) => {
        try {
            setIsLoading(true);
            
            // Call your API route
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    prompt: userMessage,
                    model: currentUserModel || AIModel.GeminiFlash
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to get AI response');
            }

            const data = await response.json();
            
            if (data.error) {
                throw new Error(data.error);
            }

            // Insert AI response into database
            const { error } = await supabase.from("messages").insert({
                chat_id: currentChatId,
                user_id: currentUserId,
                role: "assistant",
                content: data.response,
            });

            if (error) {
                throw new Error('Failed to save AI response');
            }

        } catch (error) {
            console.error('AI Response Error:', error);
            toast.error("Failed to get AI response. Please try again.");
            
            // Insert error message as fallback
            await supabase.from("messages").insert({
                chat_id: currentChatId,
                user_id: currentUserId,
                role: "assistant",
                content: "Sorry, I'm having trouble responding right now. Please try again.",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleSendMessage = async () => {
        if (message.trim() === "" || !user || isLoading) return;

        const tempMessage = message;
        setMessage("");

        try {
            let currentChatId = chatId;

            if (chatId === 'new') {
                // Create new chat
                const { data: newChat, error: chatError } = await supabase
                    .from('chats')
                    .insert({ user_id: user.id, title: tempMessage.substring(0, 30) })
                    .select('id')
                    .single();

                if (chatError || !newChat) {
                    toast.error("Failed to create a new chat.");
                    setMessage(tempMessage);
                    return;
                }

                currentChatId = newChat.id;

                // Insert user message
                const { error: messageError } = await supabase.from("messages").insert({
                    chat_id: currentChatId,
                    user_id: user.id,
                    role: "user",
                    content: tempMessage,
                });

                if (messageError) {
                    toast.error("Failed to send message.");
                    setMessage(tempMessage);
                    return;
                }

                // Navigate to the new chat
                router.push(`/chat/${currentChatId}`);
            } else {
                // Insert user message for existing chat
                const { error: messageError } = await supabase.from("messages").insert({
                    chat_id: currentChatId,
                    user_id: user.id,
                    role: "user",
                    content: tempMessage,
                });

                if (messageError) {
                    toast.error("Failed to send message.");
                    setMessage(tempMessage);
                    return;
                }
            }

            // Generate AI response
            await generateAIResponse(currentChatId, user.id, user.user_metadata?.model,tempMessage);

        } catch (error) {
            console.error('Send Message Error:', error);
            toast.error("Failed to send message. Please try again.");
            setMessage(tempMessage);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <div className="relative px-2 sm:px-12 md:px-52 lg:pr-[500px] 2xl:px-96 w-full bg-neutral-800">
            <Input
                placeholder={isLoading ? "AI is thinking..." : "Message TalkGPT..."}
                className="border-[1px] border-neutral-500 ring-offset-0 focus-visible:ring-0 rounded-xl bg-inherit text-neutral-200 placeholder:text-neutral-400 h-12"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={!user || isLoading}
            />
            {isLoading && (
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                    <div className="animate-spin h-4 w-4 border-2 border-neutral-400 border-t-transparent rounded-full"></div>
                </div>
            )}
        </div>
    );
};