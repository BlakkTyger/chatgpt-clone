"use client";

import { useApiMutation } from "@/hooks/use-api-mutation";
import { ChevronDown, Sparkles, Zap } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useState } from "react";
import { GPTModel } from "@/lib/types";
import { Checkbox } from "@/components/ui/checkbox";
import { useUser } from "@/hooks/useUser";
import { supabase } from "@/utils/supabase/client";
import { toast } from "sonner";

export const SelectModal = () => {
    const { user, loading } = useUser();
    const [openSelect, setOpenSelect] = useState(false);

    const updateUserModel = async (payload: { model: GPTModel }) => {
        const { data, error } = await supabase.auth.updateUser({
            data: { model: payload.model }
        });
        if (error) throw new Error("Failed to update model.");
        return data;
    };

    const { mutate: selectGPT, pending: selectGPTPending } = useApiMutation(updateUserModel);

    if (loading) {
        return <div className="text-sm text-white/50">Loading...</div>;
    }

    if (!user) {
        return <div className="text-sm text-white/50">Could not load user.</div>;
    }

    const currentModel = user.user_metadata?.model || GPTModel.GPT3;
    const gptVersionText = currentModel === GPTModel.GPT3 ? "3.5" : "4";

    const handleClick = (model: GPTModel) => {
        if (selectGPTPending || currentModel === model) {
            setOpenSelect(false);
            return;
        }
        selectGPT({ model }).catch(() => toast.error("Failed to switch model."));
        setOpenSelect(false);
    };

    return (
        <Popover open={openSelect} onOpenChange={setOpenSelect}>
            <PopoverTrigger
                onClick={() => setOpenSelect((prev) => !prev)}
                className="flex space-x-2 font-semibold items-center outline-none"
            >
                <p>ChatGPT</p>
                <p className="text-white/50">{gptVersionText}</p>
                <ChevronDown className="text-white/50 w-5 h-5" />
            </PopoverTrigger>
            <PopoverContent className="flex flex-col border-0 bg-neutral-700 text-white p-3 space-y-4">
                <div
                    onClick={() => handleClick(GPTModel.GPT3)}
                    className="flex items-center text-start cursor-pointer rounded-md justify-start space-x-2 p-2 w-full h-full hover:bg-neutral-600"
                >
                    <Zap className="w-6 h-6" />
                    <div className="w-full">
                        <p className="font-normal">GPT 3.5</p>
                        <p className="text-white/70">Great for everyday tasks.</p>
                    </div>
                    <Checkbox id="terms1" checked={currentModel === GPTModel.GPT3} />
                </div>

                <div
                    onClick={() => handleClick(GPTModel.GPT4)}
                    className="flex items-center text-start cursor-pointer rounded-md justify-start space-x-2 p-2 w-full h-full hover:bg-neutral-600"
                >
                    <Sparkles className="w-6 h-6" />
                    <div className="w-full">
                        <p className="font-normal">GPT-4</p>
                        <p className="text-white/70">Our smartest and best model</p>
                    </div>
                    <Checkbox id="terms2" checked={currentModel === GPTModel.GPT4} />
                </div>
            </PopoverContent>
        </Popover>
    );
};