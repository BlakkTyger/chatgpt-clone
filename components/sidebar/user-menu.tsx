"use client";
import { useUser } from "@/hooks/useUser";
import { supabase } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { toast } from "sonner";
import { AnonymousToggle } from "@/components/anonymous-toggle";

export const UserMenu = () => {
    const { user } = useUser();
    const router = useRouter();

    const handleLogout = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            toast.error("Logout failed. Please try again.");
        } else {
            router.push('/auth');
        }
    };

    if (!user) {
        return null;
    }

    return (
        <div className="mt-auto border-t border-neutral-800 pt-4 space-y-2">
            <div className="px-2 text-sm text-neutral-400 truncate">
                {user.email}
            </div>
            
            {/* ✨ 2. Add the AnonymousToggle component here */}
            <AnonymousToggle />

            <Button
                onClick={handleLogout}
                className="w-full flex justify-start items-center gap-3 p-2 h-auto text-sm bg-transparent hover:bg-neutral-800 text-neutral-300 hover:text-white"
            >
                <LogOut className="w-4 h-4" />
                Log out
            </Button>
        </div>
    );
};