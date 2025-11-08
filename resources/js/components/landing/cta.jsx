import {
    MessageSquare,
    Zap,
    ShieldCheck,
    BarChart3,
    Sparkles,
} from 'lucide-react';

export default function CtaSection() {
    return (
        <section className="relative mx-4 overflow-hidden rounded-3xl bg-gradient-to-br from-sky-600 to-sky-500 py-20 text-center text-white md:mx-0">
            {/* Decorative wind effect */}
            <div className="absolute inset-0 bg-[url('/wind-pattern2.jpg')] bg-cover bg-center opacity-10"></div>

            <div className="relative z-10 mx-auto max-w-3xl px-6">
                <h2 className="mb-4 text-4xl leading-tight font-bold">
                    Send Bulk SMS That Actually Deliver
                </h2>
                <p className="mb-8 text-lg text-sky-100">
                    Reach thousands in seconds with personalized, AI-enhanced
                    messages that drive real engagement.
                </p>

                <div className="flex flex-col justify-center gap-4 sm:flex-row">
                    <a
                        href="/pricing"
                        className="inline-flex items-center justify-center rounded-lg bg-white px-6 py-3 font-semibold text-sky-600 shadow transition hover:bg-sky-50"
                    >
                        View Pricing
                    </a>
                    <a
                        href="/register"
                        className="inline-flex items-center justify-center rounded-lg border border-white px-6 py-3 font-semibold transition hover:bg-white hover:text-sky-600"
                    >
                        Get Started for Free
                    </a>
                </div>
            </div>
        </section>
    );
}
