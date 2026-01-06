const steps = [
    {
        icon: (
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
        ),
        title: "Choose Plan",
        description: "Choose your plan to avail to best unlock Plan.",
    },
    {
        icon: (
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
        ),
        title: "Secure Checkout",
        description: "Choose are service and your secure checkout.",
    },
    {
        icon: (
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
        ),
        title: "Instant Access",
        description: "Instant access free and practices GPT, Netflix embodies, etc.",
    },
];

export function HowItWorks() {
    return (
        <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-snow-primary mb-4">
                        How It Works
                    </h2>
                    <p className="text-snow-gray max-w-2xl mx-auto">
                        Interacting your services on Funning realises
                    </p>
                </div>

                {/* Steps */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {steps.map((step, index) => (
                        <div
                            key={index}
                            className="text-center p-8 rounded-2xl bg-snow-gray-light hover:shadow-lg transition-shadow duration-300"
                        >
                            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-snow-primary text-white mb-6">
                                {step.icon}
                            </div>
                            <h3 className="text-xl font-semibold text-snow-primary mb-3">
                                {step.title}
                            </h3>
                            <p className="text-snow-gray">
                                {step.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
