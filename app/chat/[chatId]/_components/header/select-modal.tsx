// chat/[chatid]/_components/header/select-modal.tsx
"use client";

import { useApiMutation } from "@/hooks/use-api-mutation";
import { ChevronDown, Sparkles, Zap, Gem } from "lucide-react"; // ✨ Added Gem icon
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useState, useEffect } from "react";
import { AIModel } from "@/lib/types"; // ✨ Use renamed AIModel
import { Checkbox } from "@/components/ui/checkbox";
import { useUser } from "@/hooks/useUser";
import { supabase } from "@/utils/supabase/client";
import { toast } from "sonner";

export const SelectModal = () => {
    const { user, loading } = useUser();
    const [openSelect, setOpenSelect] = useState(false);

    // ... (useEffect for setting default model remains the same)

    const updateUserModel = async (payload: { model: AIModel }) => {
        // ... (this function remains the same)
    };

    const { mutate: selectModel, pending: selectModelPending } = useApiMutation(updateUserModel);

    if (loading) return <div className="text-sm text-white/50">Loading...</div>;
    if (!user) return <div className="text-sm text-white/50">Could not load user.</div>;

    const currentModel = user.user_metadata?.model || AIModel.GeminiFlash;
    
    // ✨ Updated text display logic
    let modelVersionText;
    switch (currentModel) {
        case AIModel.GPT3:
            modelVersionText = "3.5";
            break;
        case AIModel.GPT4:
            modelVersionText = "4";
            break;
        case AIModel.GeminiFlash:
            modelVersionText = "Gemini";
            break;
        default:
            modelVersionText = "Gemini";
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
                {/* ✨ Gemini 1.5 Flash Option */}
                <div onClick={() => handleClick(AIModel.GeminiFlash)} className="flex items-center text-start cursor-pointer rounded-md justify-start space-x-2 p-2 w-full h-full hover:bg-neutral-600">
                    <Gem className="w-6 h-6 text-blue-400" />
                    <div className="w-full">
                        <p className="font-normal">Gemini 1.5 Flash</p>
                        <p className="text-white/70 text-xs">Fast and efficient for most tasks.</p>
                    </div>
                    <Checkbox checked={currentModel === AIModel.GeminiFlash} />
                </div>

                {/* GPT 3.5 Option */}
                <div onClick={() => handleClick(AIModel.GPT3)} className="flex items-center text-start cursor-pointer rounded-md justify-start space-x-2 p-2 w-full h-full hover:bg-neutral-600">
                    <Zap className="w-6 h-6" />
                    <div className="w-full">
                        <p className="font-normal">GPT 3.5</p>
                        <p className="text-white/70 text-xs">Great for everyday tasks.</p>
                    </div>
                    <Checkbox checked={currentModel === AIModel.GPT3} />
                </div>

                {/* GPT 4 Option */}
                <div onClick={() => handleClick(AIModel.GPT4)} className="flex items-center text-start cursor-pointer rounded-md justify-start space-x-2 p-2 w-full h-full hover:bg-neutral-600">
                    <Sparkles className="w-6 h-6" />
                    <div className="w-full">
                        <p className="font-normal">GPT-4</p>
                        <p className="text-white/70 text-xs">Our smartest and best model</p>
                    </div>
                    <Checkbox checked={currentModel === AIModel.GPT4} />
                </div>
            </PopoverContent>
        </Popover>
    );
};