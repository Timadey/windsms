import { Link, usePage } from '@inertiajs/react';
import { dashboard, login, register } from '@/routes';
import AppLogo from '../app-logo.jsx';

export default function Header({ canRegister = true }) {
    const { auth } = usePage().props;

    return (
        <header className="w-full bg-sky-50">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
                <h1 className="flex text-lg font-semibold text-sky-600 dark:text-sky-400">
                    <img
                        src="/windsms-logo-short.png"
                        alt="Windsms logo"
                        className="size-8 fill-current text-white dark:text-black"
                    />
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
                    <Link
                        href="/"
                        className="hover:text-sky-600 dark:hover:text-sky-400"
                    >
                        Home
                    </Link>
                    <Link
                        href="/pricing"
                        className="hover:text-sky-600 dark:hover:text-sky-400"
                    >
                        Pricing
                    </Link>
                    <Link
                        href="/contact"
                        className="hover:text-sky-600 dark:hover:text-sky-400"
                    >
                        Contact
                    </Link>
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
