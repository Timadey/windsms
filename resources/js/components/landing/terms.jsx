import { FileText, Shield } from 'lucide-react';

export default function TermsOfService() {
    return (
        <section className="bg-white py-20 text-gray-800 dark:bg-gray-950 dark:text-gray-200">
            <div className="mx-auto max-w-4xl px-6">
                {/* Header */}
                <div className="mb-12 text-center">
                    <div className="mb-4 flex justify-center">
                        <FileText className="h-10 w-10 text-sky-600 dark:text-sky-400" />
                    </div>
                    <h1 className="text-4xl font-bold text-sky-700 dark:text-sky-400">
                        Terms of Service
                    </h1>
                    <p className="mt-2 text-gray-500 dark:text-gray-400">
                        Last Updated: November 5, 2025
                    </p>
                </div>

                <p className="mb-8 text-lg leading-relaxed">
                    Welcome to <strong>WindSMS</strong>. These Terms of Service
                    ("Terms") govern your access to and use of our website, SMS
                    platform, APIs, and related services (collectively, the
                    “Services”). By using WindSMS, you agree to comply with and
                    be bound by these Terms.
                </p>

                <div className="space-y-10">
                    <div>
                        <h2 className="mb-3 text-2xl font-semibold text-sky-700 dark:text-sky-400">
                            1. Acceptance of Terms
                        </h2>
                        <p>
                            By registering, accessing, or using WindSMS, you
                            confirm that you have read, understood, and agreed
                            to these Terms and our{' '}
                            <a
                                href="/privacy"
                                className="text-sky-600 underline dark:text-sky-400"
                            >
                                Privacy Policy
                            </a>
                            . If you do not agree, please discontinue use of the
                            Services.
                        </p>
                    </div>

                    <div>
                        <h2 className="mb-3 text-2xl font-semibold text-sky-700 dark:text-sky-400">
                            2. Account Registration
                        </h2>
                        <p>
                            To access our Services, you must create an account
                            with accurate, complete, and up-to-date information.
                            You are responsible for maintaining the
                            confidentiality of your login credentials and for
                            all activities under your account.
                        </p>
                    </div>

                    <div>
                        <h2 className="mb-3 text-2xl font-semibold text-sky-700 dark:text-sky-400">
                            3. Permitted Use
                        </h2>
                        <ul className="list-inside list-disc space-y-2">
                            <li>
                                Use WindSMS only for lawful business or personal
                                communication.
                            </li>
                            <li>
                                Do not send unsolicited, fraudulent, or harmful
                                messages (spam, phishing, or scams).
                            </li>
                            <li>
                                Comply with all local telecom and data privacy
                                laws applicable to your location and recipients.
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h2 className="mb-3 text-2xl font-semibold text-sky-700 dark:text-sky-400">
                            4. Prohibited Activities
                        </h2>
                        <p className="mb-3">
                            You agree not to misuse the platform or engage in
                            activities such as:
                        </p>
                        <ul className="list-inside list-disc space-y-2">
                            <li>Sending deceptive or malicious SMS content</li>
                            <li>
                                Violating any applicable anti-spam or telecom
                                regulations
                            </li>
                            <li>
                                Reverse-engineering, copying, or reselling our
                                platform without consent
                            </li>
                            <li>
                                Attempting unauthorized access to our systems or
                                databases
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h2 className="mb-3 text-2xl font-semibold text-sky-700 dark:text-sky-400">
                            5. Service Availability
                        </h2>
                        <p>
                            While we strive for 99% uptime, WindSMS does not
                            guarantee uninterrupted availability. Temporary
                            downtime may occur for maintenance, upgrades, or
                            network issues beyond our control.
                        </p>
                    </div>

                    <div>
                        <h2 className="mb-3 text-2xl font-semibold text-sky-700 dark:text-sky-400">
                            6. Payment & Billing
                        </h2>
                        <p className="mb-3">
                            Our services are billed based on credits, plans, or
                            pay-as-you-go structures. Payments made are
                            non-refundable once credits are used or campaigns
                            are initiated.
                        </p>
                        <p>
                            WindSMS reserves the right to change pricing or
                            billing models with prior notice to users.
                        </p>
                    </div>

                    <div>
                        <h2 className="mb-3 text-2xl font-semibold text-sky-700 dark:text-sky-400">
                            7. Sender ID Policy
                        </h2>
                        <p>
                            Custom sender IDs must comply with network
                            regulations and cannot impersonate individuals,
                            brands, or organizations without authorization.
                            Abuse of sender IDs may result in account
                            suspension.
                        </p>
                    </div>

                    <div>
                        <h2 className="mb-3 text-2xl font-semibold text-sky-700 dark:text-sky-400">
                            8. Intellectual Property
                        </h2>
                        <p>
                            All content, branding, and software used on WindSMS
                            remain the property of WindSMS or its licensors. You
                            are granted a limited, non-transferable license to
                            use the Services in accordance with these Terms.
                        </p>
                    </div>

                    <div>
                        <h2 className="mb-3 text-2xl font-semibold text-sky-700 dark:text-sky-400">
                            9. Account Suspension or Termination
                        </h2>
                        <p>
                            We reserve the right to suspend or terminate your
                            account for violations of these Terms, unlawful
                            activity, or at our discretion to protect system
                            integrity and other users.
                        </p>
                    </div>

                    <div>
                        <h2 className="mb-3 text-2xl font-semibold text-sky-700 dark:text-sky-400">
                            10. Limitation of Liability
                        </h2>
                        <p>
                            WindSMS shall not be liable for indirect,
                            incidental, or consequential damages resulting from
                            service interruptions, data loss, or unauthorized
                            access. Your use of the platform is at your own
                            risk.
                        </p>
                    </div>

                    <div>
                        <h2 className="mb-3 text-2xl font-semibold text-sky-700 dark:text-sky-400">
                            11. Indemnification
                        </h2>
                        <p>
                            You agree to indemnify and hold WindSMS harmless
                            from any claims, damages, or expenses arising from
                            your misuse of the service, content sent through the
                            platform, or violation of applicable laws.
                        </p>
                    </div>

                    <div>
                        <h2 className="mb-3 text-2xl font-semibold text-sky-700 dark:text-sky-400">
                            12. Modifications to Terms
                        </h2>
                        <p>
                            WindSMS may modify these Terms at any time. Updates
                            will be posted on this page with a revised “Last
                            Updated” date. Continued use after changes indicates
                            your acceptance of the new Terms.
                        </p>
                    </div>

                    <div>
                        <h2 className="mb-3 text-2xl font-semibold text-sky-700 dark:text-sky-400">
                            13. Governing Law
                        </h2>
                        <p>
                            These Terms are governed by the laws of the Federal
                            Republic of Nigeria. Any disputes shall be resolved
                            exclusively in Nigerian courts of competent
                            jurisdiction.
                        </p>
                    </div>

                    <div>
                        <h2 className="mb-3 text-2xl font-semibold text-sky-700 dark:text-sky-400">
                            14. Contact Us
                        </h2>
                        <div className="space-y-2">
                            <p className="flex items-center gap-2">
                                <Shield className="h-5 w-5 text-sky-600 dark:text-sky-400" />
                                <span>support@windsms.com</span>
                            </p>
                            <p>
                                For questions about these Terms, please contact
                                us at{' '}
                                <a
                                    href="mailto:support@windsms.com"
                                    className="text-sky-600 underline dark:text-sky-400"
                                >
                                    support@windsms.com
                                </a>
                                .
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
