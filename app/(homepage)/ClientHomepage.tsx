// app/(homepage)/ClientHomepage.tsx
"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase/client";

const ClientHomepage = () => {
    const router = useRouter();
    const [isCreating, setIsCreating] = useState(true);

    useEffect(() => {
        const createNewChat = async () => {
            try {
                // Get the current user
                const { data: { user } } = await supabase.auth.getUser();
                
                if (!user) {
                    router.push("/auth");
                    return;
                }

                // Here you would typically create a new chat in your database
                // For now, I'm simulating the chat creation process
                // Replace this with your actual chat creation logic
                
                // Simulate API call delay
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                // Generate a new chat ID (replace with your actual logic)
                const chatId = crypto.randomUUID();
                
                // Navigate to the new chat
                router.push(`/chat/${chatId}`);
            } catch (error) {
                console.error("Error creating chat:", error);
                setIsCreating(false);
            }
        };

        createNewChat();
    }, [router, supabase]);

    return (
        <div className="bg-neutral-800 h-full text-neutral-400 text-3xl text-center px-11 pt-11">
            Creating a new chat
        </div>
    );
};

export default ClientHomepage;