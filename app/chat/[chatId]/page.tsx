// app/chat/[chatId]/page.tsx
"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/utils/supabase/client";
import { useUser } from "@/hooks/useUser";
import { Message } from "@/types";

import { Form } from "./_components/form";
import { Header } from "./_components/header";
import { Body } from "./_components/body";
import { toast } from "sonner";

const MESSAGES_PER_PAGE = 20;

const Chat = () => {
    const router = useRouter();
    const params = useParams();
    const chatId = params.chatId as string;
    
    const { user } = useUser();
    const [messages, setMessages] = useState<Message[]>([]);
    
    const [page, setPage] = useState(0);
    const [hasMoreMessages, setHasMoreMessages] = useState(true);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);

    const fetchMessages = useCallback(async (pageNum: number) => {
        if (!chatId) return;

        const from = pageNum * MESSAGES_PER_PAGE;
        const to = from + MESSAGES_PER_PAGE - 1;

        const { data, error } = await supabase
            .from("messages")
            .select("*")
            .eq("chat_id", chatId)
            .order("created_at", { ascending: false })
            .range(from, to);

        if (data) {
            // ✨ FIX: This now prevents duplicate messages from being added
            setMessages(prev => {
                const existingIds = new Set(prev.map(msg => msg.id));
                const newMessages = data.filter(msg => !existingIds.has(msg.id));
                return [...newMessages.reverse(), ...prev];
            });

            if (data.length < MESSAGES_PER_PAGE) {
                setHasMoreMessages(false);
            }
        }
    }, [chatId]);

    const handleLoadMore = useCallback(() => {
        if (isLoadingMore || !hasMoreMessages) return;
        
        setIsLoadingMore(true);
        const nextPage = page + 1;
        fetchMessages(nextPage).then(() => {
            setPage(nextPage);
            setIsLoadingMore(false);
        });
    }, [isLoadingMore, hasMoreMessages, page, fetchMessages]);

    // This effect handles the initial data load for the chat.
    useEffect(() => {
        if (!user || !chatId) return;

        // Reset state for new chat navigation
        setMessages([]);
        setPage(0);
        setHasMoreMessages(true);
        setIsLoading(true);

        fetchMessages(0).then(() => {
            setIsLoading(false);
        });

    }, [chatId, user, fetchMessages]);
    
    // This effect listens for new messages in real-time.
    useEffect(() => {
        if(!chatId || !user) return;
        
        const channel = supabase
            .channel(`chat-${chatId}`)
            .on(
                "postgres_changes",
                { event: "INSERT", schema: "public", table: "messages", filter: `chat_id=eq.${chatId}` },
                (payload) => {
                    // Check if message is already displayed to prevent duplicates
                    setMessages((prevMessages) => {
                        if (prevMessages.some(msg => msg.id === payload.new.id)) {
                            return prevMessages;
                        }
                        return [...prevMessages, payload.new as Message]
                    });
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [chatId, user]);

    if (isLoading) {
        return <div className="w-full h-full flex items-center justify-center bg-neutral-800 text-white">Loading chat...</div>;
    }

    return (
        <div className="bg-neutral-800 w-full h-full flex flex-col">
            <Header />
            <div className="flex flex-col h-full w-full">
                <Body 
                    messages={messages}
                    onLoadMore={handleLoadMore}
                    hasMoreMessages={hasMoreMessages}
                    isLoadingMore={isLoadingMore}
                />
                <div className="w-full fixed bottom-0">
                    <Form chatId={chatId} onSendMessage={function (content: string): Promise<void> {
                        throw new Error("Function not implemented.");
                    } } />
                    <p className="w-full text-center text-xs text-neutral-400 my-2 lg:pr-[300px]">ChatGPT could make errors. Consider checking important information.</p>
                </div>
            </div>
        </div>
    );
};

export default Chat;