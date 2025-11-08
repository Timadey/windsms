import { Head } from '@inertiajs/react';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { AlertBanners } from '../../components/billing/subscription-alert.jsx';
import { SubscriptionStatus } from '../../components/billing/subscription-status.jsx';
import { SmsBalance } from '../../components/billing/sms-balance.jsx';
import { FeatureUsage } from '../../components/billing/feature-usage.jsx';
import { PlanCards } from '../../components/billing/plan-cards.jsx';
import { TransactionHistory } from '../../components/billing/transaction-history.jsx';
import SubscribePlanDialog from '../../components/billing/subscribe.jsx';
// import SubscriptionStatus from '@/components/billing/SubscriptionStatus';
// import AlertBanners from '@/components/billing/AlertBanners';
// import SmsBalance from '@/components/billing/SmsBalance';
// import FeatureUsage from '@/components/billing/FeatureUsage';
// import PlanCards from '@/components/billing/PlanCards';
// import TransactionHistory from '@/components/billing/TransactionHistory';
// import SubscribePlanDialog from '@/components/billing/SubscribePlanDialog';
// import BuyExtraUnitsDialog from '@/components/billing/BuyExtraUnitsDialog';
// import RenewSubscriptionDialog from '@/components/billing/RenewSubscriptionDialog';
// import CancelSubscriptionDialog from '@/components/billing/CancelSubscriptionDialog';

export default function BillingIndex({
                                         plans,
                                         currentSubscription,
                                         featureUsage,
                                         smsBalance,
                                         transactions,
                                     }) {
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [showSubscribeDialog, setShowSubscribeDialog] = useState(false);
    const [showExtraUnitsDialog, setShowExtraUnitsDialog] = useState(false);
    const [showRenewDialog, setShowRenewDialog] = useState(false);
    const [showCancelDialog, setShowCancelDialog] = useState(false);
    const [billingCycle, setBillingCycle] = useState('monthly'); // 'monthly' or 'yearly'

    const openSubscribeDialog = (plan) => {
        setSelectedPlan(plan);
        setShowSubscribeDialog(true);
    };

    const breadcrumbs = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Billing', href: '/billing' },
    ];

    // Filter plans based on billing cycle
    const filteredPlans = plans.filter(plan =>
        billingCycle === 'yearly' ? plan.is_yearly : !plan.is_yearly
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Billing & Subscription" />

            <div className="p-6 space-y-8">
                {/* Page Header */}
                <div>
                    <h1 className="text-3xl font-bold">Billing & Subscription</h1>
                    <p className="text-gray-500 mt-1">Manage your subscription, SMS units, and payment methods</p>
                </div>

                {/* Alert Banners */}
                <AlertBanners
                    currentSubscription={currentSubscription}
                    onRenew={() => setShowRenewDialog(true)}
                />

                {/* Current Subscription Status */}
                {currentSubscription && (
                    <SubscriptionStatus
                        subscription={currentSubscription}
                        onCancel={() => setShowCancelDialog(true)}
                        onRenew={() => setShowRenewDialog(true)}
                    />
                )}

                {/* SMS Balance */}
                <SmsBalance
                    balance={smsBalance}
                    hasActiveSubscription={currentSubscription?.is_active}
                    onBuyUnits={() => setShowExtraUnitsDialog(true)}
                />

                {/* Feature Usage */}
                {featureUsage && featureUsage.length > 0 && (
                    <FeatureUsage usage={featureUsage} />
                )}

                {/* Available Plans */}
                <PlanCards
                    plans={filteredPlans}
                    currentSubscription={currentSubscription}
                    billingCycle={billingCycle}
                    onBillingCycleChange={setBillingCycle}
                    onSelectPlan={openSubscribeDialog}
                />

                {/* Recent Transactions */}
                {transactions && (
                    <TransactionHistory transactions={transactions} />
                )}
            </div>

            {/* Dialogs */}
            <SubscribePlanDialog
                open={showSubscribeDialog}
                onOpenChange={setShowSubscribeDialog}
                plan={selectedPlan}
            />

            {/*<BuyExtraUnitsDialog*/}
            {/*    open={showExtraUnitsDialog}*/}
            {/*    onOpenChange={setShowExtraUnitsDialog}*/}
            {/*    subscription={currentSubscription}*/}
            {/*    extraSmsPrice={extraSmsPrice}*/}
            {/*/>*/}

            {/*<RenewSubscriptionDialog*/}
            {/*    open={showRenewDialog}*/}
            {/*    onOpenChange={setShowRenewDialog}*/}
            {/*    subscription={currentSubscription}*/}
            {/*/>*/}

            {/*<CancelSubscriptionDialog*/}
            {/*    open={showCancelDialog}*/}
            {/*    onOpenChange={setShowCancelDialog}*/}
            {/*    subscription={currentSubscription}*/}
            {/*/>*/}
        </AppLayout>
    );
}
