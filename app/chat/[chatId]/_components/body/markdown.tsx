"use client";
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { toast } from 'sonner';
import copy from "copy-to-clipboard";
import { Check, Clipboard } from 'lucide-react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { gruvboxDark } from 'react-syntax-highlighter/dist/cjs/styles/hljs';

interface IProps {
    content: string;
}

export default function Markdown({ content }: IProps) {
    const [isCopied, setIsCopied] = useState(false);

    // ✨ This function now checks for success before giving feedback.
    const handleCopy = (text: string) => {
        const success = copy(text);

        if (success) {
            toast.success("Copied to clipboard");
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        } else {
            toast.error("Failed to copy to clipboard");
        }
    };

    return (
        <div className="prose prose-invert prose-p:text-white/90 prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline">
            <ReactMarkdown
                components={{
                    code({ node, className, children, ...props }) {
                        const match = /language-(\w+)/.exec(className || '');
                        const codeString = String(children).replace(/\n$/, '');

                        return match ? (
                            <div className="relative">
                                <div className='flex items-center w-full justify-end bg-neutral-900 text-xs p-2 rounded-t-md'>
                                    <button onClick={() => handleCopy(codeString)} className="flex items-center gap-1">
                                        {isCopied ? <Check className='text-green-500 w-4 h-4' /> : <Clipboard className='text-white/30 w-4 h-4' />}
                                        {isCopied ? <span className="text-green-500">Copied!</span> : <span className="text-white/30">Copy code</span>}
                                    </button>
                                </div>
                                <SyntaxHighlighter
                                    language={match[1]}
                                    style={gruvboxDark}
                                    customStyle={{ margin: 0, borderRadius: '0 0 0.375rem 0.375rem', padding: '1rem' }}
                                >
                                    {codeString}
                                </SyntaxHighlighter>
                            </div>
                        ) : (
                            <code className="bg-neutral-700 text-white/90 rounded-md px-1.5 py-0.5" {...props}>
                                {children}
                            </code>
                        );
                    },
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
    );
}