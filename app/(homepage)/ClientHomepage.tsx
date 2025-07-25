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
                const { data: { user } } = await supabase.auth.getUser();
                
                if (!user) {
                    router.push("/auth");
                    return;
                }

                await new Promise(resolve => setTimeout(resolve, 1000));
                
                const chatId = crypto.randomUUID();
                
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