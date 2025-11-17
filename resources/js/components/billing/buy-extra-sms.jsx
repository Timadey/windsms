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
import { AlertCircle, ShoppingCart } from 'lucide-react';
import { useState } from 'react';
import billing from '../../routes/billing/index.ts';

export default function BuyExtraSmsDialog({ open, onOpenChange, currentPlan }) {
    const [step, setStep] = useState(1);

    const form = useForm({
        units: 1000,
    });

    if (!currentPlan) return null;
    // console.log(currentPlan);

    const extraSmsPrice = currentPlan.extra_sms_price || 5.0;
    const totalAmount = form.data.units * extraSmsPrice;

    const handleNext = () => setStep(2);
    const handleBack = () => setStep(1);
    const handleClose = () => {
        onOpenChange(false);
        setStep(1);
        form.reset();
    };

    const handleSubmit = () => {
        form.post(billing.extraUnits().url, {
            onSuccess: () => {
                handleClose();
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-semibold">
                        {step === 1 ? 'Buy Extra SMS Units' : 'Review & Confirm'}
                    </DialogTitle>
                    <DialogDescription>
                        {step === 1
                            ? 'Purchase additional SMS units for your account'
                            : 'Review your purchase before completing payment'}
                    </DialogDescription>
                </DialogHeader>

                {/* Step 1 — Select Units */}
                {step === 1 && (
                    <div className="space-y-6">
                        {/* Current Plan Info */}
                        <Card className="border-2 border-blue-500">
                            <CardContent className="pt-6">
                                <div className="mb-4 flex items-start justify-between">
                                    <div>
                                        <h3 className="text-xl font-bold capitalize">
                                            {currentPlan.name.replace(/-/g, ' ')}
                                        </h3>
                                        <p className="text-sm text-gray-500">
                                            Current Plan
                                        </p>
                                    </div>
                                    <Badge className="px-3 py-1">
                                        ₦{extraSmsPrice}/SMS
                                    </Badge>
                                </div>
                                <p className="text-sm text-gray-600">
                                    Extra SMS units are priced at ₦{extraSmsPrice} per unit for your plan
                                </p>
                            </CardContent>
                        </Card>

                        {/* Units Selection */}
                        <div>
                            <Label
                                htmlFor="units"
                                className="text-base font-semibold"
                            >
                                How many SMS units do you need?
                            </Label>
                            <p className="mb-3 text-sm text-gray-500">
                                Choose the number of extra SMS units to purchase
                            </p>

                            <div className="flex gap-3">
                                <Input
                                    id="units"
                                    type="number"
                                    min="1"
                                    step="10"
                                    placeholder="100"
                                    value={form.data.units}
                                    onChange={(e) =>
                                        form.setData(
                                            'units',
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
                                                form.setData('units', count)
                                            }
                                        >
                                            {count}
                                        </Button>
                                    ))}
                                </div>
                            </div>

                            {form.data.units > 0 && (
                                <div className="mt-4 space-y-2">
                                    <p className="text-sm text-green-600">
                                        ✓ Purchasing {form.data.units} SMS units
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        Total Cost: ₦{totalAmount.toLocaleString()}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Bulk Discount Info */}
                        <Card className="bg-green-50 border-green-200">
                            <CardContent className="pt-6">
                                <h4 className="mb-2 font-semibold text-green-900">
                                    💡 Pro Tip
                                </h4>
                                <p className="text-sm text-green-800">
                                    Buy in bulk to ensure you never run out of SMS credits.
                                    Unused units never expire and carry over to your next billing cycle.
                                </p>
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
                                disabled={form.data.units < 1}
                            >
                                Continue to Payment
                            </Button>
                        </div>
                    </div>
                )}

                {/* Step 2 — Payment Confirmation */}
                {step === 2 && (
                    <div className="space-y-6">
                        <Card className="border-2 border-blue-500">
                            <CardContent className="pt-6">
                                <div className="mb-4 flex items-center gap-2">
                                    <ShoppingCart className="h-5 w-5 text-blue-600" />
                                    <h3 className="text-lg font-bold">
                                        Purchase Summary
                                    </h3>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex justify-between border-b py-2">
                                        <div>
                                            <p className="font-semibold">
                                                Extra SMS Units
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                {form.data.units} units @ ₦{extraSmsPrice} each
                                            </p>
                                        </div>
                                        <p className="font-bold">
                                            ₦{totalAmount.toLocaleString()}
                                        </p>
                                    </div>

                                    <div className="flex justify-between rounded-lg bg-blue-50 px-4 py-3">
                                        <div>
                                            <p className="text-lg font-bold">
                                                Total Amount
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                {form.data.units} SMS units will be added
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
                                            Important Information:
                                        </p>
                                        <ul className="list-inside list-disc space-y-1 text-blue-800">
                                            <li>SMS units are credited immediately after payment</li>
                                            <li>Units never expire and carry over indefinitely</li>
                                            <li>Non-refundable once purchased</li>
                                            <li>Can be used for all SMS campaigns and single SMS</li>
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
