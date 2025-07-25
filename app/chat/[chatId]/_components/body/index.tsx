"use client";

import { ScrollArea } from "@/components/ui/scorll-area";
import { useEffect, useRef } from "react";
import { MessageBox } from "./message-box";
import { Message } from "@/types";
import { useUser } from "@/hooks/useUser";
import { LoadMore } from "./load-more";

interface BodyProps {
  messages: Message[];
  onLoadMore: () => void;
  hasMoreMessages: boolean;
  isLoadingMore: boolean;
}

export const Body = ({ 
  messages = [], 
  onLoadMore,
  hasMoreMessages,
  isLoadingMore
}: BodyProps) => {
    const { user } = useUser();
    const scrollRef = useRef<HTMLDivElement>(null);

    // Scroll to bottom only when the initial batch of messages loads
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: "auto" });
        }
    }, []);

    return (
        <ScrollArea className="max-h-[calc(100%-150px)] h-full w-full flex-1">
            <div className="px-4 sm:px-12 md:px-52 2xl:px-[430px] relative pt-4">
                {hasMoreMessages && <LoadMore onIntersect={onLoadMore} />}
                {isLoadingMore && <div className="text-center text-neutral-400 text-sm py-4">Loading older messages...</div>}
                {messages.map((message) => (
                    <MessageBox
                        key={message.id}
                        message={message}
                        userImageUrl={user?.user_metadata?.avatar_url}
                    />
                ))}
                <div ref={scrollRef} className="h-1" />
            </div>
        </ScrollArea>
    );
};