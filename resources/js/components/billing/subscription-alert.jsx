import BillingAlert from './billing-alert.jsx';
import billing from '../../routes/billing/index.ts';

export function AlertBanners({ normalizedSubscription, smsBalance }) {
    const isSubscriptionExpiringSoon =
        normalizedSubscription?.is_active &&
        normalizedSubscription.days_remaining <= 7;

    const hasLowBalance = smsBalance < 100;

    const alerts = [];
    // TODO: HIDE THIS ACTION URLS IF URL IS ALREADY AT BILLING INDEX
    // No active subscription
    if (!normalizedSubscription || !normalizedSubscription.is_active) {
        alerts.push({
            variant: 'error',
            title: 'No Active Subscription',
            message:
                'You need an active subscription to send SMS campaigns. Subscribe to a plan to get started.',
            actionText: 'View Plans',
            actionUrl: billing.index().url,
        });
    }

    // Subscription expiring soon
    if (isSubscriptionExpiringSoon) {
        alerts.push({
            variant: 'warning',
            title: 'Subscription Expiring Soon',
            message: `Your subscription expires in ${normalizedSubscription.days_remaining} days. Renew now to avoid service interruption.`,
            actionText: 'Renew Subscription',
            actionUrl: billing.index().url,
        });
    }

    // Low SMS balance
    if (hasLowBalance && normalizedSubscription?.is_active) {
        alerts.push({
            variant: 'attention',
            title: 'Low SMS Balance',
            message: `You have only ${smsBalance} SMS units remaining. Purchase more to continue sending sms.`,
            actionText: 'Buy SMS Units',
            actionUrl: billing.index().url,
        });
    }

    // If there are no alerts, return nothing
    if (alerts.length === 0) return null;

    return (
        <div className="space-y-4">
            {alerts.map((alert, i) => (
                <BillingAlert key={i} {...alert} />
            ))}
        </div>
    );
}
