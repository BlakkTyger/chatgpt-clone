// app/anonymous-chat/layout.tsx
export default function AnonymousChatLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <main className="h-full text-white">
            {children}
        </main>
    );
}