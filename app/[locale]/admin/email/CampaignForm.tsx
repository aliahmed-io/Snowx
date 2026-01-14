"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Send, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { sendCampaign } from "@/actions/newsletter";

interface CampaignFormProps {
    subscriberCount: number;
}

export function CampaignForm({ subscriberCount }: CampaignFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [subject, setSubject] = useState("");
    const [content, setContent] = useState("");

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!subject.trim() || !content.trim()) return;

        setLoading(true);
        try {
            const result = await sendCampaign(subject, content);
            if (result.success) {
                toast.success(result.message);
                setSubject("");
                setContent("");
                router.refresh();
            } else {
                toast.error(result.message);
            }
        } catch {
            toast.error("Failed to send campaign");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Subject Line</label>
                <Input
                    placeholder="Enter a catchy subject..."
                    className="bg-[#1e293b] border-[#020817] text-white focus-visible:ring-blue-600"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    required
                />
            </div>
            <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Content</label>
                <Textarea
                    placeholder="Write your email content here..."
                    rows={10}
                    className="bg-[#1e293b] border-[#020817] text-white focus-visible:ring-blue-600 font-mono text-sm"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                />
            </div>
            <div className="flex justify-between items-center pt-2">
                <p className="text-xs text-slate-500">
                    Targeting: All Subscribers ({subscriberCount})
                </p>
                <Button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    disabled={loading || subscriberCount === 0}
                >
                    {loading ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                        <Send className="w-4 h-4 mr-2" />
                    )}
                    Send Now
                </Button>
            </div>
        </form>
    );
}
