"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Check, Pencil, Trash2 } from "lucide-react";
import { supabase } from "@/utils/supabase/client";
import { toast } from "sonner";
import { Chat } from "@/types";

interface ChatBoxProps {
  chat: Chat;
  selected: boolean;
}

export const ChatBox = ({ chat, selected }: ChatBoxProps) => {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(chat.title);

  const handleClick = () => {
    if (!isEditing && !selected) {
      router.push(`/chat/${chat.id}`);
    }
  };

  const handleRename = async () => {
    if (title.trim() === "" || title === chat.title) {
        setIsEditing(false);
        return;
    }
    
    setIsEditing(false);
    const { error } = await supabase
      .from("chats")
      .update({ title: title.trim() })
      .eq("id", chat.id);

    if (error) toast.error("Failed to rename chat.");
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
      if (selected) router.push("/");
    }
  };

  return (
    <div
      onClick={handleClick}
      className={cn(
        "group relative flex w-full p-2 rounded-md hover:bg-neutral-800 cursor-pointer text-white text-sm items-center",
        selected && "bg-neutral-800"
      )}
    >
      {isEditing ? (
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={handleRename}
          onKeyDown={(e) => { if (e.key === "Enter") handleRename(); }}
          autoFocus
          className="outline-none bg-transparent w-full"
        />
      ) : (
        <div className="truncate flex-1">{chat.title}</div>
      )}

      <div className={cn(
        "absolute top-1/2 -translate-y-1/2 right-2 z-10 flex items-center space-x-2 transition-opacity",
        isEditing ? "opacity-100" : "opacity-0 group-hover:opacity-100"
      )}>
        {isEditing ? (
            <button onClick={handleRename} className="p-1 hover:bg-neutral-700 rounded-md"><Check className="w-4 h-4" /></button>
        ) : (
            <>
                <button onClick={() => setIsEditing(true)} className="p-1 hover:bg-neutral-700 rounded-md"><Pencil className="w-4 h-4" /></button>
                <button onClick={handleDelete} className="p-1 hover:bg-neutral-700 rounded-md"><Trash2 className="w-4 h-4" /></button>
            </>
        )}
      </div>
    </div>
  );
};