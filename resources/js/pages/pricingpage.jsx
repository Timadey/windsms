import { Head } from '@inertiajs/react';
import PricingSection from '../components/landing/pricing.jsx';
import Header from '../components/landing/header.jsx';
import Footer from '../components/landing/footer.jsx';

export default function PricingPage() {
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
                <Header />
                <PricingSection />
                <Footer />
            </div>
        </>
    );
}
