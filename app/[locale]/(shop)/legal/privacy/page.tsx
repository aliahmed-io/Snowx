import { getTranslations } from 'next-intl/server';
import { Link } from '@/navigation';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: "Legal" });
    return {
        title: `${t("privacy")} | SnowX`,
        description: isAr(locale)
            ? 'سياسة الخصوصية لـ SnowX - تعرف على كيفية جمعنا واستخدامنا وحماية بياناتك.'
            : 'Privacy Policy for SnowX - Learn how we collect, use, and protect your data.',
    };
}

function isAr(locale: string) {
    return locale === 'ar';
}

export default async function PrivacyPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const isArabic = isAr(locale);

    return (
        <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold text-white mb-8">{isArabic ? "سياسة الخصوصية" : "Privacy Policy"}</h1>
            <div className="prose prose-invert max-w-none space-y-8 text-gray-300">
                <section>
                    <h2 className="text-2xl font-bold text-white mb-4">{isArabic ? "1. مقدمة" : "1. Introduction"}</h2>
                    <p>
                        {isArabic
                            ? 'مرحباً بكم في SnowX ("نحن" أو "نا"). نحن ملتزمون بحماية معلوماتك الشخصية وحقك في الخصوصية. تشرح سياسة الخصوصية هذه كيفية جمعنا واستخدامنا والكشف عن معلوماتك وحمايتها عند زيارة موقعنا.'
                            : 'Welcome to SnowX ("we," "our," or "us"). We are committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website.'}
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-white mb-4">{isArabic ? "2. المعلومات التي نجمعها" : "2. Information We Collect"}</h2>
                    <p>{isArabic ? "نجمع المعلومات الشخصية التي تقدمها لنا طوعاً عند التسجيل في الموقع، أو التعبير عن الاهتمام بالحصول على معلومات عنا أو عن منتجاتنا وخدماتنا، أو غير ذلك عند الاتصال بنا." : "We collect personal information that you voluntarily provide to us when you register on the website, express an interest in obtaining information about us or our products and services, or otherwise when you contact us."}</p>
                    <ul className="list-disc pl-6 space-y-2 mt-4">
                        <li>
                            <strong>{isArabic ? "البيانات الشخصية:" : "Personal Data:"}</strong> {isArabic ? "الاسم، عنوان البريد الإلكتروني، وبيانات الاتصال المقدمة أثناء التسجيل عبر Kinde Auth." : "Name, email address, and contact data provided during registration via Kinde Auth."}
                        </li>
                        <li>
                            <strong>{isArabic ? "بيانات الدفع:" : "Payment Data:"}</strong> {isArabic ? "يتم تخزين جميع بيانات الدفع بواسطة معالج الدفع لدينا (PayPal/Stripe). لا نقوم بتخزين أرقام بطاقات الائتمان الكاملة على خوادمنا." : "All payment data is stored by our payment processor (PayPal/Stripe). We do not store full credit card numbers on our servers."}
                        </li>
                        <li>
                            <strong>{isArabic ? "بيانات الطلب:" : "Order Data:"}</strong> {isArabic ? "نقوم بتخزين تفاصيل المنتجات التي اشتريتها وتراخيص/بيانات اعتماد الحساب المرتبطة بها." : "We store details of the products you purchased and the associated license/account credentials."}
                        </li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-white mb-4">{isArabic ? "3. كيف نستخدم معلوماتك" : "3. How We Use Your Information"}</h2>
                    <p>{isArabic ? "نستخدم المعلومات التي نجمعها أو نتلقاها:" : "We use the information we collect or receive:"}</p>
                    <ul className="list-disc pl-6 space-y-2 mt-4">
                        <li>{isArabic ? "لتسهيل إنشاء الحساب وتسجيل الدخول عبر Kinde." : "To facilitate account creation and logon via Kinde."}</li>
                        <li>{isArabic ? "لتنفيذ وإدارة طلباتك وتسليم البضائع الرقمية." : "To fulfill and manage your orders and deliver digital goods."}</li>
                        <li>{isArabic ? "لإرسال معلومات إدارية لك، مثل تأكيدات الطلب وتحديثات الخدمة." : "To send you administrative information, such as order confirmations and service updates."}</li>
                        <li>{isArabic ? "لحماية خدماتنا ومنع الاحتيال (مثل التحقق من معاملات PayPal)." : "To protect our services and prevent fraud (e.g., verifying PayPal transactions)."}</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-white mb-4">{isArabic ? "4. مشاركة معلوماتك" : "4. Sharing Your Information"}</h2>
                    <p>{isArabic ? "نحن لا نبيع بياناتك بتاتاً. نشارك المعلومات فقط مع:" : "We strictly do not sell your data. We only share information with:"}</p>
                    <ul className="list-disc pl-6 space-y-2 mt-4">
                        <li><strong>{isArabic ? "مقدمو الخدمات:" : "Service Providers:"}</strong> {isArabic ? "نستخدم Kinde للمصادقة و PayPal لمعالجة الدفع." : "We use Kinde for authentication and PayPal for payment processing."}</li>
                        <li><strong>{isArabic ? "الالتزامات القانونية:" : "Legal Obligations:"}</strong> {isArabic ? "قد نكشف عن المعلومات حيثما يطلب منا قانوناً القيام بذلك للامتثال للقانون المعمول به." : "We may disclose information where we are legally required to do so to comply with applicable law."}</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-white mb-4">{isArabic ? "5. أمن البيانات" : "5. Data Security"}</h2>
                    <p>{isArabic ? "نستخدم تدابير أمنية إدارية وفنية ومادية للمساعدة في حماية معلوماتك الشخصية. يتم تشفير البيانات عالية الحساسية مثل كلمات مرور المخزون باستخدام AES-256-GCM." : "We use administrative, technical, and physical security measures to help protect your personal information. High-sensitive data like inventory passwords are encrypted at rest using AES-256-GCM."}</p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-white mb-4">{isArabic ? "6. اتصل بنا" : "6. Contact Us"}</h2>
                    <p>
                        {isArabic ? "إذا كانت لديك أسئلة أو تعليقات حول هذه السياسة، يمكنك الاتصال بنا عبر " : "If you have questions or comments about this policy, you may contact us via our "}
                        <Link href="/contact" className="text-snow-accent hover:underline">
                            {isArabic ? "صفحة الدعم" : "Support page"}
                        </Link>.
                    </p>
                </section>

                <p className="text-sm text-gray-500 mt-12">{isArabic ? "آخر تحديث:" : "Last updated:"} {new Date().toLocaleDateString()}</p>
            </div>
        </div>
    );
}
