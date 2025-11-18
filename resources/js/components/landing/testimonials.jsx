import { Star } from 'lucide-react';

export default function TestimonialsSection() {
    const testimonials = [
        {
            name: "Grace E.",
            role: "Marketing Manager, QuickReach (Retail & E-commerce)",
            text:
                "WindSMS transformed how we engage customers. We automated follow-ups, personalized offers, and abandoned-cart nudges without overwhelming users. The AI message mixer kept our campaigns fresh and led to a 37% increase in repeat purchases within six weeks.",
            image: "https://randomuser.me/api/portraits/women/65.jpg"
        },
        {
            name: "Pastor Daniel K.",
            role: "Communications Coordinator, Newlife Christian Center (Religious Organization)",
            text:
                "Keeping members informed was a challenge until WindSMS. Automated weekly broadcasts and personalized reminders changed everything. Event attendance increased by 64%, volunteer participation grew, and our members feel more connected than ever.",
            image: "https://randomuser.me/api/portraits/men/12.jpg"
        },
        {
            name: "Sophia A.",
            role: "Communications Lead, HealthLink (Healthcare)",
            text:
                "We wanted a better way to reduce appointment no-shows. WindSMS’ AI-powered reminders felt more human and engaging. Attendance improved by 29%, and follow-up responses doubled in just the first month.",
            image: "https://randomuser.me/api/portraits/women/32.jpg"
        },
    ];

    return (
        <section className="relative bg-white py-24 dark:bg-[#0a0a0a]">
            <div className="mx-auto w-full max-w-6xl px-6 text-center">
                <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 md:text-5xl dark:text-white">
                    Don't Just Take Our Words For It
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
