import { db } from "@/lib/db";
import { Link } from "@/navigation";
import { ArrowLeft, Save, Globe } from "lucide-react";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

interface CMSEditPageProps {
    params: Promise<{
        key: string;
    }>;
}

async function saveContent(formData: FormData) {
    "use server";
    const key = formData.get("key") as string;
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const locale = formData.get("locale") as string || "en";

    await db.contentBlock.upsert({
        where: {
            key_locale: {
                key,
                locale
            }
        },
        update: {
            title,
            content
        },
        create: {
            key,
            title,
            content,
            locale
        }
    });

    revalidatePath("/admin/cms");
    revalidatePath(`/admin/cms/${key}`);
    redirect("/admin/cms");
}

export default async function CMSEditPage({ params }: CMSEditPageProps) {
    const { key } = await params;
    const block = await db.contentBlock.findUnique({
        where: {
            key_locale: {
                key,
                locale: 'en' // Defaulting to EN for now
            }
        }
    });

    return (
        <div className="space-y-8 max-w-4xl mx-auto">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link
                        href="/admin/cms"
                        className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h2 className="text-2xl font-bold text-white tracking-tight">Edit Content</h2>
                        <p className="text-gray-400 text-sm mt-1 font-mono">{key}</p>
                    </div>
                </div>
            </div>

            <form action={saveContent} className="space-y-6">
                <input type="hidden" name="key" value={key} />

                <div className="grid grid-cols-3 gap-6">
                    <div className="col-span-2 space-y-6">
                        <div className="bg-[#0a1628] border border-snow-primary/20 rounded-xl p-6 space-y-4">
                            <div className="grid gap-2">
                                <label className="text-sm font-medium text-gray-400">Page Title</label>
                                <input
                                    name="title"
                                    defaultValue={block?.title || ""}
                                    required
                                    className="bg-snow-primary/10 border border-snow-primary/20 rounded-lg p-2.5 text-white focus:border-snow-accent/50 focus:outline-none"
                                />
                            </div>

                            <div className="grid gap-2">
                                <label className="text-sm font-medium text-gray-400">Content (Markdown supported)</label>
                                <textarea
                                    name="content"
                                    defaultValue={block?.content || ""}
                                    required
                                    rows={20}
                                    className="w-full bg-snow-primary/10 border border-snow-primary/20 rounded-lg p-4 text-white font-mono text-sm focus:border-snow-accent/50 focus:outline-none"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-[#0a1628] border border-snow-primary/20 rounded-xl p-6 space-y-4">
                            <h3 className="font-semibold text-white">Settings</h3>

                            <div className="grid gap-2">
                                <label className="text-sm font-medium text-gray-400">Language</label>
                                <div className="flex items-center gap-2 bg-snow-primary/10 border border-snow-primary/20 rounded-lg p-2.5 text-gray-300">
                                    <Globe className="w-4 h-4" />
                                    <select
                                        name="locale"
                                        className="bg-transparent border-none focus:outline-none w-full appearance-none"
                                        defaultValue="en"
                                    >
                                        <option value="en">English (en)</option>
                                        <option value="ar">Arabic (ar)</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-snow-accent text-[#020817] py-3 rounded-xl font-bold hover:bg-snow-accent/90 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-snow-accent/20"
                        >
                            <Save className="w-4 h-4" />
                            Save Changes
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
