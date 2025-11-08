import { Star } from 'lucide-react';

export default function TestimonialsSection() {
    const testimonials = [
        {
            name: 'Grace E.',
            role: 'Marketing Manager, QuickReach',
            text: 'Windsms has completely transformed how we handle campaign communication. The delivery rate is amazing, and the personalized message feature adds a human touch our customers love.',
            image: 'https://randomuser.me/api/portraits/women/65.jpg',
        },
        {
            name: 'David O.',
            role: 'Founder, EduReach Africa',
            text: 'Scheduling and tracking campaigns has never been this seamless. Windsms gives us reliable performance and excellent reporting. It’s now our go-to for all outreach efforts.',
            image: 'https://randomuser.me/api/portraits/men/45.jpg',
        },
        {
            name: 'Sophia A.',
            role: 'Communications Lead, HealthLink',
            text: 'The AI-powered message mixer is pure genius! Our engagement rates improved instantly since every message feels fresh and personalized. Highly recommend Windsms!',
            image: 'https://randomuser.me/api/portraits/women/32.jpg',
        },
    ];

    return (
        <section className="relative bg-white py-24 dark:bg-[#0a0a0a]">
            <div className="mx-auto w-full max-w-6xl px-6 text-center">
                <h2 className="text-3xl font-semibold text-[#1b1b18] md:text-4xl dark:text-white">
                    Don't just take our words for it
                </h2>
                <p className="mt-3 text-lg text-gray-600 dark:text-gray-400">
                    Trusted by businesses and brands who rely on us for fast,
                    reliable messaging.
                </p>

                <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {testimonials.map((t, idx) => (
                        <div
                            key={idx}
                            className="flex flex-col rounded-2xl border border-gray-200 bg-[#FDFDFC] p-8 text-left shadow-sm transition hover:shadow-md dark:border-gray-800 dark:bg-[#111111]"
                        >
                            <div className="flex items-center gap-3">
                                <img
                                    src={t.image}
                                    alt={t.name}
                                    className="h-12 w-12 rounded-full object-cover"
                                />
                                <div>
                                    <p className="font-semibold text-[#1b1b18] dark:text-white">
                                        {t.name}
                                    </p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        {t.role}
                                    </p>
                                </div>
                            </div>

                            <p className="mt-5 leading-relaxed text-gray-700 dark:text-gray-300">
                                “{t.text}”
                            </p>

                            <div className="mt-5 flex text-sky-500">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <Star
                                        key={i}
                                        className="h-5 w-5 fill-sky-500 text-sky-500"
                                    />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Optional subtle gradient decoration */}
                <div className="absolute top-0 left-0 -z-10 h-full w-full bg-gradient-to-b from-sky-50/40 to-transparent dark:from-sky-900/10" />
            </div>
        </section>
    );
}
