"use client";

import { useActionState } from "react";
import { submitContactForm } from "@/actions/contact";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Send } from "lucide-react";
import { toast } from "sonner";
import { useEffect } from "react";

// Need to verify if Textarea component exists, if not I will use standard textarea or create one.
// For now I will use standard textarea with correct styling to match Input if Textarea is missing.
// Actually I will check if Textarea exists in next step or just use standard HTML textarea with classes.
// Using standard HTML textarea for safety to avoid import errors.

export default function ContactPage() {
    const [state, formAction, isPending] = useActionState(submitContactForm, null);

    useEffect(() => {
        if (state?.success) {
            toast.success(state.success);
            // reset form? native reset happens on action usually but not with state preservation.
            // Ideally we clear the form. 
            const form = document.getElementById("contact-form") as HTMLFormElement;
            if (form) form.reset();
        } else if (state?.error) {
            toast.error(state.error);
        }
    }, [state]);

    return (
        <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <div className="max-w-2xl mx-auto">
                <div className="text-center mb-10">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Contact Us</h1>
                    <p className="text-gray-400 text-lg">
                        Have a question or need assistance? We&apos;re here to help.
                    </p>
                </div>

                <div className="bg-[#0f172a] border border-[#1e293b] rounded-2xl p-6 md:p-8 shadow-xl">
                    <form id="contact-form" action={formAction} className="space-y-6">
                        <div className="grid gap-2">
                            <Label htmlFor="name" className="text-white">Name</Label>
                            <Input
                                id="name"
                                name="name"
                                placeholder="Your Name"
                                required
                                className="bg-[#1e293b] border-[#334155] text-white focus-visible:ring-snow-accent"
                            />
                            {state?.errors?.name && <p className="text-red-400 text-sm">{state.errors.name[0]}</p>}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="email" className="text-white">Email</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="your@email.com"
                                required
                                className="bg-[#1e293b] border-[#334155] text-white focus-visible:ring-snow-accent"
                            />
                            {state?.errors?.email && <p className="text-red-400 text-sm">{state.errors.email[0]}</p>}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="subject" className="text-white">Subject</Label>
                            <Input
                                id="subject"
                                name="subject"
                                placeholder="How can we help?"
                                required
                                className="bg-[#1e293b] border-[#334155] text-white focus-visible:ring-snow-accent"
                            />
                            {state?.errors?.subject && <p className="text-red-400 text-sm">{state.errors.subject[0]}</p>}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="message" className="text-white">Message</Label>
                            <textarea
                                id="message"
                                name="message"
                                rows={5}
                                placeholder="Tell us more about your inquiry..."
                                required
                                className="flex min-h-[80px] w-full rounded-md border border-[#334155] bg-[#1e293b] px-3 py-2 text-sm text-white ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-snow-accent focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            />
                            {state?.errors?.message && <p className="text-red-400 text-sm">{state.errors.message[0]}</p>}
                        </div>

                        <Button
                            type="submit"
                            disabled={isPending}
                            className="w-full bg-snow-accent hover:bg-snow-accent/90 text-[#020817] font-bold"
                        >
                            {isPending ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Sending...
                                </>
                            ) : (
                                <>
                                    <Send className="mr-2 h-4 w-4" />
                                    Send Message
                                </>
                            )}
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
}
