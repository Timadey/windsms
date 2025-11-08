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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from '@inertiajs/react';
import { AlertCircle, Check, ShoppingCart } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function SubscribePlanDialog({ open, onOpenChange, plan }) {
    const [uPlan] = useState(plan);
    const [step, setStep] = useState(1); // Step 1: Customization, Step 2: Payment

    const form = useForm({
        plan_id: uPlan?.id || '',
        extra_sms_units: 0,
        payment_method: 'card',
    });

    useEffect(() => {
        if (plan?.id) {
            form.setData('plan_id', plan.id);
        }
    }, [plan?.id]);

    if (!plan) return null;

    console.log(plan);

    const smsFeature = plan.features?.find((f) => f.name === 'sms-units');
    const baseSmsUnits = smsFeature?.charges || 0;
    const basePrice = plan.price;
    const extraSmsPrice = plan.extra_sms_price || 0;

    const extraSmsCost = form.data.extra_sms_units * extraSmsPrice;
    const totalAmount = basePrice + extraSmsCost;
    const totalSmsUnits = baseSmsUnits + form.data.extra_sms_units;

    const handleNext = () => setStep(2);
    const handleBack = () => setStep(1);
    const handleClose = () => {
        onOpenChange(false);
        setStep(1);
        form.reset();
    };

    const handleSubmit = () => {
        form.post('/billing/subscribe', {
            onSuccess: () => {
                handleClose();
            },
        });
    };

    const planTitle =
        plan.name.charAt(0).toUpperCase() +
        plan.name.slice(1).replace('-', ' ');
    const period = plan.periodicity_type?.toLowerCase() || 'month';

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-semibold">
                        {step === 1 ? 'Subscribe to Plan' : 'Review & Confirm'}
                    </DialogTitle>
                    <DialogDescription>
                        {step === 1
                            ? `Customize your ${planTitle} plan subscription`
                            : 'Review your order details before completing payment'}
                    </DialogDescription>
                </DialogHeader>

                {/* Step 1 — Customize Plan */}
                {step === 1 && (
                    <div className="space-y-6">
                        {/* Plan Summary */}
                        <Card className="border-2 border-blue-500">
                            <CardContent className="pt-6">
                                <div className="mb-4 flex items-start justify-between">
                                    <div>
                                        <h3 className="text-xl font-bold">
                                            {planTitle} Plan
                                        </h3>
                                        <p className="text-sm text-gray-500 capitalize">
                                            {plan.periodicity_type}ly
                                            subscription
                                        </p>
                                    </div>
                                    <Badge className="px-3 py-1 text-lg">
                                        ₦{basePrice.toLocaleString()}
                                    </Badge>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-sm">
                                        <Check className="h-4 w-4 text-green-500" />
                                        <span>
                                            {baseSmsUnits.toLocaleString()} free
                                            SMS/{period.toLowerCase()}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <Check className="h-4 w-4 text-green-500" />
                                        <span>
                                            ₦{extraSmsPrice}/extra SMS unit
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

                        {/* Extra SMS Units */}
                        <div>
                            <Label
                                htmlFor="extra_sms_units"
                                className="text-base font-semibold"
                            >
                                Add Extra SMS Units (Optional)
                            </Label>
                            <p className="mb-3 text-sm text-gray-500">
                                Purchase additional SMS units at ₦
                                {extraSmsPrice} per unit
                            </p>

                            <div className="flex gap-3">
                                <Input
                                    id="extra_sms_units"
                                    type="number"
                                    min="0"
                                    step="10"
                                    placeholder="0"
                                    value={form.data.extra_sms_units}
                                    onChange={(e) =>
                                        form.setData(
                                            'extra_sms_units',
                                            parseInt(e.target.value) || 0,
                                        )
                                    }
                                    className="text-lg"
                                />
                                <div className="flex gap-2">
                                    {[100, 500, 1000].map((count) => (
                                        <Button
                                            key={count}
                                            type="button"
                                            variant="outline"
                                            onClick={() =>
                                                form.setData(
                                                    'extra_sms_units',
                                                    (form.data
                                                        .extra_sms_units || 0) +
                                                        count,
                                                )
                                            }
                                        >
                                            +{count}
                                        </Button>
                                    ))}
                                </div>
                            </div>

                            {form.data.extra_sms_units > 0 && (
                                <p className="mt-2 text-sm text-green-600">
                                    ✓ Adding {form.data.extra_sms_units} extra
                                    SMS units for ₦
                                    {extraSmsCost.toLocaleString()}
                                </p>
                            )}
                        </div>

                        {/* Summary Box */}
                        <Card className="bg-gray-50">
                            <CardContent className="pt-6">
                                <h4 className="mb-3 font-semibold">
                                    Order Summary
                                </h4>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span>{planTitle} Plan</span>
                                        <span className="font-medium">
                                            ₦{basePrice.toLocaleString()}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-gray-600">
                                        <span>Includes {baseSmsUnits} SMS</span>
                                        <span>Free</span>
                                    </div>
                                    {form.data.extra_sms_units > 0 && (
                                        <div className="flex justify-between">
                                            <span>
                                                Extra SMS (
                                                {form.data.extra_sms_units}{' '}
                                                units)
                                            </span>
                                            <span className="font-medium">
                                                ₦{extraSmsCost.toLocaleString()}
                                            </span>
                                        </div>
                                    )}
                                    <div className="mt-2 flex justify-between border-t pt-2 text-base font-bold">
                                        <span>Total Amount</span>
                                        <span className="text-blue-600">
                                            ₦{totalAmount.toLocaleString()}
                                        </span>
                                    </div>
                                    <div className="flex justify-between font-medium text-green-600">
                                        <span>Total SMS Units</span>
                                        <span>
                                            {totalSmsUnits.toLocaleString()} SMS
                                        </span>
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
                            >
                                Cancel
                            </Button>
                            <Button
                                type="button"
                                className="flex-1"
                                onClick={handleNext}
                            >
                                Continue to Payment
                            </Button>
                        </div>
                    </div>
                )}

                {/* Step 2 — Payment */}
                {step === 2 && (
                    <div className="space-y-6">
                        <Card className="border-2 border-blue-500">
                            <CardContent className="pt-6">
                                <div className="mb-4 flex items-center gap-2">
                                    <ShoppingCart className="h-5 w-5 text-blue-600" />
                                    <h3 className="text-lg font-bold">
                                        Order Details
                                    </h3>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex justify-between border-b py-2">
                                        <div>
                                            <p className="font-semibold">
                                                {planTitle} Plan
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                {plan.periodicity_type}ly
                                                subscription
                                            </p>
                                        </div>
                                        <p className="font-bold">
                                            ₦{basePrice.toLocaleString()}
                                        </p>
                                    </div>

                                    {form.data.extra_sms_units > 0 && (
                                        <div className="flex justify-between border-b py-2">
                                            <div>
                                                <p className="font-semibold">
                                                    Extra SMS Units
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    {form.data.extra_sms_units}{' '}
                                                    units @ ₦{extraSmsPrice}{' '}
                                                    each
                                                </p>
                                            </div>
                                            <p className="font-bold">
                                                ₦{extraSmsCost.toLocaleString()}
                                            </p>
                                        </div>
                                    )}

                                    <div className="flex justify-between rounded-lg bg-blue-50 px-4 py-3">
                                        <div>
                                            <p className="text-lg font-bold">
                                                Total Amount
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                You'll receive{' '}
                                                {totalSmsUnits.toLocaleString()}{' '}
                                                SMS units
                                            </p>
                                        </div>
                                        <p className="text-2xl font-bold text-blue-600">
                                            ₦{totalAmount.toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Notice */}
                        <Card className="border-blue-200 bg-blue-50">
                            <CardContent className="pt-6">
                                <div className="flex gap-3">
                                    <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-600" />
                                    <div className="space-y-1 text-sm">
                                        <p className="font-semibold text-blue-900">
                                            Before you proceed:
                                        </p>
                                        <ul className="list-inside list-disc space-y-1 text-blue-800">
                                            <li>
                                                Subscription activates
                                                immediately after payment
                                            </li>
                                            <li>
                                                SMS units are credited instantly
                                            </li>
                                            <li>
                                                Auto-renews on the same date
                                            </li>
                                            <li>
                                                Cancel anytime; access continues
                                                until period ends
                                            </li>
                                        </ul>
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
                                onClick={handleBack}
                                disabled={form.processing}
                            >
                                Back
                            </Button>
                            <Button
                                type="button"
                                className="flex-1"
                                onClick={handleSubmit}
                                disabled={form.processing}
                            >
                                {form.processing
                                    ? 'Processing...'
                                    : `Pay ₦${totalAmount.toLocaleString()}`}
                            </Button>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
