import { Construction } from "lucide-react";

export function MaintenancePage() {
    return (
        <div className="min-h-screen bg-[#020817] flex flex-col items-center justify-center p-4 text-center">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-12 max-w-md w-full backdrop-blur-sm">
                <div className="w-20 h-20 bg-snow-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Construction className="w-10 h-10 text-snow-accent" />
                </div>
                <h1 className="text-3xl font-bold text-white mb-4">Under Maintenance</h1>
                <p className="text-gray-400 mb-8">
                    We are currently performing scheduled maintenance to improve your experience.
                    Please checking back soon.
                </p>
                <div className="h-1 w-24 bg-snow-accent rounded-full mx-auto" />
            </div>

            <div className="mt-8 flex items-center gap-2 text-white/20 text-sm">
                <span className="font-bold">SNOW X</span>
                <span>•</span>
                <span>System Update</span>
            </div>
        </div>
    );
}
