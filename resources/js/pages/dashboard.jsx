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
import dayjs from 'dayjs';
import BillingStat from '../components/billing/billing-stats.jsx';
import billing from '../routes/billing/index.ts';
import BillingAlert from '../components/billing/billing-alert.jsx';
import { AlertBanners } from '../components/billing/subscription-alert.jsx';
import { SubscriptionStat } from '../components/billing/subscription-stat.jsx';

export default function Dashboard({ stats, recentCampaigns, messageTrends, smsBalance, currentSubscription }) {
    const breadcrumbs = [{ title: 'Dashboard', href: campaignIndex().url }];

    // Build standard subscription structure
    const normalizedSubscription = currentSubscription
        ? {
              ...currentSubscription,
              is_active: currentSubscription.expired_at
                  ? dayjs().isBefore(dayjs(currentSubscription.expired_at))
                  : true,
              days_remaining: currentSubscription.expired_at
                  ? Math.max(
                      0,
                      dayjs(currentSubscription.expired_at).diff(dayjs(), 'day'),
                      )
                  :'forever',
          }
        : null;

    // console.log(normalizedSubscription);


    const isActive = normalizedSubscription?.is_active;

    // Flag to enable demo charts when real data doesn't exist
    const showDemoChart = false;

// Demo chart data
    const demoChartData = Array.from({ length: 30 }).map((_, i) => {
        const date = dayjs().subtract(29 - i, "day").format("MMM DD");

        return {
            date,
            sent: Math.floor(Math.random() * 150) + 20,
            failed: Math.floor(Math.random() * 20),
        };
    });

// Determine which dataset to show
    const chartData =
        messageTrends?.length && !showDemoChart
            ? messageTrends
            : showDemoChart
                ? demoChartData
                : [];


    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
                    <div>
                        <h1 className="text-3xl font-semibold text-gray-800 dark:text-gray-100">
                            Welcome back <span className="wave-emoji">👋</span>
                        </h1>
                        <p className="text-gray-500">
                            Here's an overview of your SMS performance and
                            activity.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
                        <Link href={createCampaign().url}>
                            <Button className="flex items-center gap-2">
                                <PlusCircle className="h-4 w-4" />
                                New Campaign
                            </Button>
                        </Link>
                        <Link href={subscriberIndex().url}>
                            <Button
                                variant="outline"
                                className="flex items-center gap-2"
                            >
                                <Upload className="h-4 w-4" />
                                Import Subscribers
                            </Button>
                        </Link>
                        <Link className="hidden md:block" href={tagIndex().url}>
                            <Button
                                variant="secondary"
                                className="flex items-center gap-2"
                            >
                                <Tag className="h-4 w-4" />
                                Manage Tags
                            </Button>
                        </Link>
                    </div>
                </div>

                <AlertBanners
                    normalizedSubscription={normalizedSubscription}
                    smsBalance={smsBalance}
                />

                <SubscriptionStat
                    normalizedSubscription={normalizedSubscription}
                    smsBalance={smsBalance}
                />

                {/* Stats Section */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle>Total Campaigns</CardTitle>
                            <BarChart3 className="h-5 w-5 text-blue-500" />
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-bold">
                                {stats.total_campaigns}
                            </p>
                            <p className="text-sm text-gray-500">
                                All time campaigns
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle>Subscribers</CardTitle>
                            <Users className="h-5 w-5 text-green-500" />
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-bold">
                                {stats.total_subscribers}
                            </p>
                            <p className="text-sm text-gray-500">
                                Across all tags
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle>Messages Sent</CardTitle>
                            <Send className="h-5 w-5 text-indigo-500" />
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-bold">
                                {stats.total_sent}
                            </p>
                            <p className="text-sm text-gray-500">
                                Successfully delivered
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle>Failed Messages</CardTitle>
                            <AlertCircle className="h-5 w-5 text-red-500" />
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-bold">
                                {stats.total_failed}
                            </p>
                            <p className="text-sm text-gray-500">
                                Messages not delivered
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Trends Chart */}
                <Card>
                    <CardHeader>
                        <CardTitle>Message Trends (Last 30 Days)</CardTitle>
                    </CardHeader>
                    <CardContent className="h-64">
                        {chartData.length ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={chartData}>
                                    <XAxis dataKey="date" />
                                    <YAxis />
                                    <Tooltip />
                                    <Line
                                        type="monotone"
                                        dataKey="sent"
                                        stroke="#3b82f6"
                                        strokeWidth={2}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="failed"
                                        stroke="#ef4444"
                                        strokeWidth={2}
                                    />
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
                                    <tr className="border-b text-left">
                                        <th className="px-2 py-3">Name</th>
                                        <th className="px-2 py-3">Status</th>
                                        <th className="px-2 py-3">Sent</th>
                                        <th className="px-2 py-3">Failed</th>
                                        <th className="px-2 py-3">Created</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentCampaigns?.length ? (
                                        recentCampaigns.map((campaign) => (
                                            <tr
                                                key={campaign.id}
                                                className="border-b transition hover:bg-gray-50 dark:hover:bg-gray-800/30"
                                            >
                                                <td className="px-2 py-2 font-medium text-gray-800 dark:text-gray-100">
                                                    <Link
                                                        href={`/campaigns/${campaign.id}`}
                                                        className="hover:underline"
                                                    >
                                                        {campaign.name}
                                                    </Link>
                                                </td>
                                                <td className="px-2 py-2">
                                                    <Badge
                                                        variant="outline"
                                                        className={`capitalize ${
                                                            campaign.status ===
                                                            'completed'
                                                                ? 'bg-green-100 text-green-700'
                                                                : campaign.status ===
                                                                    'failed'
                                                                  ? 'bg-red-100 text-red-700'
                                                                  : campaign.status ===
                                                                      'processing'
                                                                    ? 'bg-yellow-100 text-yellow-700'
                                                                    : 'bg-blue-100 text-blue-700'
                                                        }`}
                                                    >
                                                        {campaign.status}
                                                    </Badge>
                                                </td>
                                                <td className="px-2 py-2 text-green-600">
                                                    {campaign.sent_count}
                                                </td>
                                                <td className="px-2 py-2 text-red-500">
                                                    {campaign.failed_count}
                                                </td>
                                                <td className="px-2 py-2 text-gray-500">
                                                    {new Date(
                                                        campaign.created_at,
                                                    ).toLocaleDateString()}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan="5"
                                                className="py-8 text-center text-gray-500"
                                            >
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
