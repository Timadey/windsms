import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { useForm } from '@inertiajs/react';
import dayjs from 'dayjs';
import { AlertTriangle, X } from 'lucide-react';
import { useState } from 'react';
import billing from '../../routes/billing/index.ts';

export default function CancelSubscriptionDialog({
    open,
    onOpenChange,
    subscription,
}) {
    const [confirmed, setConfirmed] = useState(false);
    const form = useForm({});

    if (!subscription) return null;

    const plan = subscription.plan;
    const expiresAt = dayjs(subscription.expired_at);
    const daysRemaining = Math.max(0, expiresAt.diff(dayjs(), 'day'));

    const handleClose = () => {
        onOpenChange(false);
        setConfirmed(false);
        form.reset();
    };

    const handleSubmit = () => {
        form.post(billing.cancel().url, {
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
                    <DialogTitle className="flex items-center gap-2 text-2xl font-semibold text-red-600">
                        <X className="h-6 w-6" />
                        Cancel Subscription
                    </DialogTitle>
                    <DialogDescription>
                        We're sorry to see you go. Please review the details
                        below.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Warning Alert */}
                    <Card className="border-2 border-red-500 bg-red-50">
                        <CardContent className="pt-6">
                            <div className="flex gap-3">
                                <AlertTriangle className="mt-1 h-6 w-6 flex-shrink-0 text-red-600" />
                                <div className="space-y-2">
                                    <h4 className="font-semibold text-red-900">
                                        Before you cancel:
                                    </h4>
                                    <ul className="space-y-1 text-sm text-red-800">
                                        <li>
                                            • Your {planTitle} subscription will
                                            end on{' '}
                                            {expiresAt.format('MMMM D, YYYY')}
                                        </li>
                                        <li>
                                            • You have {daysRemaining} day
                                            {daysRemaining !== 1 ? 's' : ''} of
                                            access remaining
                                        </li>
                                        <li>
                                            • All features remain active until
                                            the end date
                                        </li>
                                        <li>
                                            • Unused SMS units will be lost
                                            after expiration
                                        </li>
                                        <li>
                                            • No refunds for the current billing
                                            period
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* What You'll Lose */}
                    <Card>
                        <CardContent className="pt-6">
                            <h4 className="mb-3 font-semibold text-gray-900">
                                What you'll lose access to:
                            </h4>
                            <div className="space-y-2">
                                {plan.features?.map((feature, idx) => (
                                    <div
                                        key={idx}
                                        className="flex items-center gap-2 text-sm text-gray-700"
                                    >
                                        <X className="h-4 w-4 flex-shrink-0 text-red-500" />
                                        <span className="capitalize">
                                            {feature.name.replace(/-/g, ' ')}
                                            {feature.charges &&
                                            feature.name === 'sms-units'
                                                ? ` (${feature.charges} units/${plan.periodicity_type?.toLowerCase() || 'month'})`
                                                : feature.charges &&
                                                  ` (${feature.charges})`}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Alternative Options */}
                    <Card className="border-blue-200 bg-blue-50">
                        <CardContent className="pt-6">
                            <h4 className="mb-3 font-semibold text-blue-900">
                                💡 Consider these alternatives:
                            </h4>
                            <ul className="space-y-2 text-sm text-blue-800">
                                <li>
                                    • <strong>Downgrade to a lower plan</strong>{' '}
                                    instead of canceling
                                </li>
                                <li>
                                    • <strong>Pause your campaigns</strong> and
                                    keep minimal usage
                                </li>
                                <li>
                                    • <strong>Contact support</strong> if you're
                                    having issues
                                </li>
                            </ul>
                        </CardContent>
                    </Card>

                    {/* Confirmation Checkbox */}
                    <div className="flex items-start gap-3 rounded-lg border-2 border-gray-200 bg-white p-4">
                        <Checkbox
                            id="confirm-cancel"
                            checked={confirmed}
                            onCheckedChange={setConfirmed}
                            className="mt-1"
                        />
                        <label
                            htmlFor="confirm-cancel"
                            className="cursor-pointer text-sm leading-relaxed font-medium select-none"
                        >
                            I understand that my subscription will end on{' '}
                            <strong>{expiresAt.format('MMMM D, YYYY')}</strong>{' '}
                            and I will lose access to all premium features after
                            this date. This action cannot be undone.
                        </label>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            className="flex-1"
                            onClick={handleClose}
                            disabled={form.processing}
                        >
                            Keep My Subscription
                        </Button>
                        <Button
                            type="button"
                            variant="destructive"
                            className="flex-1"
                            onClick={handleSubmit}
                            disabled={!confirmed || form.processing}
                        >
                            {form.processing
                                ? 'Canceling...'
                                : 'Yes, Cancel Subscription'}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
