"use client";

import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { PlusCircle, SquarePen } from "lucide-react";

export const NewChatButton = () => {
  const router = useRouter();
  const params = useParams();

  const isNewChatPage = params.chatId === 'new';

  const onClick = () => {
    router.push('/chat/new');
  }

  return (
    <Button
      className="w-full flex justify-start items-center p-2 space-x-3 rounded-md cursor-pointer bg-inherit hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed"
      onClick={onClick}
      disabled={isNewChatPage}
    >
      <PlusCircle className="w-5 h-5" />
      <p className="font-semibold text-start">New Chat</p>
      <SquarePen className="w-4 h-4 ml-auto" />
    </Button>
  );
};