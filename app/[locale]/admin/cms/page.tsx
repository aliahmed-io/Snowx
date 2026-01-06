import { db } from "@/lib/db";
import { Link } from "@/navigation";
import {
    FileText,
    Edit,
    Globe,
    Plus
} from "lucide-react";
import { cn } from "@/lib/utils";

const DEFAULT_BLOCKS = [
    { key: "landing-hero", title: "Landing Page Hero" },
    { key: "terms", title: "Terms of Service" },
    { key: "privacy", title: "Privacy Policy" },
    { key: "faq", title: "Frequently Asked Questions" },
    { key: "about", title: "About Us" },
];

export default async function CMSPage() {
    const blocks = await db.contentBlock.findMany({
        orderBy: { key: 'asc' }
    });

    // Merge default blocks with existing db blocks to show everything available
    const allBlocks = DEFAULT_BLOCKS.map(def => {
        const existing = blocks.find(b => b.key === def.key);
        return {
            ...def,
            ...existing,
            exists: !!existing
        };
    });

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold text-white tracking-tight">Content Management</h2>
                    <p className="text-gray-400 mt-2">Manage website content and legal pages</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {allBlocks.map((block) => (
                    <div key={block.key} className="bg-[#0a1628] border border-snow-primary/20 rounded-xl p-6 hover:bg-white/5 transition-colors group">
                        <div className="flex items-start justify-between mb-4">
                            <div className="w-12 h-12 rounded-lg bg-snow-accent/10 flex items-center justify-center text-snow-accent">
                                <FileText className="w-6 h-6" />
                            </div>
                            <span className={cn(
                                "px-2 py-1 rounded-full text-xs font-medium",
                                block.exists ? "bg-green-500/10 text-green-400" : "bg-gray-500/10 text-gray-400"
                            )}>
                                {block.exists ? "Published" : "Draft"}
                            </span>
                        </div>

                        <h3 className="text-lg font-semibold text-white mb-2">{block.title}</h3>
                        <p className="text-sm text-gray-500 font-mono mb-6">{block.key}</p>

                        <div className="flex items-center justify-between pt-4 border-t border-snow-primary/10">
                            <div className="flex items-center gap-2 text-xs text-gray-400">
                                <Globe className="w-3.5 h-3.5" />
                                <span>{block.locale || 'en'}</span>
                            </div>

                            <Link
                                href={`/admin/cms/${block.key}`}
                                className="flex items-center gap-2 text-sm font-medium text-snow-accent hover:text-white transition-colors"
                            >
                                <Edit className="w-4 h-4" />
                                Edit Content
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
