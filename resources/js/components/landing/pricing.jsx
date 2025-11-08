import { Check, X, Zap, Send, Rocket, Building2 } from "lucide-react";
import { useState } from "react";

export default function Pricing() {
    const [billingCycle, setBillingCycle] = useState("monthly");

    const plans = [
        {
            name: 'Starter',
            icon: <Send className="h-6 w-6 text-sky-600" />,
            price: 3000,
            units: 610,
            extraCost: 5.0,
            profit: 1.0,
            expiry: 'Strict (No Rollover)',
            target: 'Individuals, Micro Businesses',
            features: {
                campaign: true,
                bulkContactImport: true,
                personalized: true,
                analytics: true,
                mixer: false,
                api: false,
                monthlyContacts: '5k',
                senderId: '1',
                tags: 5,
                referralBonus: '1×',
                // priority: false,
                // // rollover: false,
            },
        },
        {
            name: 'Pro',
            icon: <Zap className="h-6 w-6 text-sky-600" />,
            price: 5000,
            units: 1050,
            extraCost: 4.95,
            profit: 1.0,
            expiry: '1-Month Rollover',
            target: 'SMEs, Marketers',
            features: {
                campaign: true,
                bulkContactImport: true,
                personalized: true,
                analytics: true,
                mixer: false,
                api: false,
                monthlyContacts: '300k',
                senderId: 3,
                tags: 20,
                referralBonus: '1.5×',
                // priority: true,
                // rollover: true,
            },
            popular: true,
        },
        {
            name: 'Business',
            icon: <Rocket className="h-6 w-6 text-sky-600" />,
            price: 10000,
            units: 2200,
            extraCost: 4.8,
            profit: 1.0,
            expiry: '2-Month Rollover',
            target: 'High-volume Businesses',
            features: {
                campaign: true,
                bulkContactImport: true,
                personalized: true,
                analytics: true,
                mixer: true,
                api: true,
                monthlyContacts: '2M',
                senderId: 7,
                tags: 'Unlimited',
                referralBonus: '2×',
                // priority: true,
                // rollover: true,
            },
        },
        {
            name: 'Enterprise',
            icon: <Building2 className="h-6 w-6 text-sky-600" />,
            price: 20000,
            units: 4600,
            extraCost: 4.7,
            profit: 1.15,
            expiry: 'Shared Pool',
            target: 'Agencies, Enterprises',
            features: {
                campaign: true,
                bulkContactImport: true,
                personalized: true,
                analytics: true,
                mixer: true,
                api: true,
                monthlyContacts: 'Unlimited',
                senderId: 'Unlimited',
                tags: 'Unlimited',
                referralBonus: '3×',
                // priority: true,
                // rollover: true,
            },
        },
    ];

    return (
        <section
            id="pricing"
            className="relative bg-white py-24 dark:bg-[#0a0a0a]"
        >
            <div className="mx-auto w-full max-w-6xl px-4 text-center">
                <h2 className="text-3xl font-semibold text-[#1b1b18] md:text-4xl dark:text-white">
                    Pricing that works
                </h2>
                <p className="mt-3 text-lg text-gray-600 dark:text-gray-400">
                    Choose a plan that scales with your growth. Get transparent
                    pricing and unbeatable reliability.
                </p>

                {/* Billing Toggle */}
                <div className="mt-8 flex items-center justify-center gap-3">
                    <span
                        className={`cursor-pointer text-sm font-medium ${
                            billingCycle === 'monthly'
                                ? 'text-sky-600'
                                : 'text-gray-500 dark:text-gray-400'
                        }`}
                        onClick={() => setBillingCycle('monthly')}
                    >
                        Monthly
                    </span>
                    <div
                        onClick={() =>
                            setBillingCycle(
                                billingCycle === 'monthly'
                                    ? 'yearly'
                                    : 'monthly',
                            )
                        }
                        className="relative h-6 w-12 cursor-pointer rounded-full bg-gray-200 transition dark:bg-gray-700"
                    >
                        <div
                            className={`absolute top-1 left-1 h-4 w-4 rounded-full bg-white shadow transition ${
                                billingCycle === 'yearly' ? 'translate-x-6' : ''
                            }`}
                        />
                    </div>
                    <span
                        className={`cursor-pointer text-sm font-medium ${
                            billingCycle === 'yearly'
                                ? 'text-sky-600'
                                : 'text-gray-500 dark:text-gray-400'
                        }`}
                        onClick={() => setBillingCycle('yearly')}
                    >
                        Yearly{' '}
                        <span className="text-xs text-sky-500">(save 20%)</span>
                    </span>
                </div>

                {/* Pricing Cards */}
                <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {plans.map((plan, idx) => (
                        <div
                            key={idx}
                            className={`relative flex flex-col rounded-2xl border p-8 text-left shadow-sm transition hover:shadow-md ${
                                plan.popular
                                    ? 'border-sky-500 ring-2 ring-sky-500 dark:ring-sky-600'
                                    : 'border-gray-200 dark:border-gray-800'
                            } dark:bg-[#111111]`}
                        >
                            {plan.popular && (
                                <span className="absolute top-4 right-4 rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-700 dark:bg-sky-900 dark:text-sky-300">
                                    Most Popular
                                </span>
                            )}

                            <div className="flex items-center gap-3">
                                {plan.icon}
                                <h3 className="text-xl font-semibold text-[#1b1b18] dark:text-white">
                                    {plan.name}
                                </h3>
                            </div>
                            <p className="mt-2 text-gray-600 dark:text-gray-400">
                                {plan.target}
                            </p>

                            <div className="mt-6 flex items-end gap-1">
                                <span className="text-4xl font-bold text-[#1b1b18] dark:text-white">
                                    ₦
                                    {(
                                        plan.price *
                                        (billingCycle === 'yearly'
                                            ? 12 * 0.8
                                            : 1)
                                    ).toLocaleString()}
                                </span>
                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                    /{billingCycle === 'monthly' ? 'mo' : 'yr'}
                                </span>
                            </div>

                            <p className="mt-1 text-sm font-medium text-sky-600">
                                {plan.units.toLocaleString()} Free
                                SMS/month{' '}
                            </p>
                            <ul className="mt-6 flex flex-col gap-2">
                                <li className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                                    <span className="font-medium text-sky-500">
                                        ₦{plan.extraCost}/Extra SMS Units
                                    </span>
                                </li>
                                {Object.entries(plan.features).map(
                                    ([feat, val]) => (
                                        <li
                                            key={feat}
                                            className="flex items-center gap-2 text-gray-700 dark:text-gray-300"
                                        >
                                            {val === true ? (
                                                <Check className="h-4 w-4 text-sky-500" />
                                            ) : val === false ? (
                                                <X className="h-4 w-4 text-gray-400" />
                                            ) : (
                                                <span className="font-medium text-sky-500">
                                                    {val}
                                                </span>
                                            )}
                                            <span className="capitalize">
                                                {feat
                                                    .replace(/([A-Z])/g, ' $1')
                                                    .trim()}
                                            </span>
                                        </li>
                                    ),
                                )}
                            </ul>

                            <button className="mt-8 w-full rounded-lg bg-sky-600 px-5 py-2.5 font-medium text-white transition hover:bg-sky-700">
                                Subscribe
                            </button>

                            <button className="mt-3 w-full rounded-lg border border-sky-500 px-5 py-2.5 text-sky-600 transition hover:bg-sky-50 dark:hover:bg-sky-900/20">
                                Buy Extra Units
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
