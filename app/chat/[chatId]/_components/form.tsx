// app/chat/[chatId]/_components/form.tsx
"use client";

import { Input } from "@/components/ui/input";
import { useUser } from "@/hooks/useUser";
import { supabase } from "@/utils/supabase/client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface FormProps {
    chatId: string;
}

export const Form = ({ chatId }: FormProps) => {
    const { user } = useUser();
    const router = useRouter();
    const [message, setMessage] = useState<string>("");

    const generateDummyResponse = async (currentChatId: string, currentUserId: string) => {
        await new Promise(resolve => setTimeout(resolve, 1200));

        const { error } = await supabase.from("messages").insert({
            chat_id: currentChatId,
            user_id: currentUserId,
            role: "assistant",
            content: "This is a dummy response from the chatbot. The real AI logic is not yet implemented.",
        });

        if (error) {
            toast.error("Dummy response failed to send.");
        }
    };

    const handleSendMessage = async () => {
        if (message.trim() === "" || !user) return;

        const tempMessage = message;
        setMessage("");

        let currentChatId = chatId;

        if (chatId === 'new') {
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
            
            router.push(`/chat/${currentChatId}`);

        } else {
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
        
        await generateDummyResponse(currentChatId, user.id);
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
                placeholder="Message TalkGPT..."
                className="border-[1px] border-neutral-500 ring-offset-0 focus-visible:ring-0 rounded-xl bg-inherit text-neutral-200 placeholder:text-neutral-400 h-12"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={!user}
            />
        </div>
    );
};