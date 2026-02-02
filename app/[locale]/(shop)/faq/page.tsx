
import { Metadata } from 'next';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { useTranslations } from 'next-intl';

export const metadata: Metadata = {
    title: 'Frequently Asked Questions | SnowX',
    description: 'Answers to common questions about SnowX services.',
};

export default function FaqPage() {
    const t = useTranslations('FAQ');
    const keys = ['delivery', 'legal', 'warranty', 'password', 'refund', 'payment'] as const;

    return (
        <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold text-white mb-2 text-center">{t('title')}</h1>
            <p className="text-gray-400 text-center mb-12">{t('subtitle')}</p>

            <Accordion type="single" collapsible className="w-full space-y-4">
                {keys.map((key, index) => (
                    <AccordionItem key={index} value={`item-${index}`} className="border border-snow-primary/20 bg-[#0a1628] rounded-xl px-4">
                        <AccordionTrigger className="text-white hover:text-snow-accent hover:no-underline py-4 text-left">
                            {t(`questions.${key}.q`)}
                        </AccordionTrigger>
                        <AccordionContent className="text-gray-400 pb-4">
                            {t(`questions.${key}.a`)}
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
    );
}
