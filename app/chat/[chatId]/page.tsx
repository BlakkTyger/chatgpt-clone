// app/chat/[chatId]/page.tsx
"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/utils/supabase/client";
import { useUser } from "@/hooks/useUser";
import { Chat as ChatType, Message } from "@/types";

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
    const [chat, setChat] = useState<ChatType | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    
    // Pagination state
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
            .order("created_at", { ascending: false }) // Fetch newest first
            .range(from, to);

        if (data) {
            // Prepend older messages to the top of the list
            setMessages(prev => [...data.reverse(), ...prev]);
            // If we fetched fewer messages than we asked for, there are no more
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

    // Initial data load effect
    useEffect(() => {
        if (!user || !chatId) return;

        const fetchInitialData = async () => {
            // Fetch chat metadata
            const { data: chatData, error: chatError } = await supabase
                .from("chats")
                .select("*")
                .eq("id", chatId)
                .single();

            if (chatError || !chatData) {
                toast.error("Chat not found or you don't have access.");
                router.push("/");
                return;
            }
            setChat(chatData);

            // Fetch first page of messages
            await fetchMessages(0);
            setIsLoading(false);
        };

        fetchInitialData();
    }, [chatId, user, router, fetchMessages]);
    
    // Real-time subscription effect
    useEffect(() => {
        if(!chatId) return;
        
        const channel = supabase
            .channel(`chat-${chatId}`)
            .on(
                "postgres_changes",
                { event: "INSERT", schema: "public", table: "messages", filter: `chat_id=eq.${chatId}` },
                (payload) => {
                    // Append new incoming messages to the end
                    setMessages((prevMessages) => [...prevMessages, payload.new as Message]);
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [chatId]);

    if (isLoading) {
        return <div className="w-full h-full flex items-center justify-center bg-neutral-800">Loading chat...</div>;
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
                    <Form chatId={chatId} />
                    <p className="w-full text-center text-xs text-neutral-400 my-2 lg:pr-[300px]">TalkGPT could make errors. Consider checking important information.</p>
                </div>
            </div>
        </div>
    );
};

export default Chat;