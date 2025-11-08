
import HeadingSmall from '@/components/heading-small';

import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { edit as editAppearance } from '@/routes/appearance';
import { Head, Link } from '@inertiajs/react';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const breadcrumbs = [
    {
        title: 'Appearance settings',
        href: editAppearance().url,
    },
];

export default function AccountBilling({ user, currentSubscription, smsBalance }) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Appearance settings" />

            <SettingsLayout>
                <div className="space-y-6">
                    <HeadingSmall
                        title="Appearance settings"
                        description="Update your account's appearance settings"
                    />
                    <div className="space-y-6">
                        {/* Quick Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">SMS Balance</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-3xl font-bold text-blue-600">
                                        {smsBalance?.toLocaleString() || 0}
                                    </p>
                                    <p className="text-sm text-gray-500 mt-1">Available units</p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">Current Plan</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {currentSubscription ? (
                                        <>
                                            <p className="text-3xl font-bold text-purple-600 capitalize">
                                                {currentSubscription.plan.replace('-yearly', '')}
                                            </p>
                                            <p className="text-sm text-gray-500 mt-1">
                                                {currentSubscription.is_active ? 'Active' : 'Expired'}
                                            </p>
                                        </>
                                    ) : (
                                        <>
                                            <p className="text-3xl font-bold text-gray-400">No Plan</p>
                                            <p className="text-sm text-gray-500 mt-1">Not subscribed</p>
                                        </>
                                    )}
                                </CardContent>
                            </Card>
                        </div>

                        {/* Subscription Details */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Subscription Details</CardTitle>
                                <CardDescription>View and manage your subscription</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {currentSubscription ? (
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-sm text-gray-500">Plan</p>
                                                <p className="font-medium capitalize">
                                                    {currentSubscription.plan.replace('-yearly', '')}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Status</p>
                                                <p className="font-medium">
                                                    {currentSubscription.is_active ? 'Active' : 'Expired'}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Start Date</p>
                                                <p className="font-medium">
                                                    {new Date(currentSubscription.started_at).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Expires</p>
                                                <p className="font-medium">
                                                    {new Date(currentSubscription.expires_at).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex gap-3 pt-4">
                                            <Link href="/billing">
                                                <Button>
                                                    Manage Subscription
                                                </Button>
                                            </Link>
                                            {currentSubscription.is_active && (
                                                <Link href="/billing">
                                                    <Button variant="outline">
                                                        Buy SMS Units
                                                    </Button>
                                                </Link>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <p className="text-gray-500 mb-4">You don't have an active subscription</p>
                                        <Link href="/billing">
                                            <Button>
                                                View Available Plans
                                            </Button>
                                        </Link>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Payment Method */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Payment Method</CardTitle>
                                <CardDescription>Manage your payment information</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="text-center py-8">
                                    <p className="text-gray-500 mb-4">No payment method saved</p>
                                    <Button variant="outline">
                                        Add Payment Method
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}
