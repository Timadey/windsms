import { Card, CardContent } from '../ui/card.jsx';
import { AlertTriangle } from 'lucide-react';
import { Button } from '../ui/button.jsx';

export function AlertBanners({ currentSubscription, onRenew }) {
    const isExpiringSoon =
        currentSubscription?.is_active &&
        currentSubscription?.days_remaining <= 7;
    if (!currentSubscription || !currentSubscription.is_active) {
        return (
            <Card className="border-red-500 bg-red-50">
                <CardContent className="pt-6">
                    <div className="flex items-start gap-3">
                        <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-600" />
                        <div className="flex-1">
                            <h3 className="font-semibold text-red-900">
                                No Active Subscription
                            </h3>
                            <p className="mt-1 text-sm text-red-700">
                                Subscribe to a plan below to start sending
                                campaigns and accessing all features.
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (isExpiringSoon) {
        return (
            <Card className="border-orange-500 bg-orange-50">
                <CardContent className="pt-6">
                    <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                            <AlertTriangle className="mt-0.5 h-5 w-5 text-orange-600" />
                            <div>
                                <h3 className="font-semibold text-orange-900">
                                    Subscription Expiring Soon
                                </h3>
                                <p className="mt-1 text-sm text-orange-700">
                                    Your subscription expires in{' '}
                                    {currentSubscription.days_remaining} days.
                                    Renew now to continue service.
                                </p>
                            </div>
                        </div>
                        <Button size="sm" onClick={onRenew}>
                            Renew Now
                        </Button>
                    </div>
                </CardContent>
            </Card>
        );
    }
    return null;
}
