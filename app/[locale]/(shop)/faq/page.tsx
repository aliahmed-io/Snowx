
import { Metadata } from 'next';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

export const metadata: Metadata = {
    title: 'Frequently Asked Questions | SnowX',
    description: 'Answers to common questions about SnowX services.',
};

export default function FaqPage() {
    const faqs = [
        {
            question: "How long does delivery take?",
            answer: "Delivery is instant! As soon as your payment is confirmed, you will be redirected to your dashboard where you can reveal your account credentials immediately."
        },
        {
            question: "Are these accounts legal?",
            answer: "Yes, we resell legitimate shared access or discounted accounts. We do not sell stolen or hacked accounts."
        },
        {
            question: "What is the warranty period?",
            answer: "Most accounts come with a warranty that matches the duration of the product (e.g., 1 Month, 1 Year). If an account stops working during this period, we will replace it for free."
        },
        {
            question: "Can I change the password?",
            answer: "No. These are shared or managed accounts. Changing the password, email, or profile settings may void your warranty instantly. Please use the credentials exactly as provided."
        },
        {
            question: "Do you offer refunds?",
            answer: "We offer refunds only if the product is not delivered or if we cannot provide a working replacement for a defective account. Once credentials are viewed, standard refunds are not available."
        },
        {
            question: "Which payment methods do you accept?",
            answer: "We currently accept PayPal and major credit cards securely processed via PayPal."
        }
    ];

    return (
        <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold text-white mb-2 text-center">FAQ</h1>
            <p className="text-gray-400 text-center mb-12">Frequently Asked Questions</p>

            <Accordion type="single" collapsible className="w-full space-y-4">
                {faqs.map((faq, index) => (
                    <AccordionItem key={index} value={`item-${index}`} className="border border-snow-primary/20 bg-[#0a1628] rounded-xl px-4">
                        <AccordionTrigger className="text-white hover:text-snow-accent hover:no-underline py-4 text-left">
                            {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-gray-400 pb-4">
                            {faq.answer}
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
    );
}
