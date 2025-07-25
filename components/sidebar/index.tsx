import { ChatList } from "./chat-list";
import { NewChatButton } from "./new-chat-button";
import { UserMenu } from "./user-menu";


export const Sidebar = () => {
    return (
        <div className="h-full hidden lg:flex lg:flex-col lg:w-[300px] bg-neutral-950 p-4">
            <NewChatButton />
            <div className="flex-1 min-h-0">
                <ChatList />
            </div>
            <UserMenu />
        </div>
    );
};