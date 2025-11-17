import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export default function BillingStat({
    title,
    value,
    description,
    icon: Icon,
    badgeLabel = null,
    badgeVariant = 'default',
    action = null, // <-- NEW PROP
}) {
    return (
        <Card
            className={cn(
                'rounded-lg border bg-card text-card-foreground shadow-sm',
                'transition-all hover:shadow-md',
            )}
        >
            <CardHeader className="flex flex-row items-center justify-between pb-1">
                <CardTitle className="text-sm font-semibold text-foreground">
                    {title}
                </CardTitle>

                {Icon && (
                    <Icon className="h-5 w-5 text-primary" strokeWidth={2} />
                )}
            </CardHeader>

            <CardContent>
                <p className="text-4xl font-bold tracking-tight text-foreground">
                    {value}
                </p>

                {badgeLabel && (
                    <Badge variant={badgeVariant} className="mt-1">
                        {badgeLabel}
                    </Badge>
                )}

                {description && (
                    <p className="mt-1 text-sm text-muted-foreground">
                        {description}
                    </p>
                )}

                {/* Flexible action slot */}
                {action && <div className="mt-3">{action}</div>}
            </CardContent>
        </Card>
    );
}
