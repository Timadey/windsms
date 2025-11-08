import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '../ui/card.jsx';
import { Badge } from '../ui/badge.jsx';
import { Button } from '../ui/button.jsx';
import { X } from 'lucide-react';

export function SubscriptionStatus({ subscription, onCancel, onRenew }) {
    // console.log(subscription);
    const isActive = subscription?.is_active;
    return (
        <Card className={isActive ? 'border-green-500' : 'border-orange-500'}>
            <CardHeader>
                <div className="flex items-start justify-between">
                    <div>
                        <CardTitle className="flex items-center gap-2">
                            Current Subscription
                            <Badge
                                variant={isActive ? 'default' : 'destructive'}
                            >
                                {isActive ? 'Active' : 'Expired'}
                            </Badge>
                            {subscription?.is_suppressed && (
                                <Badge
                                    variant="outline"
                                    className="bg-orange-100"
                                >
                                    Cancelling on expiry
                                </Badge>
                            )}
                        </CardTitle>
                        <CardDescription className="mt-2">
                            Plan:{' '}
                            <span className="font-semibold capitalize">
                                {subscription.plan}
                            </span>
                        </CardDescription>
                    </div>
                    <div className="flex gap-2">
                        {isActive && !subscription.is_suppressed && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={onCancel}
                            >
                                <X className="mr-2 h-4 w-4" /> Cancel
                            </Button>
                        )}
                        {(!isActive || subscription.is_suppressed) && (
                            <Button size="sm" onClick={onRenew}>
                                <RefreshCw className="mr-2 h-4 w-4" /> Renew
                            </Button>
                        )}
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <div>
                        <p className="text-sm text-gray-500">Started</p>
                        <p className="font-medium">
                            {new Date(
                                subscription.started_at,
                            ).toLocaleDateString()}
                        </p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Expires</p>
                        <p className="font-medium">
                            {new Date(
                                subscription.expires_at,
                            ).toLocaleDateString()}
                        </p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Days Remaining</p>
                        <p className="flex items-center gap-2 font-medium">
                            {subscription.days_remaining > 0
                                ? subscription.days_remaining
                                : 0}{' '}
                            days
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
