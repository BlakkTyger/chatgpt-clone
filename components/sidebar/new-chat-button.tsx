// components/sidebar/new-chat-button.tsx
"use client";

import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { PlusCircle, SquarePen } from "lucide-react";
import { toast } from "sonner";

export const NewChatButton = () => {
  const router = useRouter();
  const params = useParams();
  const isNewChatPage = params.chatId === 'new';

  const onClick = () => {
        router.push('/chat/new');
      }
    
  return (
    <Button
      className="w-full flex justify-start items-center bg-inherit hover:bg-inherit p-0"
      onClick={onClick}
      disabled={isNewChatPage}
    >
      <PlusCircle className="w-5 h-5" />
      <p className="font-semibold text-start ml-3">New Chat</p>
      <SquarePen className="w-4 h-4 ml-auto" />
    </Button>
  );
};