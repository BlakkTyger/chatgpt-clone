// hooks/use-profile.ts
"use client";

import { useEffect, useState } from "react";
import { useUser } from "./useUser"; // Your existing user hook
import { supabase } from "@/utils/supabase/client";
import { Profile } from "@/lib/types";

export const useProfile = () => {
    const { user } = useUser();
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            setLoading(false);
            return;
        }

        const fetchProfile = async () => {
            const { data, error } = await supabase
                .from("profiles")
                .select("*")
                .eq("id", user.id)
                .single();

            if (data) {
                setProfile(data);
            }
            setLoading(false);
        };

        fetchProfile();
    }, [user]);

    return { profile, loading };
};