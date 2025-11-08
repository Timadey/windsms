import { Alert, AlertDescription } from '@/components/ui/alert';
import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import { cn } from '@/lib/utils';
import { usePage } from '@inertiajs/react';
import { CheckCircle2, X, XCircle } from 'lucide-react';
import { useEffect, useState } from 'react';

export default ({ children, breadcrumbs, ...props }) => {
    const { flash } = usePage().props;
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertType, setAlertType] = useState('success');

    useEffect(() => {
        if (flash?.success) {
            setAlertMessage(flash.success);
            setAlertType('success');
            setShowAlert(true);
            const timer = setTimeout(() => setShowAlert(false), 4000);
            return () => clearTimeout(timer);
        }
        if (flash?.error) {
            setAlertMessage(flash.error);
            setAlertType('error');
            setShowAlert(true);
            const timer = setTimeout(() => setShowAlert(false), 4000);
            return () => clearTimeout(timer);
        }
    }, [flash]);

    return (
        <>
            {showAlert && (
                <div
                    className={cn(
                        'fixed top-6 right-6 z-50 w-full max-w-md transition-all duration-500 ease-in-out',
                        showAlert
                            ? 'translate-y-0 opacity-100'
                            : '-translate-y-2 opacity-0',
                    )}
                >
                    <Alert
                        variant={
                            alertType === 'error' ? 'destructive' : 'default'
                        }
                        className={cn(
                            'relative flex items-start gap-3 rounded-2xl border-0 p-4 pr-12 shadow-xl backdrop-blur-md',
                            alertType === 'success'
                                ? 'bg-green-50 text-green-700 ring-1 ring-green-200'
                                : 'bg-red-50 text-red-700 ring-1 ring-red-200',
                        )}
                    >
                        <div className="mt-0.5">
                            {alertType === 'success' ? (
                                <CheckCircle2 className="h-5 w-5 text-green-600" />
                            ) : (
                                <XCircle className="h-5 w-5 text-red-600" />
                            )}
                        </div>
                        <AlertDescription className="flex-1 text-sm leading-snug">
                            {alertMessage}
                        </AlertDescription>
                        <button
                            onClick={() => setShowAlert(false)}
                            className="absolute top-2 right-2 rounded-md p-1 transition hover:bg-gray-200/50"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </Alert>
                </div>
            )}

            <AppLayoutTemplate breadcrumbs={breadcrumbs} {...props}>
                {children}
            </AppLayoutTemplate>
        </>
    );
};
