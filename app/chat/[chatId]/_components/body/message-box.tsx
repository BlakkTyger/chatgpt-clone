// app/chat/[chatId]/_components/body/message-box.tsx

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Message } from "@/types";
import Markdown from "./markdown";

interface MessageBoxProps {
    message: Message;
    userImageUrl?: string;
}

export const MessageBox = ({
    message,
    userImageUrl
}: MessageBoxProps) => {
    const isUser = message.role === "user";
    const nameString = isUser ? "You" : "TalkGPT";
    const imageUrl = isUser ? userImageUrl : "/logo.svg";

    return (
        <div
            className="flex space-x-3 items-start mb-10 text-wrap"
        >
            <Avatar className="w-7 h-7 text-white fill-white">
                <AvatarImage src={imageUrl} className="text-white fill-white" />
                <AvatarFallback className="text-neutral-900 font-semibold">
                    {nameString[0]}
                </AvatarFallback>
            </Avatar>
            <div className="max-w-[calc(100%-40px)]">
                <h3 className="font-bold">{nameString}</h3>
                <div className="flex flex-grow flex-col gap-3 gap-y-5 text-sm">
                    <Markdown content={message.content} />
                </div>
            </div>
        </div>
    );
};