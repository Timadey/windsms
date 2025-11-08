import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '../ui/card.jsx';
import { Button } from '../ui/button.jsx';
import { Zap } from 'lucide-react';

export function SmsBalance({ balance, hasActiveSubscription, onBuyUnits }) {
    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="flex items-center gap-2">
                            <Zap className="h-5 w-5 text-yellow-500" /> SMS
                            Units Balance
                        </CardTitle>
                        <CardDescription className="mt-1">
                            Available SMS credits
                        </CardDescription>
                    </div>
                    {hasActiveSubscription && (
                        <Button onClick={onBuyUnits}>Buy Extra Units</Button>
                    )}
                </div>
            </CardHeader>
            <CardContent>
                <div className="text-4xl font-bold text-blue-600">
                    {balance?.toLocaleString() || 0}
                </div>
                <p className="mt-1 text-sm text-gray-500">
                    SMS units available
                </p>
            </CardContent>
        </Card>
    );
}
