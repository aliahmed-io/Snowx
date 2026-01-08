export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    return {
        title: `About Us | SnowX`,
        description: "Learn more about SnowX and our mission.",
    };
}

export default async function AboutPage() {
    return (
        <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-white">
            <div className="max-w-3xl mx-auto space-y-8">
                <div className="text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">About SnowX</h1>
                    <p className="text-xl text-gray-400">
                        Pioneering the future of digital commerce.
                    </p>
                </div>

                <div className="prose prose-invert max-w-none">
                    <p>
                        SnowX is a premier digital marketplace dedicated to providing top-tier digital products, services, and software solutions.
                        Our mission is to empower individuals and businesses with the tools they need to succeed in the digital age.
                    </p>

                    <h3>Our Vision</h3>
                    <p>
                        We envision a world where access to premium digital assets is seamless, secure, and instant.
                        Whether you are looking for AI tools, streaming services, or productivity software, SnowX is your trusted partner.
                    </p>

                    <h3>Why Choose Us?</h3>
                    <ul className="list-disc pl-6 space-y-2">
                        <li><strong>Premium Quality:</strong> We curate only the best digital products.</li>
                        <li><strong>Instant Delivery:</strong> Get access to your purchases immediately.</li>
                        <li><strong>Secure Transactions:</strong> Your privacy and security are our top priorities.</li>
                        <li><strong>24/7 Support:</strong> Our dedicated team is here to help you anytime.</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
