import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

const faqs = [
    {
        question: 'What is WindSMS?',
        answer: 'WindSMS is a smart bulk SMS platform that lets you create, schedule, and send campaigns with better deliverability. It also includes AI-powered message mixing, analytics, and subscriber management to help you reach your audience effectively.',
    },
    // {
    //     question: 'How does the rollover system work?',
    //     answer: 'Depending on your plan, unused SMS units may roll over to the next month. The Pro plan offers 1-month rollover, Business offers 2-month rollover, while Enterprise users enjoy shared pool access with no hard expiry.',
    // },
    {
        question: 'Can I use my own Sender ID?',
        answer: 'Yes. Pro, Business, and Enterprise plans include custom sender IDs. Free users can purchase it as an add-on for a small fee. Once verified, your sender name appears on all outgoing messages.',
    },
    {
        question: 'What is the Message Mixer?',
        answer: 'The Message Mixer is an AI-powered tool that automatically generates smart variations of your SMS content. This reduces spam filtering and boosts delivery rates by making each message more unique and human-like.',
    },
    {
        question: 'Do you provide delivery reports?',
        answer: 'Yes. From the Pro plan upward, WindSMS provides detailed analytics on delivery, CTR, and conversion rates — helping you track campaign performance and optimize future sends.',
    },
    {
        question: 'Is there an API for developers?',
        answer: 'Absolutely. The Business and Enterprise plans include API access, allowing you to integrate WindSMS into your own applications or automate sending directly from your systems.',
    },
    {
        question: 'Who can use WindSMS?',
        answer: 'Anyone who needs to send bulk SMS — from individuals and churches to SMEs, marketers, and agencies. Each plan is designed to scale with your communication needs.',
    },
];

export const FAQSection = () => {
    const [openIndex, setOpenIndex] = useState(null);

    return (
        <section id="faq" className="px-8 bg-white py-20 md:py-24 dark:bg-gray-950">
            <div className="mx-auto max-w-4xl px-6 text-center">
                <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 md:text-5xl dark:text-white">
                    Frequently Asked Questions
                </h2>
                <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
                    Everything you need to know about using WindSMS.
                </p>
            </div>

            <div className="mx-auto mt-12 max-w-3xl divide-y divide-gray-200 dark:divide-gray-800">
                {faqs.map((faq, index) => (
                    <div key={index} className="py-6">
                        <button
                            onClick={() =>
                                setOpenIndex(openIndex === index ? null : index)
                            }
                            className="flex w-full items-center justify-between text-left"
                        >
                            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                                {faq.question}
                            </h3>
                            <ChevronDown
                                className={`h-5 w-5 text-gray-500 transition-transform duration-300 ${
                                    openIndex === index
                                        ? 'rotate-180 text-sky-500'
                                        : ''
                                }`}
                            />
                        </button>

                        <div
                            className={`mt-3 text-sm text-gray-600 transition-all duration-300 ease-in-out dark:text-gray-400 ${
                                openIndex === index
                                    ? 'max-h-96 opacity-100'
                                    : 'max-h-0 overflow-hidden opacity-0'
                            }`}
                        >
                            {faq.answer}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};
