"use client";

import { useActionState } from "react";
import { submitContactForm } from "@/actions/contact";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Send } from "lucide-react";
import { toast } from "sonner";
import { useEffect } from "react";
import { useTranslations } from "next-intl";

export default function ContactPage() {
    const t = useTranslations("Contact");
    const [state, formAction, isPending] = useActionState(submitContactForm, null);

    useEffect(() => {
        if (state?.success) {
            toast.success(t("successMessage"));
            const form = document.getElementById("contact-form") as HTMLFormElement;
            if (form) form.reset();
        } else if (state?.error) {
            toast.error(t("errorMessage"));
        }
    }, [state, t]);

    return (
        <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <div className="max-w-2xl mx-auto">
                <div className="text-center mb-10">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{t("title")}</h1>
                    <p className="text-gray-400 text-lg">
                        {t("subtitle")}
                    </p>
                </div>

                <div className="bg-[#0f172a] border border-[#1e293b] rounded-2xl p-6 md:p-8 shadow-xl">
                    <form id="contact-form" action={formAction} className="space-y-6">
                        <div className="grid gap-2">
                            <Label htmlFor="name" className="text-white">{t("name")}</Label>
                            <Input
                                id="name"
                                name="name"
                                placeholder={t("name")}
                                required
                                className="bg-[#1e293b] border-[#334155] text-white focus-visible:ring-snow-accent"
                            />
                            {state?.errors?.name && <p className="text-red-400 text-sm">{state.errors.name[0]}</p>}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="email" className="text-white">{t("email")}</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder={t("email")}
                                required
                                className="bg-[#1e293b] border-[#334155] text-white focus-visible:ring-snow-accent"
                            />
                            {state?.errors?.email && <p className="text-red-400 text-sm">{state.errors.email[0]}</p>}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="subject" className="text-white">{t("subject")}</Label>
                            <Input
                                id="subject"
                                name="subject"
                                placeholder={t("subject")}
                                required
                                className="bg-[#1e293b] border-[#334155] text-white focus-visible:ring-snow-accent"
                            />
                            {state?.errors?.subject && <p className="text-red-400 text-sm">{state.errors.subject[0]}</p>}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="message" className="text-white">{t("message")}</Label>
                            <textarea
                                id="message"
                                name="message"
                                rows={5}
                                placeholder={t("message")}
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
                                    {t("sending")}
                                </>
                            ) : (
                                <>
                                    <Send className="mr-2 h-4 w-4" />
                                    {t("send")}
                                </>
                            )}
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
}
