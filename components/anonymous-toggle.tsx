"use client";

import { Ghost } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";

export const AnonymousToggle = () => {
    const router = useRouter();

    return (
        <Button 
            onClick={() => router.push('/anonymous-chat')}
            variant="outline"
            // ✨ FIX: Added text, border, and hover styles for visibility on a dark background
            className="flex items-center gap-2 text-neutral-300 border-neutral-700 hover:bg-neutral-800 hover:text-white"
        >
            <Ghost className="w-4 h-4" />
            Anonymous Chat
        </Button>
    );
};