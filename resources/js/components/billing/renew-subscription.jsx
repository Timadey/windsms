import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { useForm } from '@inertiajs/react';
import { AlertCircle, Check, RefreshCw } from 'lucide-react';
import billing from '../../routes/billing/index.ts';

export default function RenewSubscriptionDialog({
    open,
    onOpenChange,
    subscription,
}) {
    const form = useForm({});

    if (!subscription) return null;

    const plan = subscription.plan;
    const smsFeature = plan.features?.find((f) => f.name === 'sms-units');
    const smsUnits = smsFeature?.pivot.charges || 0;
    const price = getPlanPrice(plan.name);
    const period = plan.periodicity_type?.toLowerCase() || 'month';

    const handleClose = () => {
        onOpenChange(false);
        form.reset();
    };

    const handleSubmit = () => {
        form.post(billing.renew().url, {
            onSuccess: () => {
                handleClose();
            },
        });
    };

    const planTitle =
        plan.name.charAt(0).toUpperCase() +
        plan.name.slice(1).replace(/-/g, ' ');

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-2xl font-semibold">
                        <RefreshCw className="h-6 w-6 text-blue-600" />
                        Renew Subscription
                    </DialogTitle>
                    <DialogDescription>
                        Reactivate your subscription and restore full access
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Plan Details */}
                    <Card className="border-2 border-blue-500">
                        <CardContent className="pt-6">
                            <div className="mb-4 flex items-start justify-between">
                                <div>
                                    <h3 className="text-xl font-bold">
                                        {planTitle} Plan
                                    </h3>
                                    <p className="text-sm text-gray-500 capitalize">
                                        {period}ly subscription
                                    </p>
                                </div>
                                <Badge className="px-3 py-1 text-lg">
                                    ₦{price.toLocaleString()}
                                </Badge>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-sm">
                                    <Check className="h-4 w-4 text-green-500" />
                                    <span>
                                        {smsUnits.toLocaleString()} SMS units/
                                        {period.toLowerCase()}
                                    </span>
                                </div>

                                {plan.features
                                    ?.filter((f) => f.name !== 'sms-units')
                                    .map((feature, idx) => (
                                        <div
                                            key={idx}
                                            className="flex items-center gap-2 text-sm"
                                        >
                                            <Check className="h-4 w-4 text-green-500" />
                                            <span className="capitalize">
                                                {feature.name.replace(
                                                    /-/g,
                                                    ' ',
                                                )}
                                                {feature.charges &&
                                                    ` (${feature.charges})`}
                                            </span>
                                        </div>
                                    ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Renewal Benefits */}
                    <Card className="border-green-200 bg-green-50">
                        <CardContent className="pt-6">
                            <h4 className="mb-3 font-semibold text-green-900">
                                ✨ What happens when you renew:
                            </h4>
                            <ul className="space-y-2 text-sm text-green-800">
                                <li className="flex items-start gap-2">
                                    <Check className="mt-0.5 h-4 w-4 flex-shrink-0" />
                                    <span>
                                        Immediate access restoration to all
                                        features
                                    </span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <Check className="mt-0.5 h-4 w-4 flex-shrink-0" />
                                    <span>
                                        Fresh allocation of{' '}
                                        {smsUnits.toLocaleString()} SMS units
                                    </span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <Check className="mt-0.5 h-4 w-4 flex-shrink-0" />
                                    <span>
                                        Any existing SMS balance is preserved
                                        and added on top
                                    </span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <Check className="mt-0.5 h-4 w-4 flex-shrink-0" />
                                    <span>
                                        New {period}ly billing cycle starts
                                        immediately
                                    </span>
                                </li>
                            </ul>
                        </CardContent>
                    </Card>

                    {/* Payment Summary */}
                    <Card className="border-blue-200 bg-blue-50">
                        <CardContent className="pt-6">
                            <div className="flex items-start gap-3">
                                <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-600" />
                                <div className="flex-1">
                                    <p className="mb-2 font-semibold text-blue-900">
                                        Payment Details:
                                    </p>
                                    <div className="space-y-2 text-sm text-blue-800">
                                        <div className="flex justify-between">
                                            <span>
                                                {planTitle} Plan ({period}ly)
                                            </span>
                                            <span className="font-medium">
                                                ₦{price.toLocaleString()}
                                            </span>
                                        </div>
                                        <div className="flex justify-between border-t border-blue-200 pt-2 text-base font-bold">
                                            <span>Total Due</span>
                                            <span className="text-blue-600">
                                                ₦{price.toLocaleString()}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Actions */}
                    <div className="flex gap-3 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            className="flex-1"
                            onClick={handleClose}
                            disabled={form.processing}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            className="flex-1"
                            onClick={handleSubmit}
                            disabled={form.processing}
                        >
                            {form.processing
                                ? 'Processing...'
                                : `Renew for ₦${price.toLocaleString()}`}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

function getPlanPrice(planName) {
    const prices = {
        free: 0,
        // 'starter-yearly': 3000 * 12 * 0.85,
        pro: 4998.98,
        'pro-yearly': 4998.98 * 12 * 0.85,
        business: 9997.99,
        'business-yearly': 9997.99 * 12 * 0.85,
        enterprise: 19995.99,
        'enterprise-yearly': 19995.99 * 12 * 0.85,
    };
    return prices[planName] || 0;
}
