"use client";

import { useState } from "react";

export function LiveChat() {
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState("");

    return (
        <>
            {/* Chat Window */}
            {isOpen && (
                <div className="fixed bottom-24 right-6 w-80 bg-white rounded-2xl shadow-2xl overflow-hidden z-50 border border-snow-gray-light">
                    {/* Header */}
                    <div className="bg-snow-accent p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-white font-semibold">Live Chat</h3>
                                <p className="text-white/70 text-xs">We typically reply in a few minutes</p>
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
                    <div className="h-64 p-4 overflow-y-auto bg-snow-gray-light">
                        {/* Welcome Message */}
                        <div className="flex gap-3 mb-4">
                            <div className="w-8 h-8 rounded-full bg-snow-accent shrink-0 flex items-center justify-center">
                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </div>
                            <div className="bg-white p-3 rounded-lg rounded-tl-none shadow-sm max-w-[80%]">
                                <p className="text-snow-primary text-sm">
                                    Hi, What sorties button the most amazing of one able to you
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Input */}
                    <div className="p-4 border-t border-snow-gray-light">
                        <div className="flex items-center gap-2">
                            <input
                                type="text"
                                placeholder="Type a message..."
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                className="flex-1 px-4 py-2 rounded-full border border-snow-gray-light focus:outline-none focus:border-snow-accent text-sm"
                            />
                            <button className="w-10 h-10 rounded-full bg-snow-accent text-white flex items-center justify-center hover:bg-snow-accent-light transition-colors">
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
                onClick={() => setIsOpen(!isOpen)}
                className={`fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg z-50 flex items-center justify-center transition-all duration-300 ${isOpen
                    ? "bg-snow-gray-light text-snow-primary"
                    : "bg-snow-accent text-white hover:bg-snow-accent-light"
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
