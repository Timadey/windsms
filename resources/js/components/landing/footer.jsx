import { Link } from '@inertiajs/react';
import {
    Facebook,
    Instagram,
    Mail,
    MessageCircle,
    Phone,
    Twitter,
} from 'lucide-react';

export default function Footer() {
    return (
        <footer className="border-t border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-950">
            <div className="mx-auto max-w-7xl px-6 py-12 md:py-16">
                <div className="grid grid-cols-1 gap-12 md:grid-cols-4">
                    {/* Brand Info */}
                    <div>
                        <h3 className="text-xl font-semibold text-sky-600 dark:text-sky-400">
                            WindSMS
                        </h3>
                        <p className="mt-4 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                            Send smarter, faster, and more personalized bulk SMS
                            campaigns. Powering communication for individuals,
                            SMEs, and enterprises across Nigeria.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="mb-4 font-semibold text-gray-900 dark:text-gray-100">
                            Quick Links
                        </h4>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <a
                                    href="/#features"
                                    className="hover:text-sky-600 dark:hover:text-sky-400"
                                >
                                    Features
                                </a>
                            </li>
                            <li>
                                <a
                                    href="/pricing"
                                    className="hover:text-sky-600 dark:hover:text-sky-400"
                                >
                                    Pricing
                                </a>
                            </li>
                            {/*<li>*/}
                            {/*    <a*/}
                            {/*        href="/#faq"*/}
                            {/*        className="hover:text-sky-600 dark:hover:text-sky-400"*/}
                            {/*    >*/}
                            {/*        FAQ*/}
                            {/*    </a>*/}
                            {/*</li>*/}
                            <li>
                                <Link
                                    href="/contact"
                                    className="hover:text-sky-600 dark:hover:text-sky-400"
                                >
                                    Contact Us
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Resources */}
                    <div>
                        <h4 className="mb-4 font-semibold text-gray-900 dark:text-gray-100">
                            Resources
                        </h4>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link
                                    href="#"
                                    className="hover:text-sky-600 dark:hover:text-sky-400"
                                >
                                    API Documentation
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/privacy"
                                    className="hover:text-sky-600 dark:hover:text-sky-400"
                                >
                                    Privacy Policy
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/terms"
                                    className="hover:text-sky-600 dark:hover:text-sky-400"
                                >
                                    Terms of Service
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="mb-4 font-semibold text-gray-900 dark:text-gray-100">
                            Get in Touch
                        </h4>
                        <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                            <li className="flex items-center gap-2">
                                <Mail className="h-4 w-4 text-sky-500" />
                                support@windsms.com
                            </li>
                            <li className="flex items-center gap-2">
                                <Phone className="h-4 w-4 text-sky-500" />
                                +234 907 977 2482
                            </li>
                            <li className="flex items-center gap-2">
                                <MessageCircle className="h-4 w-4 text-sky-500" />
                                Chat on WhatsApp
                            </li>
                        </ul>

                        {/* Social Links */}
                        <div className="mt-6 flex items-center gap-4">
                            <a
                                href="#"
                                className="hover:text-sky-600 dark:hover:text-sky-400"
                            >
                                <Facebook className="h-5 w-5" />
                            </a>
                            <a
                                href="#"
                                className="hover:text-sky-600 dark:hover:text-sky-400"
                            >
                                <Twitter className="h-5 w-5" />
                            </a>
                            <a
                                href="#"
                                className="hover:text-sky-600 dark:hover:text-sky-400"
                            >
                                <Instagram className="h-5 w-5" />
                            </a>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-12 flex flex-col items-center justify-between border-t border-gray-200 pt-6 text-sm text-gray-500 sm:flex-row dark:border-gray-800 dark:text-gray-400">
                    <p>
                        © {new Date().getFullYear()} WindSMS. All rights
                        reserved.
                    </p>
                    <p className="mt-3 sm:mt-0">
                        Built with 💙 by{' '}
                        <span
                            // href="https://timothyadeleke.com"
                            // target="_blank"
                            className="text-sky-600 hover:underline dark:text-sky-400"
                        >
                            Provinear Technologies
                        </span>
                    </p>
                </div>
            </div>
        </footer>
    );
}
