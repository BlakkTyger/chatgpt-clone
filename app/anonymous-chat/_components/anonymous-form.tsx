"use client";

import { Input } from "@/components/ui/input";
import { useState } from "react";

interface AnonymousFormProps {
    onSendMessage: (message: string) => Promise<void>;
}

export const AnonymousForm = ({ onSendMessage }: AnonymousFormProps) => {
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            // This guard clause does NOT check for a user
            if (message.trim() === "" || isLoading) return;

            const tempMessage = message;
            setMessage("");
            setIsLoading(true);

            await onSendMessage(tempMessage);

            setIsLoading(false);
        }
    };

    return (
        <div className="relative px-2 sm:px-12 md:px-52 lg:pr-[500px] 2xl:px-96 w-full bg-neutral-800">
            <Input
                placeholder={isLoading ? "AI is thinking..." : "Message anonymously..."}
                className="border-[1px] border-neutral-500 ring-offset-0 focus-visible:ring-0 rounded-xl bg-inherit text-neutral-200 placeholder:text-neutral-400 h-12"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isLoading}
            />
            {isLoading && (
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                    <div className="animate-spin h-4 w-4 border-2 border-neutral-400 border-t-transparent rounded-full"></div>
                </div>
            )}
        </div>
    );
};