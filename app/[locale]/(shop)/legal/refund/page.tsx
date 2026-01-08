
import { Metadata } from 'next';
import { Link } from '@/navigation';

export const metadata: Metadata = {
    title: 'Refund Policy | SnowX',
    description: 'Refund and Warranty Policy for SnowX digital products.',
};

export default function RefundPage() {
    return (
        <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold text-white mb-8">Refund Policy</h1>
            <div className="prose prose-invert max-w-none space-y-8 text-gray-300">
                <div className="bg-red-500/10 border border-red-500/20 p-6 rounded-lg mb-8">
                    <p className="font-bold text-red-400 m-0">
                        IMPORTANT: Usage of the &quot;Reveal Password&quot; button on your dashboard constitutes acceptance of the account and waives your right to a refund for &quot;Item Not Received&quot; claims.
                    </p>
                </div>

                <section>
                    <h2 className="text-2xl font-bold text-white mb-4">1. General Policy</h2>
                    <p>
                        Since we sell non-tangible, irrevocable digital goods, we generally <strong>do not issue refunds once the product has been viewed or revealed.</strong>
                        As a customer, you are responsible for understanding this upon purchasing any item at our site.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-white mb-4">2. Eligible Refund Circumstances</h2>
                    <p>We honor requests for a refund ONLY for the following exceptional reasons:</p>
                    <ul className="list-disc pl-6 space-y-2 mt-4">
                        <li>
                            <strong>Non-delivery of the product:</strong> If for some reason the script fails and you do not receive account details, and you have not revealed them.
                        </li>
                        <li>
                            <strong>Irreparable defects:</strong> If an account is not working as described and we are unable to provide a working replacement within 48 hours.
                        </li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-white mb-4">3. Replacement Warranty</h2>
                    <p>
                        Instead of refunds, we primarily offer <strong>Replacements</strong>. If an account stops working:
                    </p>
                    <ol className="list-decimal pl-6 space-y-2 mt-4">
                        <li>Contact Support via the <Link href="/contact" className="text-snow-accent hover:underline">Contact Page</Link>.</li>
                        <li>Provide your Order ID and the nature of the issue.</li>
                        <li>Our team will verify the issue and issue a replacement account within 24 hours.</li>
                    </ol>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-white mb-4">4. Chargebacks</h2>
                    <p>
                        Opening a payment dispute or chargeback without contacting our support first will result in an immediate <strong>permanent ban</strong> from our platform and revocation of all purchased accounts.
                    </p>
                </section>

                <p className="text-sm text-gray-500 mt-12">Last updated: {new Date().toLocaleDateString()}</p>
            </div>
        </div>
    );
}
