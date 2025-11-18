import { Head, usePage } from '@inertiajs/react';
import FeaturesSection from '../components/landing/feature.jsx';
import TestimonialsSection from '../components/landing/testimonials.jsx';
import WhyUsSection from '../components/landing/whyus.jsx';
import HeroSection from '../components/landing/hero.jsx';
import { FAQSection } from '../components/landing/faq.jsx';
import { ContactSection } from '../components/landing/contactus.jsx';
import CtaSection from '../components/landing/cta.jsx';
import Header from '../components/landing/header.jsx';
import Footer from '../components/landing/footer.jsx';
import HowItWorks from '../components/landing/how-it-works.jsx';

export default function Welcome({ canRegister = true }) {
    const { auth } = usePage().props;

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
                {/* Navbar */}
                <Header />

                {/* Hero Section */}
                <HeroSection />
                <FeaturesSection />
                <HowItWorks />
                {/*<WhyUsSection />*/}
                <TestimonialsSection />
                <CtaSection />
                <FAQSection />
                <ContactSection />
                {/* Footer */}
                <Footer />
            </div>
        </>
    );
}
