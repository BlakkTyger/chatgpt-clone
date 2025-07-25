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
   isLoading?: boolean;
}

export interface UserProfile {
    avatar_url?: string;
    full_name?: string;
}