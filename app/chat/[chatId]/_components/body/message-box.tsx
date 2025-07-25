import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Message } from "@/types";
import Markdown from "./markdown";
import { format } from "date-fns"; 

interface MessageBoxProps {
    message: Message;
    userImageUrl?: string;
}

const BlinkingCursor = () => (
    <span className="animate-blink bg-white w-0.5 h-5 inline-block" />
);

export const MessageBox = ({ message, userImageUrl }: MessageBoxProps) => {
    const isUser = message.role === "user";
    const nameString = isUser ? "You" : "ChatGPT";
    const imageUrl = isUser ? userImageUrl : "/logo.svg";

    const timestamp = format(new Date(message.created_at), "p"); 

    return (
        <div className="flex space-x-3 items-start mb-10 text-wrap">
            <Avatar className="w-7 h-7 text-white fill-white">
                <AvatarImage src={imageUrl} className="text-white fill-white" />
                <AvatarFallback className="text-neutral-900 font-semibold">
                    {nameString[0]}
                </AvatarFallback>
            </Avatar>
            <div className="max-w-[calc(100%-40px)]">
                <div className="flex items-center gap-2">
                    <h3 className="font-bold">{nameString}</h3>
                    {/* ✨ Display the formatted timestamp */}
                    <p className="text-xs text-neutral-500">{timestamp}</p>
                </div>
                <div className="flex flex-grow flex-col gap-3 gap-y-5 text-sm text-white/90">
                    <Markdown content={message.content} />
                    {message.isLoading && <BlinkingCursor />}
                </div>
            </div>
        </div>
    );
};