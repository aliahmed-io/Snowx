import { CheckCircle2 } from "lucide-react";

const services = [
    { name: "Database", status: "operational" },
    { name: "Stripe", status: "operational" },
    { name: "Resend", status: "operational" },
];

export function SystemHealth() {
    return (
        <div className="bg-[#0a1628] border border-snow-primary/20 rounded-xl p-6 mb-8">
            <h3 className="text-lg font-semibold text-white mb-4">System Health</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {services.map((service) => (
                    <div key={service.name} className="bg-green-500/10 border border-green-500/20 rounded-lg p-3 flex items-center justify-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-400" />
                        <span className="text-sm font-medium text-green-400">{service.name}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
