
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Terms of Service | SnowX',
    description: 'Terms and Conditions for using SnowX digital marketplace.',
};

export default function TermsPage() {
    return (
        <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold text-white mb-8">Terms of Service</h1>
            <div className="prose prose-invert max-w-none space-y-8 text-gray-300">
                <section>
                    <h2 className="text-2xl font-bold text-white mb-4">1. Agreement to Terms</h2>
                    <p>
                        By accessing or using SnowX, you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you may not access the service.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-white mb-4">2. Digital Goods & Delivery</h2>
                    <p>
                        SnowX provides access to digital accounts for third-party services.
                    </p>
                    <ul className="list-disc pl-6 space-y-2 mt-4">
                        <li><strong>Delivery:</strong> Credentials are delivered instantly via the dashboard after payment confirmation.</li>
                        <li><strong>Nature of Goods:</strong> You are purchasing access to an account. We do not own the underlying service (e.g., Spotify, Netflix).</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-white mb-4">3. Refund Policy</h2>
                    <p>
                        Due to the nature of digital goods, <strong>ALL SALES ARE FINAL once the credentials have been revealed/viewed.</strong>
                        Please review our Refund Policy page for full details.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-white mb-4">4. Warranty & Replacements</h2>
                    <p>
                        We provide a limited warranty for the accounts sold:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 mt-4">
                        <li>We guarantee the account works upon delivery.</li>
                        <li>If an account stops working within the warranty period (e.g., 30 days or Lifetime, depending on product), we will provide a replacement.</li>
                        <li>We reserve the right to limit replacements if abusive behavior is detected (max 2 replacements per order).</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-white mb-4">5. Prohibited Activities</h2>
                    <p>
                        You may not access or use the Site for any purpose other than that for which we make the Site available.
                        Changing the password or email of a provided account without authorization voids your warranty immediately.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-white mb-4">6. Limitation of Liability</h2>
                    <p>
                        In no event will we be liable for any direct, indirect, consequential, exemplary, incidental, special, or punitive damages arising from your use of the service.
                    </p>
                </section>

                <p className="text-sm text-gray-500 mt-12">Last updated: {new Date().toLocaleDateString()}</p>
            </div>
        </div>
    );
}
