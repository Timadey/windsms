import { Mail, MapPin, Phone, Send } from "lucide-react";
import { useState } from "react";

export const ContactSection = () => {
    const [form, setForm] = useState({ name: "", email: "", message: "" });

    const handleChange = (e) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = (e) => {
        e.preventDefault();
        alert("Message sent! We’ll get back to you soon.");
        setForm({ name: "", email: "", message: "" });
    };

    return (
        <section
            id="contact"
            className="relative bg-gradient-to-b from-white to-sky-50 dark:from-gray-950 dark:to-gray-900 py-20 md:py-24"
        >
            <div className="mx-auto max-w-6xl px-6">
                {/* Header */}
                <div className="text-center mb-14">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white md:text-5xl">
                        Get in Touch
                    </h2>
                    <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
                        Have a question, partnership idea, or need help with your account?
                        We’re here to help — reach out anytime.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    {/* Contact Info */}
                    <div className="space-y-8">
                        <div>
                            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
                                Contact Information
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-6">
                                Reach us directly through any of the channels below.
                            </p>
                            <ul className="space-y-4">
                                <li className="flex items-center gap-3">
                                    <Phone className="h-5 w-5 text-sky-600" />
                                    <span className="text-gray-700 dark:text-gray-300">
                    +234 907 977 2482
                  </span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <Mail className="h-5 w-5 text-sky-600" />
                                    <span className="text-gray-700 dark:text-gray-300">
                    support@windsms.com
                  </span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <MapPin className="h-5 w-5 text-sky-600" />
                                    <span className="text-gray-700 dark:text-gray-300">
                    Ikeja, Lagos, Nigeria
                  </span>
                                </li>
                            </ul>
                        </div>

                        <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
                            <h4 className="text-md font-medium text-gray-800 dark:text-gray-200 mb-2">
                                Prefer WhatsApp?
                            </h4>
                            <a
                                href="https://wa.me/2349079772482"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 rounded-md bg-sky-600 px-5 py-2.5 text-white hover:bg-sky-700 transition"
                            >
                                <Send className="h-4 w-4" />
                                Chat on WhatsApp
                            </a>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="bg-white dark:bg-gray-950 shadow-lg rounded-2xl p-8 border border-gray-100 dark:border-gray-800">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Name */}
                            <div>
                                <label
                                    htmlFor="name"
                                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                                >
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={form.name}
                                    onChange={handleChange}
                                    required
                                    className="mt-2 w-full rounded-md border border-gray-300 dark:border-gray-700 bg-transparent px-4 py-2 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                                />
                            </div>

                            {/* Email */}
                            <div>
                                <label
                                    htmlFor="email"
                                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                                >
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    required
                                    className="mt-2 w-full rounded-md border border-gray-300 dark:border-gray-700 bg-transparent px-4 py-2 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                                />
                            </div>

                            {/* Message */}
                            <div>
                                <label
                                    htmlFor="message"
                                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                                >
                                    Message
                                </label>
                                <textarea
                                    id="message"
                                    name="message"
                                    value={form.message}
                                    onChange={handleChange}
                                    required
                                    rows={5}
                                    placeholder="Tell us how we can help..."
                                    className="mt-2 w-full rounded-md border border-gray-300 dark:border-gray-700 bg-transparent px-4 py-2 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                                />
                            </div>

                            {/* Button */}
                            <button
                                type="submit"
                                className="inline-flex items-center justify-center w-full rounded-md bg-sky-600 px-6 py-3 text-white font-medium hover:bg-sky-700 transition"
                            >
                                <Send className="h-4 w-4 mr-2" />
                                Send Message
                            </button>
                        </form>
                    </div>

                </div>
            </div>
        </section>
    );
};
