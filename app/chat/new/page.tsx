"use client";
import { Form } from "../[chatId]/_components/form";
import { Header } from "../[chatId]/_components/header";
import { Body } from "../[chatId]/_components/body";

const NewChatPage = () => {
    return (
        <div className="bg-neutral-800 w-full h-full flex flex-col">
            <Header />
            <div className="flex flex-col h-full w-full">
                <Body 
                    messages={[]}
                    onLoadMore={() => {}}
                    hasMoreMessages={false}
                    isLoadingMore={false}
                />
                <div className="w-full fixed bottom-0">
                    <Form chatId="new" />
                    <p className="w-full text-center text-xs text-neutral-400 my-2 lg:pr-[300px]">ChatGPT could make errors. Consider checking important information.</p>
                </div>
            </div>
        </div>
    );
};

export default NewChatPage;