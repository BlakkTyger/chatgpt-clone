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
            className="flex items-center gap-2"
        >
            <Ghost className="w-4 h-4" />
            Anonymous Chat
        </Button>
    );
};