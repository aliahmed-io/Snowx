
import { Metadata } from 'next';
import { Link } from '@/navigation';

export const metadata: Metadata = {
    title: 'Refund Policy | SnowX',
    description: 'Refund and Warranty Policy for SnowX digital products.',
};

export default async function RefundPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const isAr = locale === 'ar';

    return (
        <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold text-white mb-8">{isAr ? "سياسة الاسترجاع" : "Refund Policy"}</h1>
            <div className="prose prose-invert max-w-none space-y-8 text-gray-300">
                <div className="bg-red-500/10 border border-red-500/20 p-6 rounded-lg mb-8">
                    <p className="font-bold text-red-400 m-0">
                        {isAr
                            ? 'هام: استخدام زر "كشف كلمة المرور" في لوحة التحكم يعني قبول الحساب والتنازل عن حقك في استرداد الأموال بسبب "عنصر غير مستلم".'
                            : 'IMPORTANT: Usage of the "Reveal Password" button on your dashboard constitutes acceptance of the account and waives your right to a refund for "Item Not Received" claims.'}
                    </p>
                </div>

                <section>
                    <h2 className="text-2xl font-bold text-white mb-4">
                        {isAr ? "1. السياسة العامة" : "1. General Policy"}
                    </h2>
                    <p>
                        {isAr
                            ? "نظراً لأننا نبيع سلعاً رقمية غير ملموسة وغير قابلة للإلغاء، فإننا عموماً لا نصدر مبالغ مستردة بمجرد عرض المنتج أو كشفه. كعميل، أنت مسؤول عن فهم هذا عند شراء أي عنصر من موقعنا."
                            : "Since we sell non-tangible, irrevocable digital goods, we generally do not issue refunds once the product has been viewed or revealed. As a customer, you are responsible for understanding this upon purchasing any item at our site."}
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-white mb-4">
                        {isAr ? "2. ظروف الاسترداد المؤهلة" : "2. Eligible Refund Circumstances"}
                    </h2>
                    <p>
                        {isAr ? "نقبل طلبات الاسترداد فقط للأسباب الاستثنائية التالية:" : "We honor requests for a refund ONLY for the following exceptional reasons:"}
                    </p>
                    <ul className="list-disc pl-6 space-y-2 mt-4">
                        <li>
                            <strong>{isAr ? "عدم استلام المنتج:" : "Non-delivery of the product:"}</strong> {isAr ? "إذا فشل النص البرمجي لسبب ما ولم تتلق تفاصيل الحساب، ولم تقم بكشفها." : "If for some reason the script fails and you do not receive account details, and you have not revealed them."}
                        </li>
                        <li>
                            <strong>{isAr ? "عيوب لا يمكن إصلاحها:" : "Irreparable defects:"}</strong> {isAr ? "إذا كان الحساب لا يعمل كما هو موصوف ولم نتمكن من توفير بديل عملي في غضون 48 ساعة." : "If an account is not working as described and we are unable to provide a working replacement within 48 hours."}
                        </li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-white mb-4">
                        {isAr ? "3. ضمان الاستبدال" : "3. Replacement Warranty"}
                    </h2>
                    <p>
                        {isAr
                            ? "بدلاً من استرداد الأموال، نقدم في المقام الأول خدمة الاستبدال. في حال توقف الحساب عن العمل:"
                            : "Instead of refunds, we primarily offer Replacements. If an account stops working:"}
                    </p>
                    <ol className="list-decimal pl-6 space-y-2 mt-4">
                        <li>
                            {isAr ? "اتصل بالدعم عبر " : "Contact Support via the "}
                            <Link href="/contact" className="text-snow-accent hover:underline">
                                {isAr ? "صفحة الاتصال" : "Contact Page"}
                            </Link>.
                        </li>
                        <li>{isAr ? "يرجى تقديم رقم الطلب الخاص بك وطبيعة المشكلة." : "Provide your Order ID and the nature of the issue."}</li>
                        <li>{isAr ? "سيقوم فريقنا بالتحقق من المشكلة وإصدار حساب بديل في غضون 24 ساعة." : "Our team will verify the issue and issue a replacement account within 24 hours."}</li>
                    </ol>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-white mb-4">
                        {isAr ? "4. طلبات الاسترداد البنكية (Chargebacks)" : "4. Chargebacks"}
                    </h2>
                    <p>
                        {isAr
                            ? "يؤدي فتح نزاع دفع أو طلب استرداد بنكي (chargeback) دون الاتصال بدعمنا أولاً إلى حظر دائم وفوري من منصتنا وإلغاء جميع الحسابات المشتراة مسبقاً."
                            : "Opening a payment dispute or chargeback without contacting our support first will result in an immediate permanent ban from our platform and revocation of all purchased accounts."}
                    </p>
                </section>

                <p className="text-sm text-gray-500 mt-12">
                    {isAr ? "آخر تحديث: " : "Last updated: "} {new Date().toLocaleDateString()}
                </p>
            </div>
        </div>
    );
}
