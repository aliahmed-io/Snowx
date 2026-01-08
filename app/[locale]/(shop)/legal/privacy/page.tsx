
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Privacy Policy | SnowX',
    description: 'Privacy Policy for SnowX - Learn how we collect, use, and protect your data.',
};

export default function PrivacyPage() {
    return (
        <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold text-white mb-8">Privacy Policy</h1>
            <div className="prose prose-invert max-w-none space-y-8 text-gray-300">
                <section>
                    <h2 className="text-2xl font-bold text-white mb-4">1. Introduction</h2>
                    <p>
                        Welcome to SnowX (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;). We are committed to protecting your personal information and your right to privacy.
                        This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-white mb-4">2. Information We Collect</h2>
                    <p>We collect personal information that you voluntarily provide to us when you register on the website, express an interest in obtaining information about us or our products and services, or otherwise when you contact us.</p>
                    <ul className="list-disc pl-6 space-y-2 mt-4">
                        <li><strong>Personal Data:</strong> Name, email address, and contact data provided during registration via Kinde Auth.</li>
                        <li><strong>Payment Data:</strong> All payment data is stored by our payment processor (PayPal/Stripe). We do not store full credit card numbers on our servers.</li>
                        <li><strong>Order Data:</strong> We store details of the products you purchased and the associated license/account credentials.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-white mb-4">3. How We Use Your Information</h2>
                    <p>We use the information we collect or receive:</p>
                    <ul className="list-disc pl-6 space-y-2 mt-4">
                        <li>To facilitate account creation and logon via Kinde.</li>
                        <li>To fulfill and manage your orders and deliver digital goods.</li>
                        <li>To send you administrative information, such as order confirmations and service updates.</li>
                        <li>To protect our services and prevent fraud (e.g., verifying PayPal transactions).</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-white mb-4">4. Sharing Your Information</h2>
                    <p>We strictly do not sell your data. We only share information with:</p>
                    <ul className="list-disc pl-6 space-y-2 mt-4">
                        <li><strong>Service Providers:</strong> We use Kinde for authentication and PayPal for payment processing.</li>
                        <li><strong>Legal Obligations:</strong> We may disclose information where we are legally required to do so to comply with applicable law.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-white mb-4">5. Data Security</h2>
                    <p>We use administrative, technical, and physical security measures to help protect your personal information. High-sensitive data like inventory passwords are encrypted at rest using AES-256-GCM.</p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-white mb-4">6. Contact Us</h2>
                    <p>If you have questions or comments about this policy, you may contact us via our Support page.</p>
                </section>

                <p className="text-sm text-gray-500 mt-12">Last updated: {new Date().toLocaleDateString()}</p>
            </div>
        </div>
    );
}
