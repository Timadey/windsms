"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Upload, Sparkles, TrendingUp } from "lucide-react";

const steps = [
    {
        title: "Import Your Contacts",
        description:
            "Upload CSV files or add contacts manually. We clean duplicates and validate phone numbers instantly.",
        icon: Upload,
    },
    {
        title: "Create Your Message",
        description:
            "Write your SMS and let the AI Message Mixer generate thousands of spam-safe variations automatically.",
        icon: Sparkles,
    },
    {
        title: "Target, Schedule, Send!",
        description:
            "Use tags to target groups. Schedule for later, set recurring campaigns, or send immediately.",
        icon: Calendar,
    },
    {
        title: "Track Results",
        description:
            "Monitor delivery reports, explore detailed logs, and optimize your next campaigns with real analytics.",
        icon: TrendingUp,
    },
];

export default function HowItWorks() {
    return (
        <section id="how-it-works" className="px-8 relative bg-white py-20 md:py-24 dark:bg-gray-950">
            {/* Subtle glow */}
            <div className="pointer-events-none absolute inset-0 mx-auto max-w-6xl opacity-10 blur-3xl">
                <div className="h-full w-full rounded-full bg-primary/20" />
            </div>

            <div className="relative mx-auto mb-16 max-w-4xl text-center">
                <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 md:text-5xl dark:text-white">
                    Four Steps to <span className="text-sky-600">Better</span> SMS
                </h2>
                <p className="mx-auto mt-3 max-w-xl text-base text-muted-foreground">
                    Start fast, stay organized, and manage all your messaging in
                    one clean, unified dashboard.
                </p>
            </div>

            <div className="relative grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
                {steps.map((step, index) => {
                    const Icon = step.icon;

                    return (
                        <Card
                            key={index}
                            className="group relative overflow-hidden rounded-2xl border border-primary/10 bg-gradient-to-br from-white to-primary/5 p-0 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md dark:from-gray-900 dark:to-primary/10"
                        >
                            {/* Step Number */}
                            <div className="absolute top-5 left-5 flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-bold text-white shadow-md">
                                {index + 1}
                            </div>

                            <CardContent className="flex flex-col items-center p-10 pt-14 text-center">
                                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary transition-all group-hover:scale-105">
                                    <Icon className="h-7 w-7" />
                                </div>

                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    {step.title}
                                </h3>

                                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                                    {step.description}
                                </p>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </section>
    );
}
