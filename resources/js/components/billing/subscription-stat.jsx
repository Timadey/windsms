import { Badge } from '../ui/badge.jsx';
import { Button } from '../ui/button.jsx';
import BillingStat from './billing-stats.jsx';
import billing from '../../routes/billing/index.ts';
import { Link } from '@inertiajs/react';
import { Zap, CreditCard, RefreshCw } from 'lucide-react';

export function SubscriptionStat({
                                     normalizedSubscription,
                                     smsBalance,
                                     onBuyExtraSms,
                                     onRenew
                                 }) {
    const isActive = normalizedSubscription?.is_active;
    const daysRemaining = normalizedSubscription?.days_remaining || 0;
    const isExpiringSoon = isActive && daysRemaining <= 7; // Show renew button if expires in 7 days or less

    const planName = normalizedSubscription
        ? normalizedSubscription.plan.name.replace('-yearly', '')
        : 'No Plan';

    const subscriptionDescription = normalizedSubscription
        ? isActive
            ? `${daysRemaining} day${daysRemaining !== 1 ? 's' : ''} remaining`
            : 'Expired — Renew to continue'
        : 'Subscribe to start sending campaigns';

    return (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {/* SMS BALANCE */}
            <BillingStat
                title="SMS Balance"
                value={smsBalance?.toLocaleString() || 0}
                description="Available SMS units"
                icon={Zap}
                action={
                    isActive ? (
                        onBuyExtraSms ? (
                            <Button
                                size="sm"
                                variant="outline"
                                className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                                onClick={onBuyExtraSms}
                            >
                                Buy More Units
                            </Button>
                        ) : (
                            <Link href={billing.index().url}>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                                >
                                    Buy More Units
                                </Button>
                            </Link>
                        )
                    ) : null
                }
            />

            {/* SUBSCRIPTION INFO */}
            <BillingStat
                title="Subscription"
                value={
                    <div className="flex items-center gap-2">
                        <span className="capitalize">{planName}</span>

                        {normalizedSubscription && (
                            <Badge
                                variant={isActive ? 'default' : 'destructive'}
                            >
                                {isActive ? 'Active' : 'Expired'}
                            </Badge>
                        )}
                    </div>
                }
                description={subscriptionDescription}
                icon={CreditCard}
                action={
                    <div className="flex gap-2">
                        {/* Show Renew button if expiring soon or expired */}
                        {normalizedSubscription && (isExpiringSoon || !isActive) && onRenew && (
                            <Button
                                size="sm"
                                variant={isExpiringSoon ? 'default' : 'outline'}
                                className={isExpiringSoon ? 'gap-1.5' : 'gap-1.5 border-primary text-primary hover:bg-primary hover:text-primary-foreground'}
                                onClick={onRenew}
                            >
                                <RefreshCw className="h-3.5 w-3.5" />
                                Renew Now
                            </Button>
                        )}

                        {/* Manage Subscription / View Plans button */}
                        <Link href={billing.index().url}>
                            <Button
                                size="sm"
                                variant="outline"
                                className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                            >
                                {normalizedSubscription
                                    ? 'Manage Subscription'
                                    : 'View Plans'}
                            </Button>
                        </Link>
                    </div>
                }
            />
        </div>
    );
}
