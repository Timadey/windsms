import { Link, usePage } from '@inertiajs/react';
import { dashboard, login, register } from '@/routes';

export default function Header({ canRegister = true }) {
    const { auth } = usePage().props;

    return (
        <header className="w-full border-b border-gray-200 dark:border-gray-800">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
                <h1 className="text-xl font-semibold text-sky-600 dark:text-sky-400">
                    <a
                        href="/"
                        className="hover:text-sky-600 dark:hover:text-sky-400"
                    >
                    WindSMS
                    </a>
                </h1>
                {/* Navigation Links */}
                <nav className="hidden items-center gap-6 text-sm font-medium text-gray-700 md:flex dark:text-gray-300">
                    {/*<a href="#features" className="hover:text-sky-600 dark:hover:text-sky-400">*/}
                    {/*    Features*/}
                    {/*</a>*/}
                    <a
                        href="/pricing"
                        className="hover:text-sky-600 dark:hover:text-sky-400"
                    >
                        Pricing
                    </a>
                    <a
                        href="/contact"
                        className="hover:text-sky-600 dark:hover:text-sky-400"
                    >
                        Contact
                    </a>
                    <a
                        href="#"
                        className="hover:text-sky-600 dark:hover:text-sky-400"
                    >
                        API Docs
                    </a>
                </nav>

                <nav className="flex items-center gap-4 text-sm">
                    {auth.user ? (
                        <Link
                            href={dashboard()}
                            className="rounded-md border border-sky-500 px-4 py-1.5 text-sky-600 hover:bg-sky-50 dark:text-sky-400 dark:hover:bg-sky-900/30"
                        >
                            Dashboard
                        </Link>
                    ) : (
                        <>
                            <Link
                                href={login()}
                                className="px-4 py-1.5 text-sky-600 hover:text-sky-700 dark:text-sky-400 dark:hover:text-sky-300"
                            >
                                Log in
                            </Link>
                            {canRegister && (
                                <Link
                                    href={register()}
                                    className="rounded-md border border-sky-500 px-4 py-1.5 text-sky-600 hover:bg-sky-50 dark:text-sky-400 dark:hover:bg-sky-900/30"
                                >
                                    Get Started
                                </Link>
                            )}
                        </>
                    )}
                </nav>
            </div>
        </header>
    );
}
