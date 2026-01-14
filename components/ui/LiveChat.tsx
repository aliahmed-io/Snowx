"use client";

import { useState, useEffect, useRef } from "react";

type Message = {
    id: string;
    text: string;
    sender: "user" | "agent" | "system";
    timestamp: Date;
};

type ConnectionStatus = "connecting" | "connected" | "waiting" | "timeout" | "offline";

export function LiveChat() {
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState<Message[]>([]);
    const [status, setStatus] = useState<ConnectionStatus>("connecting");
    const [isTyping, setIsTyping] = useState(false);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);


    // Auto-scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // 2-minute timeout after user sends a message
    const startTimeout = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        setStatus("waiting");

        timeoutRef.current = setTimeout(() => {
            setStatus("timeout");
            setMessages(prev => [
                ...prev,
                {
                    id: `timeout-${Date.now()}`,
                    text: "We apologize for the delay. All of our support agents are currently assisting other customers. Your inquiry is important to us, and someone will respond as soon as possible. Thank you for your patience.",
                    sender: "system",
                    timestamp: new Date()
                }
            ]);
        }, 120000); // 2 minutes
    };

    const handleSendMessage = () => {
        if (!message.trim()) return;

        const newMessage: Message = {
            id: `user-${Date.now()}`,
            text: message.trim(),
            sender: "user",
            timestamp: new Date()
        };

        setMessages(prev => [...prev, newMessage]);
        setMessage("");
        startTimeout();

        // Simulate typing indicator
        setIsTyping(true);
        setTimeout(() => setIsTyping(false), 2000);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const getStatusText = () => {
        switch (status) {
            case "connecting":
                return "Connecting...";
            case "connected":
                return "We typically reply in a few minutes";
            case "waiting":
                return "Connecting you to an agent...";
            case "timeout":
                return "All agents are busy";
            case "offline":
                return "Currently offline";
            default:
                return "";
        }
    };

    const getStatusColor = () => {
        switch (status) {
            case "connected":
                return "bg-green-500";
            case "waiting":
                return "bg-yellow-500";
            case "timeout":
                return "bg-orange-500";
            case "offline":
                return "bg-red-500";
            default:
                return "bg-gray-500";
        }
    };

    return (
        <>
            {/* Chat Window */}
            {isOpen && (
                <div className="fixed bottom-24 right-6 w-96 bg-[#0a1628] rounded-2xl shadow-2xl overflow-hidden z-50 border border-snow-primary/30">
                    {/* Header */}
                    <div className="bg-linear-to-r from-snow-accent to-snow-accent/80 p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-white font-semibold">SnowX Support</h3>
                                <div className="flex items-center gap-1.5">
                                    <span className={`w-2 h-2 rounded-full ${getStatusColor()}`}></span>
                                    <p className="text-white/70 text-xs">{getStatusText()}</p>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="text-white/70 hover:text-white transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Chat Body */}
                    <div className="h-80 p-4 overflow-y-auto bg-[#050d17]">
                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`flex gap-3 mb-4 ${msg.sender === "user" ? "flex-row-reverse" : ""}`}
                            >
                                {msg.sender !== "user" && (
                                    <div className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center ${msg.sender === "system" ? "bg-orange-500" : "bg-snow-accent"
                                        }`}>
                                        {msg.sender === "system" ? (
                                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                            </svg>
                                        ) : (
                                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                        )}
                                    </div>
                                )}
                                <div
                                    className={`p-3 rounded-lg max-w-[75%] ${msg.sender === "user"
                                        ? "bg-snow-accent text-[#020817] rounded-tr-none"
                                        : msg.sender === "system"
                                            ? "bg-orange-500/10 border border-orange-500/20 text-orange-200 rounded-tl-none"
                                            : "bg-[#1e293b] text-white rounded-tl-none"
                                        }`}
                                >
                                    <p className="text-sm leading-relaxed">{msg.text}</p>
                                    <p className={`text-[10px] mt-1 ${msg.sender === "user" ? "text-[#020817]/60" : "text-gray-500"
                                        }`}>
                                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>
                            </div>
                        ))}

                        {/* Typing Indicator */}
                        {isTyping && (
                            <div className="flex gap-3 mb-4">
                                <div className="w-8 h-8 rounded-full bg-snow-accent shrink-0 flex items-center justify-center">
                                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                                <div className="bg-[#1e293b] p-3 rounded-lg rounded-tl-none">
                                    <div className="flex gap-1">
                                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
                                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
                                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Status Message for timeout */}
                    {status === "timeout" && (
                        <div className="px-4 py-2 bg-orange-500/10 border-t border-orange-500/20">
                            <p className="text-xs text-orange-300 text-center">
                                Average wait time: 5-10 minutes. You can also email us at support@snowx.com
                            </p>
                        </div>
                    )}

                    {/* Input */}
                    <div className="p-4 border-t border-snow-primary/20 bg-[#0a1628]">
                        <div className="flex items-center gap-2">
                            <input
                                type="text"
                                placeholder="Type your message..."
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                onKeyDown={handleKeyPress}
                                className="flex-1 px-4 py-2.5 rounded-full bg-[#1e293b] border border-snow-primary/20 focus:outline-none focus:border-snow-accent text-sm text-white placeholder:text-gray-500"
                            />
                            <button
                                onClick={handleSendMessage}
                                disabled={!message.trim()}
                                className="w-10 h-10 rounded-full bg-snow-accent text-[#020817] flex items-center justify-center hover:bg-snow-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Toggle Button */}
            <button
                onClick={() => {
                    if (!isOpen && messages.length === 0) {
                        setMessages([
                            {
                                id: "welcome",
                                text: "Welcome to SnowX Support! How can we assist you today?",
                                sender: "agent",
                                timestamp: new Date()
                            }
                        ]);
                        setStatus("connected");
                    }
                    setIsOpen(!isOpen);
                }}
                className={`fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg z-50 flex items-center justify-center transition-all duration-300 ${isOpen
                    ? "bg-[#1e293b] text-white border border-snow-primary/30"
                    : "bg-snow-accent text-[#020817] hover:bg-snow-accent/90"
                    }`}
            >
                {isOpen ? (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                ) : (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                )}
            </button>
        </>
    );
}
