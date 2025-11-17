import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Link } from '@inertiajs/react';
import { AlertTriangle } from 'lucide-react';

const variants = {
    error: {
        container: 'border border-red-200 bg-red-50',
        icon: 'text-red-600',
        title: 'text-red-900',
        text: 'text-red-700',
    },
    warning: {
        container: 'border border-orange-200 bg-orange-50',
        icon: 'text-orange-600',
        title: 'text-orange-900',
        text: 'text-orange-700',
    },
    attention: {
        container: 'border border-yellow-200 bg-yellow-50',
        icon: 'text-yellow-600',
        title: 'text-yellow-900',
        text: 'text-yellow-700',
    },
    info: {
        container: 'border border-blue-200 bg-blue-50',
        icon: 'text-blue-600',
        title: 'text-blue-900',
        text: 'text-blue-700',
    },
};

export default function BillingAlert({
    variant = 'info',
    title,
    message,
    actionText = null,
    actionUrl = null,
}) {
    const style = variants[variant];

    return (
        <div
            className={cn(
                'flex items-start gap-3 rounded-lg p-4',
                'transition-all',
                style.container,
            )}
        >
            <AlertTriangle
                className={cn('mt-0.5 h-5 w-5 flex-shrink-0', style.icon)}
            />

            <div className="flex-1">
                <h3 className={cn('font-semibold', style.title)}>{title}</h3>

                <p className={cn('mt-1 text-sm', style.text)}>{message}</p>

                {actionText && actionUrl && (
                    <Link href={actionUrl}>
                        <Button
                            size="sm"
                            variant="outline"
                            className="mt-3 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                        >
                            {actionText}
                        </Button>
                    </Link>
                )}
            </div>
        </div>
    );
}
