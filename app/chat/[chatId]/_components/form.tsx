// app/chat/[chatId]/_components/form.tsx
"use client";

import { Input } from "@/components/ui/input";
import { useUser } from "@/hooks/useUser";
import { supabase } from "@/utils/supabase/client";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface FormProps {
    chatId: string;
}

export const Form = ({ chatId }: FormProps) => {
    const { user } = useUser();
    const [message, setMessage] = useState<string>("");
    const router = useRouter();

    const handleSendMessage = async () => {
        if (message.trim() === "" || !user) return;

        const tempMessage = message;
        setMessage("");

        // Insert user message into Supabase
        if (chatId === 'new') {
            // 1. Create a new chat record in the database
            const { data: newChat, error: chatError } = await supabase
                .from('chats')
                .insert({ user_id: user.id, title: tempMessage.substring(0, 25) }) // Use first part of message as title
                .select('id')
                .single();

            if (chatError || !newChat) {
                toast.error("Failed to create a new chat.");
                setMessage(tempMessage); // Restore message on failure
                return;
            }

            // 2. Insert the first message
            await supabase.from("messages").insert({
                chat_id: newChat.id,
                user_id: user.id,
                role: "user",
                content: tempMessage,
            });

            // 3. Redirect to the new, permanent chat URL
            router.push(`/chat/${newChat.id}`);

        } else {
            const { error } = await supabase.from("messages").insert({
                chat_id: chatId,
                user_id: user.id,
                role: "user",
                content: tempMessage,
            });

            if (error) {
                toast.error("Failed to send message. Please try again.");
                setMessage(tempMessage); // Restore message on failure
                return;
            }
        }

        // --- Placeholder for AI Response ---
        // In a real app, you would now call your AI API
        // and then insert the assistant's response.
        // For now, we'll simulate a response.
        await new Promise(resolve => setTimeout(resolve, 1000));
        await supabase.from("messages").insert({
            chat_id: chatId,
            user_id: user.id, // Associate with user for RLS
            role: "assistant",
            content: `This is a simulated AI response to: "${tempMessage}"`,
        });
        // ------------------------------------
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