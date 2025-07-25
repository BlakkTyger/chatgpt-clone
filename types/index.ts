export interface Chat {
    id: string;
    user_id?: string;
    created_at: string;
    title: string;
}

export interface Message {
    id: string;
    chat_id: string;
    user_id: string;
    role: "user" | "assistant";
    content: string;
    created_at: string;
   isLoading?: boolean; // ✨ Add this optional flag
}

// You'll likely have a user object from Supabase auth
export interface UserProfile {
    // Add any profile fields you have, e.g., from a 'profiles' table
    avatar_url?: string;
    full_name?: string;
}