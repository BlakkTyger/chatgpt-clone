// components/sidebar/chat-box.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { ArrowDownToLine, Pencil, Trash2 } from "lucide-react";
import { supabase } from "@/utils/supabase/client";
import { toast } from "sonner";
import { Chat } from "@/types";

interface ChatBoxProps {
  chat: Chat; // Use consistent Chat type
  selected: boolean;
}

export const ChatBox = ({ chat, selected }: ChatBoxProps) => {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(chat.title);

  const handleClick = () => {
    if (!selected) {
      router.push(`/chat/${chat.id}`);
    }
  };

  const handleRename = async () => {
    if (title.trim() === "" || title === chat.title) {
        setIsEditing(false);
        return;
    }
    
    const { error } = await supabase
      .from("chats")
      .update({ title: title.trim() })
      .eq("id", chat.id);

    if (error) {
      toast.error("Failed to rename chat.");
    }
    setIsEditing(false);
  };

  const handleDelete = async () => {
    const { error } = await supabase
      .from("chats")
      .delete()
      .eq("id", chat.id);

    if (error) {
      toast.error("Failed to delete chat.");
    } else {
      toast.success("Chat deleted.");
      // The real-time subscription will handle removing it from the list.
      if (selected) {
         router.push("/"); // Go home if the active chat was deleted
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleRename();
    }
  };

  return (
    <div
      className={cn(
        "group relative flex w-full p-2 rounded-md hover:bg-neutral-900 cursor-pointer text-white text-sm items-center",
        selected && "bg-neutral-800"
      )}
      onClick={handleClick}
    >
      {isEditing ? (
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={handleRename}
          onKeyDown={handleKeyDown}
          autoFocus
          className="outline-none bg-transparent w-full"
        />
      ) : (
        <div className="truncate flex-1">{chat.title}</div>
      )}

      {!isEditing && (
         <div
            className={cn(
              "absolute top-1/2 -translate-y-1/2 right-2 flex z-10 bg-gradient-to-r from-transparent from-0% to-neutral-900 to-30% group-hover:to-neutral-900 space-x-2 pl-6 py-1",
              selected && "to-neutral-800 group-hover:to-neutral-800"
            )}
          >
            <button onClick={(e) => { e.stopPropagation(); setIsEditing(true); }}>
              <Pencil className="w-4 h-4" />
            </button>
            <button onClick={(e) => { e.stopPropagation(); handleDelete(); }}>
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
      )}
    </div>
  );
};