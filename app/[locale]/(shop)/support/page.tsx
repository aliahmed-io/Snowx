
import { Metadata } from 'next';
import { Mail, MessageCircle, FileText } from 'lucide-react';
import { Link } from '@/navigation';

export const metadata: Metadata = {
    title: 'Support Center | SnowX',
    description: 'Get help with your orders, account issues, or general inquiries.',
};

export default function SupportPage() {
    return (
        <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <div className="text-center mb-16">
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">How can we help?</h1>
                <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                    Choose a category below to find the assistance you need.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                <Link href="/faq" className="group">
                    <div className="bg-[#0a1628] border border-snow-primary/20 rounded-2xl p-8 hover:bg-[#0f1f38] transition-all h-full">
                        <div className="w-12 h-12 bg-snow-accent/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <FileText className="w-6 h-6 text-snow-accent" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3">FAQ</h3>
                        <p className="text-gray-400">
                            Find instant answers to common questions about delivery, payments, and account setup.
                        </p>
                    </div>
                </Link>

                <Link href="/account/credentials" className="group">
                    <div className="bg-[#0a1628] border border-snow-primary/20 rounded-2xl p-8 hover:bg-[#0f1f38] transition-all h-full">
                        <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <MessageCircle className="w-6 h-6 text-blue-400" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3">Report an Issue</h3>
                        <p className="text-gray-400">
                            Problem with an order? Go to your Credentials page to report specific account issues.
                        </p>
                    </div>
                </Link>

                <Link href="/contact" className="group">
                    <div className="bg-[#0a1628] border border-snow-primary/20 rounded-2xl p-8 hover:bg-[#0f1f38] transition-all h-full">
                        <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <Mail className="w-6 h-6 text-green-400" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3">Contact Us</h3>
                        <p className="text-gray-400">
                            Still stuck? Send us a message and our support team will get back to you within 24 hours.
                        </p>
                    </div>
                </Link>
            </div>

            <div className="bg-[#0f172a] rounded-2xl p-8 md:p-12 text-center">
                <h2 className="text-2xl font-bold text-white mb-4">Support Hours</h2>
                <p className="text-gray-400">
                    Our team is available Monday through Friday, 9:00 AM to 5:00 PM EST.
                    <br />
                    Weekend inquiries are typically answered within 48 hours.
                </p>
            </div>
        </div>
    );
}
