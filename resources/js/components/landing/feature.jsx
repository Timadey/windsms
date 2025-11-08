import { Megaphone, Users, Tag, Sparkles, BarChart3, ShieldCheck, Zap } from "lucide-react";

const features = [
    {
        icon: <Megaphone className="h-8 w-8 text-sky-600" />,
        title: 'Schedule and Manage Campaigns',
        desc: 'Easily create, schedule, and send SMS campaigns. Set up recurring messages or time-sensitive promotions with ease.',
        points: [
            'Automate recurring campaigns',
            'Preview messages before sending',
            'Pause or resume ongoing campaigns',
        ],
        image: '/dashboard.png',
    },
    {
        icon: <Users className="h-8 w-8 text-sky-600" />,
        title: 'Subscriber Management',
        desc: 'Add subscribers manually or import them in bulk. Group contacts and maintain clean, verified databases.',
        points: [
            'Bulk CSV import and export',
            'Real-time duplicate checks',
            'Smart segmentation tools',
        ],
        image: '/dashboard.png',
    },
    {
        icon: <Tag className="h-8 w-8 text-sky-600" />,
        title: 'Smart Tagging System',
        desc: 'Categorize your audience using tags and target the right group every time. No more generic blasts — send messages that matter.',
        points: [
            'Create unlimited tags',
            'Send to selected tags only',
            'Easy-to-manage list segmentation',
        ],
        image: '/dashboard.png',
    },
    {
        icon: <Sparkles className="h-8 w-8 text-sky-600" />,
        title: 'AI Message Mixer',
        desc: 'Reduce spam filters and boost deliverability by generating unique variations of your message automatically using AI.',
        points: [
            'AI-powered message spinning',
            'Enhanced message deliverability',
            'Reduce carrier spam detection',
        ],
        image: '/dashboard.png',
    },
    {
        icon: <ShieldCheck className="h-8 w-8 text-sky-600" />,
        title: 'Custom Sender IDs',
        desc: 'Personalize your message origin with custom sender IDs that represent your brand professionally.',
        points: [
            'Unique sender name registration',
            'Brand visibility in every message',
            'Supports alphanumeric IDs',
        ],
        image: '/dashboard.png',
    },
    {
        icon: <BarChart3 className="h-8 w-8 text-sky-600" />,
        title: 'Analytics & Reporting',
        desc: 'Track delivery rates, engagement, and conversion performance in real time through our analytics dashboard.',
        points: [
            'Real-time delivery reports',
            'Performance visualizations',
            'Export insights as CSV or PDF',
        ],
        image: '/dashboard.png',
    },
    {
        icon: <Zap className="h-8 w-8 text-sky-600" />,
        title: 'Developer API',
        desc: 'Integrate Windsms into your app or CRM with our simple, well-documented REST API.',
        points: [
            'Easy RESTful API access',
            'Fast and secure authentication',
            'Webhook support for delivery reports',
        ],
        image: '/dashboard.png',
    },
];

export default function FeaturesSection() {
    return (
        <section id="features" className="bg-white py-20 dark:bg-[#0a0a0a]">
            <div className="container mx-auto px-6 md:px-10">
                <div className="mx-auto mb-20 max-w-3xl text-center">
                    <span className="font-semibold text-sky-600 uppercase">
                        Windsms Features
                    </span>
                    <h2 className="mt-3 text-4xl font-bold text-gray-900 md:text-5xl dark:text-white">
                        Built to Help You Communicate Better
                    </h2>
                    <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
                        From AI-powered message delivery to detailed analytics,
                        every tool you need to scale your SMS marketing
                        efficiently is built right in.
                    </p>
                </div>

                <div className="flex flex-col space-y-24">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className={`grid grid-cols-1 items-center gap-12 lg:grid-cols-2 ${
                                index % 2 !== 0 ? 'lg:flex-row-reverse' : ''
                            }`}
                        >
                            {/* Image */}
                            <div
                                className={`relative overflow-hidden rounded-2xl shadow-xl order-${index % 2 ? 'last' : 'first'}`}
                            >
                                <img
                                    src={feature.image}
                                    alt={feature.title}
                                    className="h-full w-full transform object-cover transition duration-700 hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-50 transition hover:opacity-70"></div>
                            </div>

                            {/* Content */}
                            <div className="mx-auto max-w-xl lg:mx-0">
                                <div className="mb-5 flex items-center space-x-3">
                                    {feature.icon}
                                </div>
                                <h3 className="mb-3 text-3xl font-semibold text-gray-900 dark:text-white">
                                    {feature.title}
                                </h3>
                                <p className="mb-6 text-gray-600 dark:text-gray-300">
                                    {feature.desc}
                                </p>

                                <ul className="space-y-3">
                                    {feature.points.map((point, i) => (
                                        <li
                                            key={i}
                                            className="flex items-start space-x-2"
                                        >
                                            <span className="mt-1 text-sky-500">
                                                ✔
                                            </span>
                                            <span className="text-gray-700 dark:text-gray-300">
                                                {point}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
