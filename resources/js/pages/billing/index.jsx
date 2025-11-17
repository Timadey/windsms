import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import dayjs from 'dayjs';
import { Plus, RefreshCw, X } from 'lucide-react';
import { useState } from 'react';
import BuyExtraSmsDialog from '../../components/billing/buy-extra-sms.jsx';
import CancelSubscriptionDialog from '../../components/billing/cancel-subscription.jsx';
import { FeatureUsage } from '../../components/billing/feature-usage.jsx';
import { PlanCards } from '../../components/billing/plan-cards.jsx';
import RenewSubscriptionDialog from '../../components/billing/renew-subscription.jsx';
import SubscribePlanDialog from '../../components/billing/subscribe.jsx';
import { AlertBanners } from '../../components/billing/subscription-alert.jsx';
import { SubscriptionStat } from '../../components/billing/subscription-stat.jsx';
import { TransactionHistory } from '../../components/billing/transaction-history.jsx';

export default function BillingIndex({
    plans,
    currentSubscription,
    featureUsage,
    smsBalance,
    transactions,
}) {
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [showSubscribeDialog, setShowSubscribeDialog] = useState(false);
    const [showBuyExtraSmsDialog, setShowBuyExtraSmsDialog] = useState(false);
    const [showRenewDialog, setShowRenewDialog] = useState(false);
    const [showCancelDialog, setShowCancelDialog] = useState(false);
    const [billingCycle, setBillingCycle] = useState('monthly'); // 'monthly' or 'yearly'

    const normalizedSubscription = currentSubscription
        ? {
              ...currentSubscription,
              is_active: currentSubscription.expired_at
                  ? dayjs().isBefore(dayjs(currentSubscription.expired_at))
                  : true,
              days_remaining: currentSubscription.expired_at
                  ? Math.max(
                        0,
                        dayjs(currentSubscription.expired_at).diff(
                            dayjs(),
                            'day',
                        ),
                    )
                  : 'forever',
          }
        : null;

    console.log(normalizedSubscription);


    const openSubscribeDialog = (plan) => {
        setSelectedPlan(plan);
        setShowSubscribeDialog(true);
    };

    const openBuyExtraSmsDialog = () => {
        setShowBuyExtraSmsDialog(true);
    };

    const openRenewDialog = () => {
        setShowRenewDialog(true);
    };

    const openCancelDialog = () => {
        setShowCancelDialog(true);
    };

    const breadcrumbs = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Billing', href: '/billing' },
    ];

    // Filter plans based on billing cycle
    const filteredPlans = plans.filter((plan) =>
        billingCycle === 'yearly' ? plan.is_yearly : !plan.is_yearly,
    );

    // Check if subscription can be renewed
    const canRenew =
        normalizedSubscription &&
        (
            (normalizedSubscription.expired_at && dayjs().isAfter(dayjs(normalizedSubscription.expired_at))) ||
            normalizedSubscription.days_remaining <= 7 ||
            normalizedSubscription.canceled_at ||
            normalizedSubscription.suppressed_at
        );

    // console.log(normalizedSubscription);

    // Check if user can buy extra SMS
    const canBuyExtraSms =
        normalizedSubscription && normalizedSubscription.is_active;

    // Check if user can cancel
    const canCancel =
        normalizedSubscription &&
        normalizedSubscription.plan.name !== 'free' &&
        normalizedSubscription.is_active &&
        !normalizedSubscription.canceled_at &&
        !normalizedSubscription.suppressed_at;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Billing & Subscription" />

            <div className="space-y-8 p-6">
                {/* Page Header */}
                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">
                            Billing & Subscription
                        </h1>
                        <p className="mt-1 text-gray-500">
                            Manage your subscription, SMS units, and payments
                        </p>
                    </div>

                    {/* Quick Actions */}
                    <div className="flex gap-3">
                        {canBuyExtraSms && (
                            <Button
                                onClick={openBuyExtraSmsDialog}
                                variant="outline"
                                className="gap-2"
                            >
                                <Plus className="h-4 w-4" />
                                Buy SMS Units
                            </Button>
                        )}

                        {canRenew && (
                            <Button
                                onClick={openRenewDialog}
                                variant="default"
                                className="gap-2 hidden md:block"
                            >
                                <RefreshCw className="h-4 w-4" />
                                Renew Subscription
                            </Button>
                        )}

                        {canCancel && (
                            <Button
                                onClick={openCancelDialog}
                                variant="destructive"
                                className="gap-2"
                            >
                                <X className="h-4 w-4" />
                                Cancel Subscription
                            </Button>
                        )}
                    </div>
                </div>

                {/* Alert Banners */}
                <AlertBanners
                    normalizedSubscription={normalizedSubscription}
                    smsBalance={smsBalance}
                />

                <SubscriptionStat
                    normalizedSubscription={normalizedSubscription}
                    smsBalance={smsBalance}
                    onBuyExtraSms={
                        canBuyExtraSms ? openBuyExtraSmsDialog : null
                    }
                    onRenew={canRenew ? openRenewDialog : null}
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

            {canBuyExtraSms && (
                <BuyExtraSmsDialog
                    open={showBuyExtraSmsDialog}
                    onOpenChange={setShowBuyExtraSmsDialog}
                    currentPlan={currentSubscription?.plan}
                />
            )}

            {canRenew && (
                <RenewSubscriptionDialog
                    open={showRenewDialog}
                    onOpenChange={setShowRenewDialog}
                    subscription={currentSubscription}
                />
            )}

            {canCancel && (
                <CancelSubscriptionDialog
                    open={showCancelDialog}
                    onOpenChange={setShowCancelDialog}
                    subscription={currentSubscription}
                />
            )}
        </AppLayout>
    );
}
