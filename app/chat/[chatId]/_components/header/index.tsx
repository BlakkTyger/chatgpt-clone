import { AnonymousToggle } from "@/components/anonymous-toggle";
import { SelectModal } from "./select-modal";

export const Header = () => {
    return (
        <div className="flex h-[100px] justify-between items-center p-5">
            <SelectModal />
            
        </div>
    );
};