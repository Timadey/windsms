import {
    ArrowRight,
    BarChart3,
    CheckCircle2,
    ClipboardList,
    Megaphone,
    ShieldCheck,
    Sparkles,
    Users,
    Zap,
} from 'lucide-react';

const features = [
    {
        icon: <Megaphone className="h-6 w-6 text-white" />,
        title: 'Campaigns on Autopilot',
        desc: 'Stop staying up late to hit send. Schedule recurring promotions, holiday blasts, and time-sensitive offers weeks in advance. We handle the timing; you handle the sales.',
        points: [
            'Set-and-forget recurring schedules',
            'Instant preview before launch',
            'One-click pause and resume',
        ],
        image: '/screens/campaignList.png',
    },
    {
        icon: <Sparkles className="h-6 w-6 text-white" />,
        title: 'Beat Spam Filters with AI',
        desc: 'Carriers block repetitive content. Our AI "Mixer" subtly varies your message wording automatically to fly under the radar and ensure your texts actually land in inboxes.',
        points: [
            'AI-powered content spinning',
            '99.9% Delivery rate optimization',
            'Bypass carrier spam algorithms',
        ],
        image: '/screens/mixtures.png',
    },
    {
        icon: <Users className="h-6 w-6 text-white" />,
        title: 'Audience Intelligence',
        desc: 'A messy contact list kills conversion rates. Our tools help you clean, verify, and organize your database so you are only paying to reach real, active customers.',
        points: [
            'Auto-remove duplicate numbers',
            'Bulk import via CSV/Excel',
            'Smart segmentation logic',
        ],
        image: '/screens/subscribers.png',
    },
    {
        icon: <ShieldCheck className="h-6 w-6 text-white" />,
        title: 'Build Trust with Sender IDs',
        desc: "Don't be just another random number. Send messages using your brand name (Sender ID) so customers instantly recognize and trust the notification.",
        points: [
            'Custom alphanumeric Sender IDs',
            'Instant brand recognition',
            'Higher open rates due to trust',
        ],
        image: '/screens/senderId.png',
    },
    {
        icon: <ClipboardList className="h-6 w-6 text-white" />,
        title: "Delivery Logs That Tell the Full Story",
        desc: "Know exactly what happened to every message — delivered, pending, failed, or retried. Our delivery log keeps you in control and removes the guesswork.",
        points: [
            "Real-time delivery status",
            "Reason-based failure reports",
            "Trace every message end-to-end",
        ],
        image: "/screens/delivery.png",
    },
    {
        icon: <BarChart3 className="h-6 w-6 text-white" />,
        title: 'Actionable Analytics',
        desc: 'Stop guessing what works. See exactly who opened, who clicked, and who bought. Our real-time dashboard turns raw data into revenue-generating insights.',
        points: [
            'Live delivery & click tracking',
            'Visual conversion graphs',
            'Exportable PDF/CSV reports',
        ],
        image: '/screens/analytics.png',
    },
    {
        icon: <Zap className="h-6 w-6 text-white" />,
        title: 'Developer-First API',
        desc: 'Building your own platform? Integrate our robust SMS infrastructure into your app or CRM in minutes with clear documentation and secure authentication.',
        points: [
            'RESTful architecture',
            '99.99% Uptime SLA',
            'Real-time Webhooks',
        ],
        image: '/screens/developer.png',
    },
];

export default function FeaturesSection() {
    return (
        <section id="features" className="bg-white py-24 dark:bg-[#0a0a0a]">
            <div className="container mx-auto px-6 md:px-10">
                {/* Header Section */}
                <div className="mx-auto mb-24 max-w-3xl text-center">
                    <div className="inline-flex items-center gap-2 rounded-full bg-sky-50 px-3 py-1 text-sm font-semibold text-sky-600 dark:bg-sky-900/30 dark:text-sky-400">
                        <span className="relative flex h-2 w-2">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-75"></span>
                            <span className="relative inline-flex h-2 w-2 rounded-full bg-sky-500"></span>
                        </span>
                        POWERFUL FEATURES
                    </div>
                    <h2 className="mt-6 text-3xl font-extrabold tracking-tight text-gray-900 md:text-5xl dark:text-white">
                        Everything You Need To{' '}
                        <span className="text-sky-600">Scale Faster</span>
                    </h2>
                    <p className="mt-6 text-lg text-gray-600 dark:text-gray-400">
                        From AI-powered delivery optimization to granular
                        analytics, we provide the enterprise-grade toolkit you
                        need to turn SMS into your #1 revenue channel.
                    </p>
                </div>

                {/* Features Loop */}
                <div className="space-y-24 lg:space-y-32">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className={`flex flex-col gap-12 lg:flex-row lg:items-center ${
                                index % 2 !== 0 ? 'lg:flex-row-reverse' : ''
                            }`}
                        >
                            {/* Image Side */}
                            <div className="w-full lg:w-1/2">
                                <div className="group relative overflow-hidden rounded-2xl bg-gray-100  ring-1 ring-gray-900/5 dark:bg-gray-800 dark:ring-white/10">
                                    <div className="absolute -inset-1 bg-opacity-20 blur transition duration-500 group-hover:opacity-40"></div>
                                    <img
                                        src={feature.image}
                                        alt={feature.title}
                                        className="relative h-auto w-full transform object-cover transition duration-700 ease-out hover:scale-[1.1]"
                                    />
                                </div>
                            </div>

                            {/* Content Side */}
                            <div className="w-full lg:w-1/2 lg:px-8">
                                <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
                                    {feature.icon}
                                </div>

                                <h3 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white">
                                    {feature.title}
                                </h3>
                                <p className="mb-8 text-lg leading-relaxed text-gray-600 dark:text-gray-300">
                                    {feature.desc}
                                </p>

                                <ul className="space-y-4">
                                    {feature.points.map((point, i) => (
                                        <li
                                            key={i}
                                            className="flex items-start gap-3"
                                        >
                                            <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-sky-500" />
                                            <span className="font-medium text-gray-700 dark:text-gray-200">
                                                {point}
                                            </span>
                                        </li>
                                    ))}
                                </ul>

                                {/* Optional Micro-CTA per feature */}
                                <button className="group mt-8 inline-flex items-center text-sm font-semibold text-sky-600 hover:text-sky-500 dark:text-sky-400">
                                    Learn more{' '}
                                    <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
