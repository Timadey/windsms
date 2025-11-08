import { Head } from '@inertiajs/react';
import { useState } from 'react';
import { CreditCard, Zap, Check, TrendingUp, AlertTriangle, X, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
// import { Progress } from '@/components/ui/progress';
import AppLayout from '@/layouts/app-layout';
// import SubscribePlanDialog from '@/components/billing/SubscribePlanDialog';
// import BuyExtraSmsDialog from '@/components/billing/BuyExtraSmsDialog';
// import RenewSubscriptionDialog from '@/components/billing/RenewSubscriptionDialog';
// import CancelSubscriptionDialog from '@/components/billing/CancelSubscriptionDialog';
import SubscribePlanDialog from '../../components/billing/subscribe.jsx';

export default function BillingIndex({
                                         plans,
                                         currentSubscription,
                                         featureUsage,
                                         smsBalance,
                                         transactions,
                                         extraSmsPrice
                                     }) {
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [showSubscribeDialog, setShowSubscribeDialog] = useState(false);
    const [showExtraUnitsDialog, setShowExtraUnitsDialog] = useState(false);
    const [showRenewDialog, setShowRenewDialog] = useState(false);
    const [showCancelDialog, setShowCancelDialog] = useState(false);

    const openSubscribeDialog = (plan) => {
        setSelectedPlan(plan);
        setShowSubscribeDialog(true);
    };

    // console.log(plans);

    const getPlanDetails = (planName) => {
        const details = {
            'starter': { title: 'Starter', subtitle: 'Individuals, Micro Businesses', price: 3000, sms: 610 },
            'pro': { title: 'Pro', subtitle: 'SMEs, Marketers', price: 5000, sms: 1050, popular: true },
            'business': { title: 'Business', subtitle: 'High-volume Businesses', price: 10000, sms: 2200 },
            'enterprise': { title: 'Enterprise', subtitle: 'Agencies, Enterprises', price: 20000, sms: 4600 },
        };

        const baseName = planName?.replace('-yearly', '') || '';
        return details[baseName] || {};
    };

    const breadcrumbs = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Billing', href: '/billing' },
    ];

    const isSubscriptionExpiringSoon = currentSubscription?.is_active && currentSubscription?.days_remaining <= 7;

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
                {(!currentSubscription || !currentSubscription.is_active) && (
                    <Card className="border-red-500 bg-red-50">
                        <CardContent className="pt-6">
                            <div className="flex items-start gap-3">
                                <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                                <div className="flex-1">
                                    <h3 className="font-semibold text-red-900">No Active Subscription</h3>
                                    <p className="text-sm text-red-700 mt-1">
                                        Subscribe to a plan below to start sending campaigns and accessing all features.
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {isSubscriptionExpiringSoon && (
                    <Card className="border-orange-500 bg-orange-50">
                        <CardContent className="pt-6">
                            <div className="flex items-start gap-3">
                                <AlertTriangle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                                <div className="flex-1">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h3 className="font-semibold text-orange-900">Subscription Expiring Soon</h3>
                                            <p className="text-sm text-orange-700 mt-1">
                                                Your subscription expires in {currentSubscription.days_remaining} days. Renew now to continue enjoying uninterrupted service.
                                            </p>
                                        </div>
                                        <Button size="sm" onClick={() => setShowRenewDialog(true)}>
                                            Renew Now
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Current Subscription Status */}
                {currentSubscription && (
                    <Card className={currentSubscription.is_active ? 'border-green-500' : 'border-orange-500'}>
                        <CardHeader>
                            <div className="flex items-start justify-between">
                                <div>
                                    <CardTitle className="flex items-center gap-2">
                                        Current Subscription
                                        <Badge variant={currentSubscription.is_active ? 'default' : 'destructive'}>
                                            {currentSubscription.is_active ? 'Active' : 'Expired'}
                                        </Badge>
                                        {currentSubscription.is_suppressed && (
                                            <Badge variant="outline" className="bg-orange-100">
                                                Cancelling on expiry
                                            </Badge>
                                        )}
                                    </CardTitle>
                                    <CardDescription className="mt-2">
                                        Plan: <span className="font-semibold capitalize">{getPlanDetails(currentSubscription.plan).title}</span>
                                    </CardDescription>
                                </div>
                                <div className="flex gap-2">
                                    {currentSubscription.is_active && !currentSubscription.is_suppressed && (
                                        <Button variant="outline" size="sm" onClick={() => setShowCancelDialog(true)}>
                                            <X className="w-4 h-4 mr-2" />
                                            Cancel
                                        </Button>
                                    )}
                                    {(currentSubscription.is_suppressed || !currentSubscription.is_active) && (
                                        <Button size="sm" onClick={() => setShowRenewDialog(true)}>
                                            <RefreshCw className="w-4 h-4 mr-2" />
                                            Renew
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <p className="text-sm text-gray-500">Started</p>
                                    <p className="font-medium">{new Date(currentSubscription.started_at).toLocaleDateString()}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Expires</p>
                                    <p className="font-medium">{new Date(currentSubscription.expires_at).toLocaleDateString()}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Days Remaining</p>
                                    <p className="font-medium flex items-center gap-2">
                                        {currentSubscription.days_remaining > 0 ? currentSubscription.days_remaining : 0} days
                                        {currentSubscription.days_remaining <= 7 && currentSubscription.days_remaining > 0 && (
                                            <AlertTriangle className="w-4 h-4 text-orange-500" />
                                        )}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* SMS Balance */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="flex items-center gap-2">
                                    <Zap className="w-5 h-5 text-yellow-500" />
                                    SMS Units Balance
                                </CardTitle>
                                <CardDescription className="mt-1">Available SMS credits</CardDescription>
                            </div>
                            {currentSubscription?.is_active && (
                                <Button onClick={() => setShowExtraUnitsDialog(true)}>
                                    Buy Extra Units
                                </Button>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-bold text-blue-600">{smsBalance?.toLocaleString() || 0}</div>
                        <p className="text-sm text-gray-500 mt-1">SMS units available</p>
                    </CardContent>
                </Card>

                {/* Feature Usage */}
                {featureUsage && featureUsage.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Feature Usage</CardTitle>
                            <CardDescription>Current billing period consumption</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {featureUsage.map((feature, idx) => (
                                <div key={idx}>
                                    <div className="flex justify-between mb-2">
                                        <span className="font-medium capitalize">{feature.name.replace(/-/g, ' ')}</span>
                                        <span className="text-sm text-gray-600">
                      {feature.consumed.toLocaleString()} / {feature.total.toLocaleString()}
                    </span>
                                    </div>
                                    {/*<Progress value={feature.percentage} className="h-2" />*/}
                                    <p className="text-xs text-gray-500 mt-1">
                                        {feature.remaining.toLocaleString()} remaining ({feature.percentage}% used)
                                    </p>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                )}

                {/* Available Plans */}
                <div>
                    <h2 className="text-2xl font-bold mb-6">
                        {currentSubscription?.is_active ? 'Upgrade or Change Plan' : 'Choose Your Plan'}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {plans.filter(p => !p.is_yearly).map((plan) => {
                            const details = getPlanDetails(plan.name);
                            const smsFeature = plan.features.find(f => f.name === 'sms-units');
                            const contactsFeature = plan.features.find(f => f.name === 'contacts-upload');
                            const senderIdFeature = plan.features.find(f => f.name === 'sender-id');
                            const tagsFeature = plan.features.find(f => f.name === 'tags');
                            const isCurrentPlan = currentSubscription?.plan === plan.name;

                            return (
                                <Card
                                    key={plan.id}
                                    className={`relative ${details.popular ? 'border-blue-500 shadow-lg' : ''} ${isCurrentPlan ? 'border-green-500' : ''}`}
                                >
                                    {details.popular && !isCurrentPlan && (
                                        <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
                                            Most Popular
                                        </Badge>
                                    )}
                                    {isCurrentPlan && (
                                        <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-green-500">
                                            Current Plan
                                        </Badge>
                                    )}
                                    <CardHeader>
                                        <CardTitle>{details.title}</CardTitle>
                                        <CardDescription>{details.subtitle}</CardDescription>
                                        <div className="mt-4">
                                            <span className="text-3xl font-bold">₦{details.price.toLocaleString()}</span>
                                            <span className="text-gray-500">/month</span>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <ul className="space-y-3 mb-6">
                                            <li className="flex items-start gap-2">
                                                <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                                                <span>{smsFeature?.charges || 0} Free SMS/month</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                                                <span>₦{extraSmsPrice}/Extra SMS Unit</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                                                <span>Campaign & Bulk Import</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                                                <span>{contactsFeature?.charges >= 200000000 ? 'Unlimited' : `${(contactsFeature?.charges / 1000).toLocaleString()}k`} monthly contacts</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                                                <span>{senderIdFeature?.charges >= 10000 ? 'Unlimited' : senderIdFeature?.charges} Sender ID{senderIdFeature?.charges > 1 ? 's' : ''}</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                                                <span>{tagsFeature?.charges >= 200000 ? 'Unlimited' : tagsFeature?.charges} tags</span>
                                            </li>
                                            {plan.features.find(f => f.name === 'api-access') && (
                                                <li className="flex items-start gap-2">
                                                    <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                                                    <span>API Access</span>
                                                </li>
                                            )}
                                            {plan.features.find(f => f.name === 'ai-mixer') && (
                                                <li className="flex items-start gap-2">
                                                    <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                                                    <span>AI Mixer</span>
                                                </li>
                                            )}
                                        </ul>
                                        <Button
                                            className="w-full"
                                            variant={isCurrentPlan ? 'outline' : details.popular ? 'default' : 'outline'}
                                            onClick={() => openSubscribeDialog(plan)}
                                            disabled={isCurrentPlan}
                                        >
                                            {isCurrentPlan ? 'Current Plan' : 'Subscribe'}
                                        </Button>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                </div>

                {/* Recent Transactions */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <TrendingUp className="w-5 h-5" />
                            Recent Transactions
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                <tr className="border-b">
                                    <th className="text-left py-3">Date</th>
                                    <th className="text-left py-3">Description</th>
                                    <th className="text-left py-3">Amount</th>
                                    <th className="text-left py-3">Status</th>
                                    <th className="text-left py-3">Method</th>
                                </tr>
                                </thead>
                                <tbody>
                                {transactions?.length > 0 ? (
                                    transactions.map((transaction) => (
                                        <tr key={transaction.id} className="border-b">
                                            <td className="py-3">
                                                {new Date(transaction.created_at).toLocaleDateString()}
                                            </td>
                                            <td className="py-3">{transaction.description}</td>
                                            <td className="py-3 font-medium">₦{transaction.amount.toLocaleString()}</td>
                                            <td className="py-3">
                                                <Badge
                                                    variant={
                                                        transaction.status === 'completed'
                                                            ? 'default'
                                                            : transaction.status === 'failed'
                                                                ? 'destructive'
                                                                : 'secondary'
                                                    }
                                                >
                                                    {transaction.status}
                                                </Badge>
                                            </td>
                                            <td className="py-3 capitalize">{transaction.payment_method.replace('_', ' ')}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="text-center py-8 text-gray-500">
                                            No transactions yet
                                        </td>
                                    </tr>
                                )}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Dialogs */}
            <SubscribePlanDialog
                open={showSubscribeDialog}
                onOpenChange={setShowSubscribeDialog}
                plan={selectedPlan}
                extraSmsPrice={extraSmsPrice}
            />

        </AppLayout>
    );
}
