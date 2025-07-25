"use client";

export const Welcome = () => {
  return (
    <div className="bg-neutral-800 h-full flex flex-col items-center justify-center text-center p-4">
      <h1 className="text-4xl font-bold text-white mb-4">Welcome to ChatGPT</h1>
      <p className="text-lg text-neutral-400">
        Select a chat from the sidebar or start a new conversation.
      </p>
    </div>
  );
};