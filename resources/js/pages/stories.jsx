'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Users, Church, Vote, TrendingUp, MessageCircle } from 'lucide-react';
import { Head } from '@inertiajs/react';
import Header from '../components/landing/header.jsx';
import Footer from '../components/landing/footer.jsx';

const highlights = [
    { label: 'Messages Delivered', value: '12M+' },
    { label: 'Organizations Served', value: '1,800+' },
    { label: 'Campaign Success Rate', value: '98.4%' },
    { label: 'Monthly Active Senders', value: '10,000+' },
];

const stories = [
    {
        icon: Church,
        title: 'A Church Increased Attendance',
        highlight: '35% Attendance Growth',
        description:
            'Weekly reminders and personalized follow-up messages helped members stay connected and boosted attendance by 35% in under 3 months.',
    },
    {
        icon: Vote,
        title: 'A Student Aspirant Won Her Election',
        highlight: 'Highest Win Margin in 5 Years',
        description:
            'She used segmented SMS broadcasts to mobilize supporters across faculties, resulting in record-breaking turnout on election day.',
    },
    {
        icon: Users,
        title: 'A Business Tripled Returning Customers',
        highlight: '3× Retention Boost',
        description:
            'Automated promotional and loyalty campaigns helped this business see triple the customer return rate within 8 weeks.',
    },
];

const testimonials = [
    {
        name: 'Pastor Daniel',
        role: 'Lead Pastor, Grace Chapel',
        quote: 'WindSMS transformed the way we communicate with our members. Attendance and engagement skyrocketed.',
    },
    {
        name: 'Blessing O.',
        role: 'Student Leader & Elected Treasurer',
        quote: 'My campaign relied entirely on WindSMS. It gave me the confidence and reach I needed to win.',
    },
    {
        name: 'Samuel Ade',
        role: 'Retail Store Owner',
        quote: 'The retention automation helped my business grow faster than any other tool I’ve tried. Worth every naira.',
    },
];

export default function SuccessStoriesPage() {
    return (
        <>
            <Head title="Windsms| Fast & Reliable Bulk SMS Service">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link
                    href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600,700"
                    rel="stylesheet"
                />
            </Head>

            <div className="flex min-h-screen flex-col bg-[#F9FAFB] text-[#0A1A2F] dark:bg-[#0a0a0a] dark:text-[#EDEDEC]">
                <Header />
                <div className="bg-background text-foreground">
                    {/* ------------------------ HERO ------------------------ */}
                    <section className="mx-auto max-w-4xl py-24 text-center">
                        <h1 className="text-4xl font-extrabold tracking-tight md:text-6xl">
                            Success Stories
                        </h1>
                        <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
                            Real people. Real outcomes. Discover how teams,
                            leaders, and organizations use WindSMS to connect
                            better and achieve bigger results.
                        </p>
                    </section>

                    {/* ---------------------- HIGHLIGHT METRICS ---------------------- */}
                    <section className="bg-muted/30 py-12">
                        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-8 text-center md:grid-cols-4">
                            {highlights.map((item, i) => (
                                <div key={i} className="flex flex-col">
                                    <span className="text-3xl font-bold text-primary">
                                        {item.value}
                                    </span>
                                    <span className="text-sm text-muted-foreground">
                                        {item.label}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* ---------------------- FEATURED STORIES ---------------------- */}
                    <section className="mx-auto max-w-6xl py-24">
                        <div className="mb-14 text-center">
                            <h2 className="text-3xl font-bold tracking-tight md:text-5xl">
                                Featured Success Stories
                            </h2>
                            <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
                                These standout stories highlight the real impact
                                WindSMS can deliver across different sectors.
                            </p>
                        </div>

                        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
                            {stories.map((story, i) => {
                                const Icon = story.icon;

                                return (
                                    <Card
                                        key={i}
                                        className="rounded-2xl border border-primary/10 bg-card shadow-sm transition hover:shadow-md"
                                    >
                                        <CardContent className="space-y-4 p-7">
                                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                                <Icon className="h-6 w-6" />
                                            </div>

                                            <h3 className="text-xl font-semibold">
                                                {story.title}
                                            </h3>

                                            <p className="text-sm font-medium text-primary">
                                                {story.highlight}
                                            </p>

                                            <p className="text-sm leading-relaxed text-muted-foreground">
                                                {story.description}
                                            </p>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>
                    </section>

                    {/* ------------------------- TESTIMONIALS -------------------------- */}
                    <section className="bg-muted/30 py-20">
                        <div className="mx-auto mb-14 max-w-5xl text-center">
                            <h2 className="text-3xl font-bold tracking-tight md:text-5xl">
                                What Our Users Say
                            </h2>
                            <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
                                Honest experiences from real customers who grew
                                with WindSMS.
                            </p>
                        </div>

                        <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-2 lg:grid-cols-3">
                            {testimonials.map((t, i) => (
                                <Card
                                    key={i}
                                    className="rounded-2xl border border-primary/10 bg-card px-6 py-8 shadow-sm transition hover:shadow-lg"
                                >
                                    <p className="mb-6 text-sm leading-relaxed text-muted-foreground">
                                        “{t.quote}”
                                    </p>
                                    <div>
                                        <h4 className="font-semibold text-foreground">
                                            {t.name}
                                        </h4>
                                        <p className="text-xs text-muted-foreground">
                                            {t.role}
                                        </p>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </section>

                    {/* ----------------------------- CTA ------------------------------ */}
                    <section className="py-20 text-center">
                        <div className="mx-auto max-w-3xl">
                            <h2 className="text-3xl font-bold md:text-5xl">
                                Ready to Create Your Own Success Story?
                            </h2>
                            <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
                                Start sending reliable, personalized campaigns
                                that actually deliver results.
                            </p>

                            <button className="mt-8 rounded-xl bg-primary px-8 py-4 font-medium text-primary-foreground shadow-sm transition hover:shadow-md">
                                Get Started with WindSMS
                            </button>
                        </div>
                    </section>
                </div>
                <Footer />
            </div>
        </>
    );
}
