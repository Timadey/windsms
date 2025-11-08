import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '../ui/card.jsx';

export function FeatureUsage({ usage }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Feature Usage</CardTitle>
                <CardDescription>
                    Current billing period consumption
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {usage.map((feature, idx) => (
                    <div key={idx}>
                        <div className="mb-2 flex justify-between">
                            <span className="font-medium capitalize">
                                {feature.name.replace(/-/g, ' ')}
                            </span>
                            <span className="text-sm text-gray-600">
                                {feature.consumed.toLocaleString()} /{' '}
                                {feature.total.toLocaleString()}
                            </span>
                        </div>
                        <p className="mt-1 text-xs text-gray-500">
                            {feature.remaining.toLocaleString()} remaining (
                            {feature.percentage}% used)
                        </p>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}
