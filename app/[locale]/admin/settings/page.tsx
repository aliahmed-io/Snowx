import { db } from "@/lib/db";
import { Link } from "@/navigation";
import { Save, Settings, Shield, Server } from "lucide-react";
import { revalidatePath } from "next/cache";

async function saveSettings(formData: FormData) {
    "use server";
    // Iterate over known settings keys
    const settings = ['site_name', 'support_email', 'maintenance_mode'];

    for (const key of settings) {
        const value = formData.get(key) as string;
        await db.systemSetting.upsert({
            where: { key },
            update: { value },
            create: { key, value }
        });
    }

    revalidatePath("/admin/settings");
}

export default async function SettingsPage() {
    const settings = await db.systemSetting.findMany();
    const getSetting = (key: string) => settings.find(s => s.key === key)?.value || "";

    return (
        <div className="space-y-8 max-w-4xl mx-auto">
            <div>
                <h2 className="text-3xl font-bold text-white tracking-tight">Settings</h2>
                <p className="text-gray-400 mt-2">Global configuration and system preferences</p>
            </div>

            <form action={saveSettings} className="grid gap-8">
                {/* General Settings */}
                <div className="bg-[#0a1628] border border-snow-primary/20 rounded-xl overflow-hidden">
                    <div className="p-6 border-b border-snow-primary/20 bg-white/5 flex items-center gap-3">
                        <Settings className="w-5 h-5 text-snow-accent" />
                        <h3 className="font-semibold text-white">General Configuration</h3>
                    </div>
                    <div className="p-6 space-y-6">
                        <div className="grid gap-2">
                            <label className="text-sm font-medium text-gray-400">Site Name</label>
                            <input
                                name="site_name"
                                defaultValue={getSetting('site_name') || "Snow X"}
                                className="bg-snow-primary/10 border border-snow-primary/20 rounded-lg p-3 text-white focus:border-snow-accent/50 focus:outline-none"
                            />
                        </div>

                        <div className="grid gap-2">
                            <label className="text-sm font-medium text-gray-400">Support Email</label>
                            <input
                                name="support_email"
                                type="email"
                                defaultValue={getSetting('support_email') || "support@snowx.com"}
                                className="bg-snow-primary/10 border border-snow-primary/20 rounded-lg p-3 text-white focus:border-snow-accent/50 focus:outline-none"
                            />
                        </div>
                    </div>
                </div>

                {/* System Controls */}
                <div className="bg-[#0a1628] border border-snow-primary/20 rounded-xl overflow-hidden">
                    <div className="p-6 border-b border-snow-primary/20 bg-white/5 flex items-center gap-3">
                        <Server className="w-5 h-5 text-red-400" />
                        <h3 className="font-semibold text-white">System Controls</h3>
                    </div>
                    <div className="p-6 space-y-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h4 className="text-white font-medium">Maintenance Mode</h4>
                                <p className="text-sm text-gray-500">Disable store access for customers</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="maintenance_mode"
                                    value="true"
                                    defaultChecked={getSetting('maintenance_mode') === 'true'}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-snow-accent"></div>
                            </label>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end">
                    <button
                        type="submit"
                        className="bg-snow-accent text-[#020817] px-6 py-3 rounded-xl font-bold hover:bg-snow-accent/90 transition-colors flex items-center gap-2 shadow-lg shadow-snow-accent/20"
                    >
                        <Save className="w-4 h-4" />
                        Save Changes
                    </button>
                </div>
            </form>
        </div>
    );
}
