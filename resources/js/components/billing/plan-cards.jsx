import { Check } from 'lucide-react';
import { Badge } from '../ui/badge.jsx';
import { Button } from '../ui/button.jsx';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '../ui/card.jsx';

export function PlanCards({
    plans,
    currentSubscription,
    billingCycle,
    onBillingCycleChange,
    onSelectPlan,
}) {
    const formatTitle = (name) => {
        const base = name.replace('-yearly', '').replace('-monthly', '');
        return base.charAt(0).toUpperCase() + base.slice(1);
    };

    const getPlanDetails = (plan) => {
        const smsFeature = plan.features.find((f) => f.name === 'sms-units');
        const smsUnits = smsFeature ? smsFeature.charges : 0;
        const baseName = plan.name
            .replace('-yearly', '')
            .replace('-monthly', '');

        const subtitles = {
            starter: 'Individuals, Micro Businesses',
            pro: 'SMEs, Marketers',
            business: 'High-volume Businesses',
            enterprise: 'Agencies, Enterprises',
        };

        return {
            title: formatTitle(plan.name),
            subtitle: subtitles[baseName] || '',
            price: plan.price,
            sms: smsUnits,
            popular: baseName === 'pro', // highlight pro plan by default
        };
    };

    return (
        <div>
            <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold">Available Plans</h2>
                <div className="flex gap-2 rounded-lg border bg-gray-50 p-1">
                    <Button
                        variant={
                            billingCycle === 'monthly' ? 'default' : 'ghost'
                        }
                        onClick={() => onBillingCycleChange('monthly')}
                    >
                        Monthly
                    </Button>
                    <Button
                        variant={
                            billingCycle === 'yearly' ? 'default' : 'ghost'
                        }
                        onClick={() => onBillingCycleChange('yearly')}
                    >
                        Yearly
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                {plans.map((plan) => {
                    const details = getPlanDetails(plan);
                    const isCurrent = currentSubscription?.plan === plan.name;

                    return (
                        <Card
                            key={plan.id}
                            className={`relative transition hover:shadow-md ${
                                details.popular
                                    ? 'border-blue-500 shadow-lg'
                                    : ''
                            } ${isCurrent ? 'border-green-500' : ''}`}
                        >
                            {details.popular && !isCurrent && (
                                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-500 text-white">
                                    Most Popular
                                </Badge>
                            )}
                            {isCurrent && (
                                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-green-500 text-white">
                                    Current Plan
                                </Badge>
                            )}

                            <CardHeader>
                                <CardTitle>{details.title}</CardTitle>
                                <CardDescription>
                                    {details.subtitle}
                                </CardDescription>
                                <div className="mt-4">
                                    <span className="text-3xl font-bold">
                                        ₦{details.price.toLocaleString()}
                                    </span>
                                    <span className="text-gray-500">
                                        /{billingCycle}
                                    </span>
                                </div>
                                <div>
                                    <span className="font-medium text-primary">
                                        Include FREE ₦{details.sms} SMS
                                    </span>
                                </div>
                            </CardHeader>

                            <CardContent>
                                <ul className="mb-6 space-y-3">
                                    {plan.features.map((f, i) => (
                                        <li
                                            key={i}
                                            className="flex items-start gap-2"
                                        >
                                            <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-500" />
                                            <span className="capitalize">
                                                {f.name.replace('-', ' ')}
                                                {f.charges
                                                    ? ` (${f.charges.toLocaleString()})`
                                                    : ''}
                                            </span>
                                        </li>
                                    ))}
                                    <li className="flex items-start gap-2 font-medium text-primary">
                                        <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-500" />
                                        <span className="capitalize">
                                            ₦{plan.extra_sms_price}/Extra SMS Units
                                        </span>
                                    </li>
                                </ul>
                                <Button
                                    className="w-full"
                                    variant={
                                        isCurrent
                                            ? 'outline'
                                            : details.popular
                                              ? 'default'
                                              : 'outline'
                                    }
                                    onClick={() => onSelectPlan(plan)}
                                    disabled={isCurrent}
                                >
                                    {isCurrent ? 'Current Plan' : 'Subscribe'}
                                </Button>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}
