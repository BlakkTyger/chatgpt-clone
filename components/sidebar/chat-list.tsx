// components/sidebar/chat-list.tsx
"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/utils/supabase/client";
import { useUser } from "@/hooks/useUser";
import { ChatBox } from "./chat-box";
import { Chat } from "@/types";

export const ChatList = () => {
  const { chatId } = useParams();
  // ✨ Get the loading state from the hook
  const { user, loading } = useUser();
  const [chats, setChats] = useState<Chat[]>([]);

  useEffect(() => {
    // ✨ Wait until the user session is loaded
    if (loading) {
      return;
    }

    if (!user) {
      setChats([]);
      return;
    }

    // Initial fetch for chats
    const fetchChats = async () => {
      const { data, error } = await supabase
        .from("chats")
        .select("id, title, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (data) {
        setChats(data);
      }
    };

    fetchChats();

    // Subscribe to real-time changes
    const channel = supabase
      .channel("realtime-chats")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "chats",
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          fetchChats();
        }
      )
      .subscribe();

    // Cleanup subscription on component unmount
    return () => {
      supabase.removeChannel(channel);
    };
    // ✨ Add loading to the dependency array
  }, [user, loading]);

  // Updated loading and empty states
  if (loading) return <div className="p-2 text-sm text-neutral-400">Loading chats…</div>;
  if (!user) return <div className="p-2 text-sm text-neutral-400">Please sign in.</div>;
  if (chats.length === 0) return <div className="p-2 text-sm text-neutral-400">No chats yet.</div>;

  return (
    <div className="flex flex-col flex-1 overflow-y-auto mt-4 pt-4 border-t border-neutral-800">
      {chats.map((chat) => (
        <ChatBox
          key={chat.id}
          chat={chat}
          selected={chat.id === chatId}
        />
      ))}
    </div>
  );
};