export default function Loading() {
    return (
        <div className="min-h-screen bg-[#020817] flex items-center justify-center p-4">
            <div className="flex flex-col items-center gap-4 animate-in fade-in zoom-in duration-300">
                <div className="relative">
                    <div className="w-16 h-16 rounded-full border-4 border-snow-primary/10 border-t-snow-accent animate-spin" />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-8 h-8 rounded-full bg-snow-accent/20 animate-pulse" />
                    </div>
                </div>
                <h2 className="text-xl font-bold text-white tracking-tight">Loading...</h2>
                <div className="w-48 h-1 bg-snow-primary/10 rounded-full overflow-hidden">
                    <div className="h-full bg-snow-accent animate-progress origin-left w-full" />
                </div>
            </div>
        </div>
    );
}
