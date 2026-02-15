"use client"
import { MoveLeft, Send, X } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils';
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupText, InputGroupTextarea } from '@/components/ui/input-group';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { UseAiStore } from './state/use-store-ai';
import { Avatar, AvatarImage } from '@/components/ui/avatar';

function Home() {
    const { generateResponse, isGenerating, messages } = UseAiStore();
    const messageRef = useRef<HTMLDivElement>(null);
    const [prompt, setPrompt] = useState<string>("");

    const handleSend = () => {
        if (!prompt.trim()) return;

        setPrompt("")
        generateResponse(prompt)
    }

    const handleKeyEnter = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault()
        }

        if (prompt.trim() && e.key === 'Enter' && !e.shiftKey) {
            setPrompt("")
            e.preventDefault()
            generateResponse(prompt)
        }
    };

    useEffect(() => {
        if (messageRef.current) {
            messageRef.current.scrollIntoView({ behavior: "smooth" })
        }
    });

    return (
        <div className='fixed inset-0'>
            <div className='flex flex-col h-full'>
                <div className='flex items-center justify-between px-4 py-2 border-b-2'>
                    <div className='flex flex-row items-center gap-4'>
                        <button>
                            <Link href="/">
                                <MoveLeft />
                            </Link>
                        </button>
                        
                        <Avatar className='w-12 h-12'>
                            <AvatarImage className='object-cover' src="https://github.com/shadcn.png" />
                        </Avatar>
                        <div className='flex flex-col gap-1'>
                            <span className='font-bold'>Heaven Dave</span>
                            <div className='flex flex-row items-center gap-1'>
                                <div className='w-2 h-2 bg-green-500 rounded-full'></div>
                                <span className='text-xs'>Active Now</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='flex-1 overflow-y-auto space-y-4 p-2 scrollable-div'>
                    <div className='flex flex-col items-start gap-2'>
                        <div className='bg-black dark:bg-white rounded-lg p-4 w-fit max-w-60'>
                            <span className='text-white dark:text-black text-sm'>Hi there! 👋 I’m here to help with Full-Stack Development. Got a question about frontend, backend, databases, or deploying your project? Ask me anything!</span>
                        </div>
                    </div>

                    {messages.map((msg, index) => (
                        <div key={index}
                            className={cn('flex flex-col gap-2', msg.role === "user"
                                ? "items-end"
                                : "items-start")}>
                            <div className={cn("p-4 rounded-md max-w-100",
                                msg.role === "user"
                                    ? "bg-blue-600 text-white"
                                    : "bg-black dark:bg-white text-white dark:text-black")}>
                                <span>
                                    {msg.content}
                                </span>
                            </div>
                        </div>
                    ))}

                    <div className='flex flex-col items-start'>
                        <div className={cn(!isGenerating && 'hidden')}>
                            <div className='bg-black dark:bg-white rounded-lg p-4 w-fit max-w-60'>
                                <div className='bg-black dark:bg-white flex flex-row gap-1'>
                                    <div className='w-1 h-1 bg-white dark:bg-black animate-bounce rounded-full'></div>
                                    <div className='w-1 h-1 bg-white dark:bg-black animate-bounce delay-150 rounded-full'></div>
                                    <div className='w-1 h-1 bg-white dark:bg-black animate-bounce delay-300 rounded-full'></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div ref={messageRef}></div>
                </div>

                <InputGroup className='rounded-t-none'>
                    <InputGroupTextarea
                        id="block-end-textarea"
                        placeholder="Aa"
                        onChange={(e) => setPrompt(e.target.value)}
                        value={prompt}
                        onKeyDown={handleKeyEnter}
                        maxLength={300}
                    />
                    <InputGroupAddon align="block-end">
                        <InputGroupText>{prompt.length}/300</InputGroupText>
                        <InputGroupButton variant="default" size="sm"
                            className="ml-auto cursor-pointer"
                            onClick={handleSend}
                            disabled={isGenerating || !prompt.trim()}>
                            <Send />
                        </InputGroupButton>
                    </InputGroupAddon>
                </InputGroup>
            </div >
        </div >
    )
}

export default Home