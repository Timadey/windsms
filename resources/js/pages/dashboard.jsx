import { Head, Link } from '@inertiajs/react';
import { BarChart3, Users, Send, AlertCircle, PlusCircle, Upload, Tag, Zap, CreditCard, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import AppLayout from '@/layouts/app-layout';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import {
    create as createCampaign,
    index as campaignIndex,
} from '@/routes/campaigns/index';
import { index as subscriberIndex } from '@/routes/subscribers/index';
import { index as tagIndex } from '@/routes/tags/index';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts';

export default function Dashboard({ stats, recentCampaigns, messageTrends, smsBalance, currentSubscription }) {
    const breadcrumbs = [{ title: 'Dashboard', href: campaignIndex().url }];

    const isSubscriptionExpiringSoon = currentSubscription?.is_active && currentSubscription?.days_remaining <= 7;
    const hasLowBalance = smsBalance < 100;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-semibold text-gray-800 dark:text-gray-100">
                            Welcome back 👋
                        </h1>
                        <p className="text-gray-500">
                            Here's an overview of your SMS performance and activity.
                        </p>
                    </div>

                    <div className="flex gap-2">
                        <Link href={createCampaign().url}>
                            <Button className="flex items-center gap-2">
                                <PlusCircle className="w-4 h-4" />
                                New Campaign
                            </Button>
                        </Link>
                        <Link href={subscriberIndex().url}>
                            <Button variant="outline" className="flex items-center gap-2">
                                <Upload className="w-4 h-4" />
                                Import Subscribers
                            </Button>
                        </Link>
                        <Link href={tagIndex().url}>
                            <Button variant="secondary" className="flex items-center gap-2">
                                <Tag className="w-4 h-4" />
                                Manage Tags
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Alerts */}
                {(!currentSubscription || !currentSubscription.is_active) && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                            <h3 className="font-semibold text-red-900">No Active Subscription</h3>
                            <p className="text-sm text-red-700 mt-1">
                                You need an active subscription to send campaigns. Subscribe to a plan to get started.
                            </p>
                            <Link href="/billing/index-old">
                                <Button size="sm" className="mt-3">
                                    View Plans
                                </Button>
                            </Link>
                        </div>
                    </div>
                )}

                {isSubscriptionExpiringSoon && (
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                            <h3 className="font-semibold text-orange-900">Subscription Expiring Soon</h3>
                            <p className="text-sm text-orange-700 mt-1">
                                Your subscription expires in {currentSubscription.days_remaining} days. Renew now to avoid service interruption.
                            </p>
                            <Link href="/billing/index-old">
                                <Button size="sm" variant="outline" className="mt-3">
                                    Renew Subscription
                                </Button>
                            </Link>
                        </div>
                    </div>
                )}

                {hasLowBalance && currentSubscription?.is_active && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                            <h3 className="font-semibold text-yellow-900">Low SMS Balance</h3>
                            <p className="text-sm text-yellow-700 mt-1">
                                You have only {smsBalance} SMS units remaining. Purchase more to continue sending campaigns.
                            </p>
                            <Link href="/billing/index-old">
                                <Button size="sm" variant="outline" className="mt-3">
                                    Buy SMS Units
                                </Button>
                            </Link>
                        </div>
                    </div>
                )}

                {/* Billing Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-blue-900 dark:text-blue-100">SMS Balance</CardTitle>
                            <Zap className="w-5 h-5 text-yellow-500" />
                        </CardHeader>
                        <CardContent>
                            <p className="text-4xl font-bold text-blue-900 dark:text-blue-100">
                                {smsBalance?.toLocaleString() || 0}
                            </p>
                            <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">Available SMS units</p>
                            {currentSubscription?.is_active && (
                                <Link href="/billing/index-old">
                                    <Button size="sm" variant="outline" className="mt-3">
                                        Buy More Units
                                    </Button>
                                </Link>
                            )}
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border-purple-200">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-purple-900 dark:text-purple-100">Subscription</CardTitle>
                            <CreditCard className="w-5 h-5 text-purple-600" />
                        </CardHeader>
                        <CardContent>
                            {currentSubscription ? (
                                <>
                                    <div className="flex items-center gap-2 mb-2">
                                        <p className="text-2xl font-bold text-purple-900 dark:text-purple-100 capitalize">
                                            {currentSubscription.plan.replace('-yearly', '')}
                                        </p>
                                        <Badge variant={currentSubscription.is_active ? 'default' : 'destructive'}>
                                            {currentSubscription.is_active ? 'Active' : 'Expired'}
                                        </Badge>
                                    </div>
                                    <p className="text-sm text-purple-700 dark:text-purple-300">
                                        {currentSubscription.is_active
                                            ? `${currentSubscription.days_remaining} days remaining`
                                            : 'Expired - Renew to continue'
                                        }
                                    </p>
                                    <Link href="/billing/index-old">
                                        <Button size="sm" variant="outline" className="mt-3">
                                            Manage Subscription
                                        </Button>
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">No Plan</p>
                                    <p className="text-sm text-purple-700 dark:text-purple-300 mt-1">
                                        Subscribe to start sending campaigns
                                    </p>
                                    <Link href="/billing/index-old">
                                        <Button size="sm" className="mt-3">
                                            View Plans
                                        </Button>
                                    </Link>
                                </>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Stats Section */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle>Total Campaigns</CardTitle>
                            <BarChart3 className="w-5 h-5 text-blue-500" />
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-bold">{stats.total_campaigns}</p>
                            <p className="text-sm text-gray-500">All time campaigns</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle>Subscribers</CardTitle>
                            <Users className="w-5 h-5 text-green-500" />
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-bold">{stats.total_subscribers}</p>
                            <p className="text-sm text-gray-500">Across all tags</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle>Messages Sent</CardTitle>
                            <Send className="w-5 h-5 text-indigo-500" />
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-bold">{stats.total_sent}</p>
                            <p className="text-sm text-gray-500">Successfully delivered</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle>Failed Messages</CardTitle>
                            <AlertCircle className="w-5 h-5 text-red-500" />
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-bold">{stats.total_failed}</p>
                            <p className="text-sm text-gray-500">Messages not delivered</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Trends Chart */}
                <Card>
                    <CardHeader>
                        <CardTitle>Message Trends (Last 30 Days)</CardTitle>
                    </CardHeader>
                    <CardContent className="h-64">
                        {messageTrends?.length ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={messageTrends}>
                                    <XAxis dataKey="date" />
                                    <YAxis />
                                    <Tooltip />
                                    <Line type="monotone" dataKey="sent" stroke="#3b82f6" strokeWidth={2} />
                                    <Line type="monotone" dataKey="failed" stroke="#ef4444" strokeWidth={2} />
                                </LineChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="relative h-full">
                                <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/10 dark:stroke-neutral-100/10" />
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Recent Campaigns */}
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Campaigns</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                <tr className="text-left border-b">
                                    <th className="py-3 px-2">Name</th>
                                    <th className="py-3 px-2">Status</th>
                                    <th className="py-3 px-2">Sent</th>
                                    <th className="py-3 px-2">Failed</th>
                                    <th className="py-3 px-2">Created</th>
                                </tr>
                                </thead>
                                <tbody>
                                {recentCampaigns?.length ? (
                                    recentCampaigns.map((campaign) => (
                                        <tr key={campaign.id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800/30 transition">
                                            <td className="py-2 px-2 font-medium text-gray-800 dark:text-gray-100">
                                                <Link href={`/campaigns/${campaign.id}`} className="hover:underline">
                                                    {campaign.name}
                                                </Link>
                                            </td>
                                            <td className="py-2 px-2">
                                                <Badge
                                                    variant="outline"
                                                    className={`capitalize ${
                                                        campaign.status === 'completed'
                                                            ? 'bg-green-100 text-green-700'
                                                            : campaign.status === 'failed'
                                                                ? 'bg-red-100 text-red-700'
                                                                : campaign.status === 'processing'
                                                                    ? 'bg-yellow-100 text-yellow-700'
                                                                    : 'bg-blue-100 text-blue-700'
                                                    }`}
                                                >
                                                    {campaign.status}
                                                </Badge>
                                            </td>
                                            <td className="py-2 px-2 text-green-600">{campaign.sent_count}</td>
                                            <td className="py-2 px-2 text-red-500">{campaign.failed_count}</td>
                                            <td className="py-2 px-2 text-gray-500">
                                                {new Date(campaign.created_at).toLocaleDateString()}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="text-center py-8 text-gray-500">
                                            No campaigns yet.
                                        </td>
                                    </tr>
                                )}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
