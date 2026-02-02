
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Terms of Service | SnowX',
    description: 'Terms and Conditions for using SnowX digital marketplace.',
};

export default async function TermsPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const isAr = locale === 'ar';

    return (
        <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold text-white mb-8">{isAr ? "شروط الخدمة" : "Terms of Service"}</h1>
            <div className="prose prose-invert max-w-none space-y-8 text-gray-300">
                <section>
                    <h2 className="text-2xl font-bold text-white mb-4">
                        {isAr ? "1. الموافقة على الشروط" : "1. Agreement to Terms"}
                    </h2>
                    <p>
                        {isAr
                            ? "من خلال الوصول إلى SnowX أو استخدامه، فإنك توافق على الالتزام بشروط الخدمة هذه. إذا كنت لا توافق على أي جزء من الشروط، فلا يجوز لك الوصول إلى الخدمة."
                            : "By accessing or using SnowX, you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you may not access the service."}
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-white mb-4">
                        {isAr ? "2. السلع الرقمية والتسليم" : "2. Digital Goods & Delivery"}
                    </h2>
                    <p>
                        {isAr ? "يوفر SnowX الوصول إلى حسابات رقمية لخدمات الطرف الثالث." : "SnowX provides access to digital accounts for third-party services."}
                    </p>
                    <ul className="list-disc pl-6 space-y-2 mt-4">
                        <li>
                            <strong>{isAr ? "التسليم:" : "Delivery:"}</strong> {isAr ? "يتم تسليم بيانات الاعتماد فوراً عبر لوحة التحكم بعد تأكيد الدفع." : "Credentials are delivered instantly via the dashboard after payment confirmation."}
                        </li>
                        <li>
                            <strong>{isAr ? "طبيعة السلع:" : "Nature of Goods:"}</strong> {isAr ? "أنت تشتري الوصول إلى حساب. نحن لا نملك الخدمة الأساسية (مثل Spotify و Netflix)." : "You are purchasing access to an account. We do not own the underlying service (e.g., Spotify, Netflix)."}
                        </li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-white mb-4">
                        {isAr ? "3. سياسة الاسترجاع" : "3. Refund Policy"}
                    </h2>
                    <p>
                        {isAr
                            ? "نظراً لطبيعة السلع الرقمية، فإن جميع المبيعات نهائية بمجرد الكشف عن بيانات الاعتماد/عرضها."
                            : "Due to the nature of digital goods, ALL SALES ARE FINAL once the credentials have been revealed/viewed."}
                        <br />
                        {isAr ? "يرجى مراجعة صفحة سياسة الاسترجاع للحصول على التفاصيل الكاملة." : "Please review our Refund Policy page for full details."}
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-white mb-4">
                        {isAr ? "4. الضمان والاستبدال" : "4. Warranty & Replacements"}
                    </h2>
                    <p>
                        {isAr ? "نقدم ضماناً محدوداً للحسابات المباعة:" : "We provide a limited warranty for the accounts sold:"}
                    </p>
                    <ul className="list-disc pl-6 space-y-2 mt-4">
                        <li>{isAr ? "نضمن أن الحساب يعمل عند التسليم." : "We guarantee the account works upon delivery."}</li>
                        <li>{isAr ? "إذا توقف الحساب عن العمل خلال فترة الضمان (على سبيل المثال، 30 يوماً أو مدى الحياة، حسب المنتج)، فسنقوم بتوفير بديل." : "If an account stops working within the warranty period (e.g., 30 days or Lifetime, depending on product), we will provide a replacement."}</li>
                        <li>{isAr ? "نحتفظ بالحق في الحد من عمليات الاستبدال إذا تم اكتشاف سلوك مسيء (بحد أقصى استبدالين لكل طلب)." : "We reserve the right to limit replacements if abusive behavior is detected (max 2 replacements per order)."}</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-white mb-4">
                        {isAr ? "5. الأنشطة المحظورة" : "5. Prohibited Activities"}
                    </h2>
                    <p>
                        {isAr
                            ? "لا يجوز لك الوصول إلى الموقع أو استخدامه لأي غرض آخر غير الذي توفر الموقع من أجله. يؤدي تغيير كلمة المرور أو البريد الإلكتروني للحساب المقدم دون إذن إلى إبطال الضمان فوراً."
                            : "You may not access or use the Site for any purpose other than that for which we make the Site available. Changing the password or email of a provided account without authorization voids your warranty immediately."}
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-white mb-4">
                        {isAr ? "6. حدود المسؤولية" : "6. Limitation of Liability"}
                    </h2>
                    <p>
                        {isAr
                            ? "لن نكون مسؤولين بأي حال من الأحوال عن أي أضرار مباشرة أو غير مباشرة أو تبعية أو عرضية أو خاصة أو تأديبية تنشأ عن استخدامك للخدمة."
                            : "In no event will we be liable for any direct, indirect, consequential, exemplary, incidental, special, or punitive damages arising from your use of the service."}
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-white mb-4">
                        {isAr ? "7. طلبات الاسترداد البنكية (Chargebacks)" : "7. Chargeback Requests"}
                    </h2>
                    <p>
                        {isAr
                            ? "يؤدي فتح نزاع دفع أو طلب استرداد بنكي (chargeback) دون الاتصال بدعمنا أولاً إلى حظر دائم وفوري من منصتنا وإلغاء جميع الحسابات المشتراة مسبقاً."
                            : "Opening a dispute or requesting a refund through your bank or payment gateway (chargeback) without first contacting our support team will result in an immediate and permanent ban from our platform, and all previously purchased accounts will be terminated."}
                    </p>
                </section>

                <p className="text-sm text-gray-500 mt-12">
                    {isAr ? "آخر تحديث: " : "Last updated: "} {new Date().toLocaleDateString()}
                </p>
            </div>
        </div>
    );
}
