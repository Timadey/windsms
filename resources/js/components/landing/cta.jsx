import {
    MessageSquare,
    Zap,
    ShieldCheck,
    BarChart3,
    Sparkles,
    CheckCircle,
    Send,
} from 'lucide-react';

export default function CtaSection() {
    return (
        <section className="w-full relative mx-4 overflow-hidden bg-gradient-to-br from-sky-600 to-sky-500 py-20 text-center text-white md:mx-0">
            {/* Decorative wind effect */}
            <div className="absolute inset-0 bg-[url('/wind-pattern2.jpg')] bg-cover bg-center opacity-10"></div>

            <div className="relative z-10 mx-auto max-w-3xl px-6">
                <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 backdrop-blur-sm">
                    <Zap className="h-5 w-5" />
                    <span className="font-medium">
                        Start Free • No Credit Card Required
                    </span>
                </div>
                <h2 className="mb-4 text-4xl leading-tight font-bold">
                    Ready to 10x Your SMS Delivery?
                </h2>
                <p className="mb-8 text-lg text-sky-100">
                    Join businesses sending smarter campaigns with AI-powered
                    message mixing, smart scheduling, and real-time analytics.
                </p>

                <div className="flex flex-col justify-center gap-4 sm:flex-row">
                    <a
                        href="/pricing"
                        className="inline-flex items-center justify-center rounded-lg bg-white px-6 py-3 font-semibold text-sky-600 shadow transition hover:bg-sky-50"
                    >
                        <BarChart3 className="h-5 w-5" />
                        View Pricing
                    </a>
                    <a
                        href="/register"
                        className="inline-flex items-center justify-center rounded-lg border border-white px-6 py-3 font-semibold transition hover:bg-white hover:text-sky-600"
                    >
                        <Send className="h-5 w-5" />
                        Get Started for Free
                    </a>
                </div>
                <div className="mt-12 flex flex-wrap justify-center gap-8 text-sm">
                    <div className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-green-300" />
                        <span>AI Message Mixing</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-green-300" />
                        <span>Smart Scheduling</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-green-300" />
                        <span>Real-Time Analytics</span>
                    </div>
                </div>
            </div>
        </section>
    );
}
