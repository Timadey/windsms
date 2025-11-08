import { Link } from '@inertiajs/react';
import { register } from '@/routes';

export default function HeroSection() {
    return (
        <section className="relative mx-auto flex max-w-7xl flex-col items-center justify-center gap-6 px-6 py-24 text-center">
            <h2 className="max-w-3xl text-4xl leading-tight font-bold text-[#0A1A2F] sm:text-5xl dark:text-white">
                Send <span className="text-sky-600">Fast</span>,{' '}
                <span className="text-teal-500">Reliable</span> &
                <br /> Personalized Bulk SMS with Ease.
            </h2>
            <p className="max-w-xl text-gray-600 dark:text-gray-400">
                Windsms helps businesses communicate with millions of customers
                in seconds — schedule campaigns, personalize messages, and track
                delivery analytics effortlessly.
            </p>

            <div className="mt-4 flex gap-4">
                <Link
                    href={register()}
                    className="rounded-lg bg-sky-600 px-6 py-3 text-white shadow-md transition hover:bg-sky-700"
                >
                    Get Started Free
                </Link>
                <Link
                    href="#features"
                    className="rounded-lg border border-sky-500 px-6 py-3 text-sky-600 hover:bg-sky-50 dark:text-sky-400 dark:hover:bg-sky-900/30"
                >
                    Explore Features
                </Link>
            </div>

            <img
                src="/dashboard.png"
                alt="SMS Dashboard Preview"
                className="mt-10 w-full max-w-5xl rounded-2xl shadow-lg"
            />
        </section>
    );
}
