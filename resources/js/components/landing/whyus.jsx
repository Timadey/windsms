import {
    MessageSquare,
    Zap,
    ShieldCheck,
    BarChart3,
    Sparkles,
} from 'lucide-react';

export default function WhyUsSection() {
    return (
        <section id="whyus" className="bg-white py-20 dark:bg-[#0f0f0f]">
            <div className="mx-auto max-w-7xl px-6">
                <h3 className="mb-12 text-center text-3xl font-bold text-[#0A1A2F] dark:text-white">
                    Why Choose Windsms?
                </h3>
                <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
                    {[
                        {
                            icon: <Zap className="h-8 w-8 text-sky-600" />,
                            title: 'Fast & Reliable Delivery',
                            desc: 'Send millions of messages instantly using powerful telecommunication infrastructures.',
                        },
                        {
                            icon: (
                                <MessageSquare className="h-8 w-8 text-sky-600" />
                            ),
                            title: 'Personalized Messaging',
                            desc: 'Add names, or custom data to make every SMS feel personal.',
                        },
                        {
                            icon: <Sparkles className="h-8 w-8 text-sky-600" />,
                            title: 'Reduced Spam Filter',
                            desc: 'Generate unique message variations automatically using AI to improve deliverability rates.',
                        },
                        {
                            icon: (
                                <BarChart3 className="h-8 w-8 text-sky-600" />
                            ),
                            title: 'Advanced Analytics',
                            desc: 'Track delivery rates, conversions, and campaign performance in real-time.',
                        },
                        {
                            icon: (
                                <ShieldCheck className="h-8 w-8 text-sky-600" />
                            ),
                            title: 'Custom Sender IDs',
                            desc: 'Represent your brand with unique, verified sender identities.',
                        },
                        {
                            icon: <Zap className="h-8 w-8 text-sky-600" />,
                            title: 'API Integration',
                            desc: 'Connect Windsms directly to your app or CRM via our simple API.',
                        },
                    ].map((feature, idx) => (
                        <div
                            key={idx}
                            className="rounded-2xl border border-gray-100 bg-[#F9FAFB] p-8 shadow-sm transition hover:shadow-md dark:border-gray-800 dark:bg-[#141414]"
                        >
                            <div className="mb-4">{feature.icon}</div>
                            <h4 className="mb-2 text-lg font-semibold">
                                {feature.title}
                            </h4>
                            <p className="text-gray-600 dark:text-gray-400">
                                {feature.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
