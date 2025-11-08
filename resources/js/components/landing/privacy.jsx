import { Globe, Mail, Shield } from 'lucide-react';

export default function PrivacyPolicy() {
    return (
        <section className="bg-white py-20 text-gray-800 dark:bg-gray-950 dark:text-gray-200">
            <div className="mx-auto max-w-4xl px-6">
                {/* Header */}
                <div className="mb-12 text-center">
                    <div className="mb-4 flex justify-center">
                        <Shield className="h-10 w-10 text-sky-600 dark:text-sky-400" />
                    </div>
                    <h1 className="text-4xl font-bold text-sky-700 dark:text-sky-400">
                        Privacy Policy
                    </h1>
                    <p className="mt-2 text-gray-500 dark:text-gray-400">
                        Last Updated: November 5, 2025
                    </p>
                </div>

                {/* Introduction */}
                <p className="mb-8 text-lg leading-relaxed">
                    Welcome to <strong>WindSMS</strong> (“we,” “our,” or “us”).
                    Your privacy is important to us. This Privacy Policy
                    explains how we collect, use, and protect your information
                    when you use our platform and related services. By using
                    WindSMS, you agree to the terms of this policy.
                </p>

                {/* Section */}
                <div className="space-y-10">
                    <div>
                        <h2 className="mb-3 text-2xl font-semibold text-sky-700 dark:text-sky-400">
                            1. Information We Collect
                        </h2>
                        <p className="mb-4">
                            We collect information to provide and improve our
                            services:
                        </p>
                        <ul className="list-inside list-disc space-y-2">
                            <li>
                                <strong>Personal Information:</strong> name,
                                email, phone, business name, and payment
                                details.
                            </li>
                            <li>
                                <strong>Usage Information:</strong> IP address,
                                device type, activity logs, and access times.
                            </li>
                            <li>
                                <strong>Message & Contact Data:</strong>{' '}
                                Temporary storage of campaign contacts and
                                message content for delivery and compliance.
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h2 className="mb-3 text-2xl font-semibold text-sky-700 dark:text-sky-400">
                            2. How We Use Your Information
                        </h2>
                        <ul className="list-inside list-disc space-y-2">
                            <li>Provide, operate, and maintain our services</li>
                            <li>Process payments and manage subscriptions</li>
                            <li>Send notifications and system updates</li>
                            <li>
                                Prevent spam, fraud, and unauthorized access
                            </li>
                            <li>
                                Comply with telecom and data protection laws
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h2 className="mb-3 text-2xl font-semibold text-sky-700 dark:text-sky-400">
                            3. Data Retention
                        </h2>
                        <p>
                            We retain your information only as long as necessary
                            to fulfill service purposes, comply with the law,
                            and resolve disputes. Once no longer needed, your
                            data is securely deleted or anonymized.
                        </p>
                    </div>

                    <div>
                        <h2 className="mb-3 text-2xl font-semibold text-sky-700 dark:text-sky-400">
                            4. Cookies & Tracking
                        </h2>
                        <p>
                            WindSMS uses cookies to keep you signed in, remember
                            your preferences, and analyze usage. You may disable
                            cookies in your browser settings, though some
                            features may not function properly.
                        </p>
                    </div>

                    <div>
                        <h2 className="mb-3 text-2xl font-semibold text-sky-700 dark:text-sky-400">
                            5. Data Security
                        </h2>
                        <p>
                            We employ strong security measures including SSL
                            encryption, secure payment gateways, and access
                            control systems. However, no online platform is 100%
                            secure. Protect your credentials and account access.
                        </p>
                    </div>

                    <div>
                        <h2 className="mb-3 text-2xl font-semibold text-sky-700 dark:text-sky-400">
                            6. Sharing & Disclosure
                        </h2>
                        <p>
                            We share limited data with trusted third parties
                            like telecom partners, payment processors, and
                            analytics tools — strictly for operational purposes.
                            We may also disclose data if required by law or
                            regulatory authorities.
                        </p>
                    </div>

                    <div>
                        <h2 className="mb-3 text-2xl font-semibold text-sky-700 dark:text-sky-400">
                            7. Your Rights
                        </h2>
                        <p>
                            You can access, correct, or delete your personal
                            data at any time. You may also withdraw consent for
                            marketing messages. Contact us at{' '}
                            <a
                                href="mailto:privacy@windsms.com"
                                className="text-sky-600 underline dark:text-sky-400"
                            >
                                privacy@windsms.com
                            </a>{' '}
                            for any requests.
                        </p>
                    </div>

                    <div>
                        <h2 className="mb-3 text-2xl font-semibold text-sky-700 dark:text-sky-400">
                            8. Third-Party Links
                        </h2>
                        <p>
                            Our platform may link to third-party websites or
                            tools. We are not responsible for their content or
                            privacy practices. Review their policies before
                            using their services.
                        </p>
                    </div>

                    <div>
                        <h2 className="mb-3 text-2xl font-semibold text-sky-700 dark:text-sky-400">
                            9. Children’s Privacy
                        </h2>
                        <p>
                            WindSMS is not intended for children under 16. We do
                            not knowingly collect personal data from minors.
                        </p>
                    </div>

                    <div>
                        <h2 className="mb-3 text-2xl font-semibold text-sky-700 dark:text-sky-400">
                            10. Updates to This Policy
                        </h2>
                        <p>
                            We may update this Privacy Policy from time to time.
                            Changes will be posted here with a revised “Last
                            Updated” date. Continued use of WindSMS after
                            updates means you accept the revised policy.
                        </p>
                    </div>

                    <div>
                        <h2 className="mb-3 text-2xl font-semibold text-sky-700 dark:text-sky-400">
                            11. Contact Us
                        </h2>
                        <div className="space-y-2">
                            <p className="flex items-center gap-2">
                                <Mail className="h-5 w-5 text-sky-600 dark:text-sky-400" />
                                <span>privacy@windsms.com</span>
                            </p>
                            <p className="flex items-center gap-2">
                                <Globe className="h-5 w-5 text-sky-600 dark:text-sky-400" />
                                <a
                                    href="https://windsms.com"
                                    className="text-sky-600 underline dark:text-sky-400"
                                >
                                    www.windsms.com
                                </a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
