"use client";
import { useApiMutation } from "@/hooks/use-api-mutation";
import { ChevronDown, Sparkles, Zap, Gem } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useState, useEffect } from "react";
import { AIModel } from "@/lib/types";
import { Checkbox } from "@/components/ui/checkbox";
import { useUser } from "@/hooks/useUser";
import { supabase } from "@/utils/supabase/client";
import { toast } from "sonner";
import { useRouter } from "next/navigation"; 

export const SelectModal = () => {
    const { user, loading } = useUser();
    const router = useRouter(); 
    const [openSelect, setOpenSelect] = useState(false);

    useEffect(() => {
        if (user && !user.user_metadata?.model) {
            supabase.auth.updateUser({
                data: { model: AIModel.GeminiFlash }
            });
        }
    }, [user]);

    const updateUserModel = async (payload: { model: AIModel }) => {
        const { data, error } = await supabase.auth.updateUser({
            data: { model: payload.model }
        });

        if (error) throw new Error("Failed to update model.");
        
        router.refresh();

        return data;
    };

    const { mutate: selectModel, pending: selectModelPending } = useApiMutation(updateUserModel);

    if (loading) return <div className="text-sm text-white/50">Loading...</div>;
    if (!user) return <div className="text-sm text-white/50">Could not load user.</div>;

    const currentModel = user.user_metadata?.model || AIModel.GeminiFlash;
    
    let modelVersionText;
    switch (currentModel) {
        case AIModel.GPT4:
            modelVersionText = "gpt-4.1-nano";
            break;
        case AIModel.GeminiFlash:
            modelVersionText = "gemini-2.5-flash";
            break;
        default:
            modelVersionText = "gemini-2.5-flash";
    }

    const handleClick = (model: AIModel) => {
        if (selectModelPending || currentModel === model) {
            setOpenSelect(false);
            return;
        }
        selectModel({ model }).catch(() => toast.error("Failed to switch model."));
        setOpenSelect(false);
    };

    return (
        <Popover open={openSelect} onOpenChange={setOpenSelect}>
            <PopoverTrigger
                onClick={() => setOpenSelect((prev) => !prev)}
                className="flex space-x-2 font-semibold items-center outline-none"
            >
                <p>Model</p>
                <p className="text-white/50">{modelVersionText}</p>
                <ChevronDown className="text-white/50 w-5 h-5" />
            </PopoverTrigger>
            <PopoverContent className="flex flex-col border-0 bg-neutral-700 text-white p-3 space-y-1">
                <div onClick={() => handleClick(AIModel.GeminiFlash)} className="flex items-center text-start cursor-pointer rounded-md justify-start space-x-2 p-2 w-full h-full hover:bg-neutral-600">
                    <Gem className="w-6 h-6 text-blue-400" />
                    <div className="w-full">
                        <p className="font-normal">Gemini 2.5 Flash</p>
                        <p className="text-white/70 text-xs">Google's Latest lightweight and affordable model</p>
                    </div>
                    <Checkbox checked={currentModel === AIModel.GeminiFlash} />
                </div>

                <div onClick={() => handleClick(AIModel.GPT4)} className="flex items-center text-start cursor-pointer rounded-md justify-start space-x-2 p-2 w-full h-full hover:bg-neutral-600">
                    <Sparkles className="w-6 h-6" />
                    <div className="w-full">
                        <p className="font-normal">GPT-4.1-nano</p>
                        <p className="text-white/70 text-xs">OpenAI's latest affordable model</p>
                    </div>
                    <Checkbox checked={currentModel === AIModel.GPT4} />
                </div>
            </PopoverContent>
        </Popover>
    );
};