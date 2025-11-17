import { Head, Link } from '@inertiajs/react';
import {
    ArrowLeft,
    CheckCircle,
    XCircle,
    Clock,
    Users,
    MessageSquare,
    Calendar,
    Send,
    TrendingUp,
    Repeat,
    Hash, Wand2, Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import AppLayout from '../../layouts/app-layout.jsx';
import { index as campaignIndex } from '../../routes/campaigns/index.ts';
import Pagination from '../../components/pagination.jsx';

const statusColors = {
    draft: 'bg-gray-500',
    scheduled: 'bg-blue-500',
    processing: 'bg-yellow-500',
    completed: 'bg-green-500',
    failed: 'bg-red-500',
};

const statusTextColors = {
    draft: 'text-gray-700',
    scheduled: 'text-primary',
    processing: 'text-yellow-700',
    completed: 'text-green-700',
    failed: 'text-red-700',
};

const logStatusIcons = {
    sent: CheckCircle,
    failed: XCircle,
    pending: Clock,
};

export default function Show({ campaign }) {
    const logs = campaign.logs?.data || campaign.logs || [];
    const paginationLinks = campaign.logs?.links || [];

    const successRate = campaign.total_recipients > 0
        ? Math.round((campaign.sent_count / campaign.total_recipients) * 100)
        : 0;

    // Calculate spintax variations count
    const calculateSpintaxVariations = (spintaxText) => {
        if (!spintaxText) return 0;

        // Match all {option1|option2|option3} patterns
        const regex = /\{([^}]+)\}/g;
        const matches = spintaxText.match(regex);

        if (!matches) return 1; // No spintax, just 1 variation

        let totalVariations = 1;

        matches.forEach(match => {
            // Remove the curly braces and split by pipe
            const options = match.slice(1, -1).split('|');
            totalVariations *= options.length;
        });

        return totalVariations;
    };

    const spintaxVariationsCount = calculateSpintaxVariations(campaign.spintax_message);

    return (
        <AppLayout>
            <Head title={`Campaign: ${campaign.name}`} />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Back Button */}
                    <div className="mb-6">
                        <Link href={campaignIndex().url}>
                            <Button variant="outline" size="sm">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to Campaigns
                            </Button>
                        </Link>
                    </div>

                    {/* Campaign Header */}
                    <div className="mb-6 overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="bg-secondary p-6 text-white">
                            <div className="flex items-start justify-between">
                                <div>
                                    <h1 className="mb-3 text-3xl font-bold">
                                        {campaign.name}
                                    </h1>
                                    <div className="flex items-center gap-3">
                                        <Badge
                                            className={`${statusColors[campaign.status]} border-0 text-white`}
                                        >
                                            {campaign.status.toUpperCase()}
                                        </Badge>
                                        {campaign.is_recurring && (
                                            <Badge className="border-white/30 bg-white/20 text-white">
                                                <Repeat className="mr-1 h-3 w-3" />
                                                Recurring
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="rounded-lg bg-white/10 px-4 py-2 backdrop-blur">
                                        <p className="text-sm text-primary-foreground">
                                            Created
                                        </p>
                                        <p className="font-semibold">
                                            {new Date(
                                                campaign.created_at,
                                            ).toLocaleDateString('en-US', {
                                                month: 'short',
                                                day: 'numeric',
                                                year: 'numeric',
                                            })}
                                        </p>
                                        <p className="text-sm">
                                            {new Date(
                                                campaign.created_at,
                                            ).toLocaleTimeString('en-US', {
                                                hour: '2-digit',
                                                minute: '2-digit',
                                            })}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Key Metrics */}
                        <div className="grid grid-cols-1 gap-px bg-gray-200 sm:grid-cols-4">
                            <div className="bg-white p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">
                                            Total Recipients
                                        </p>
                                        <p className="mt-2 text-3xl font-bold text-gray-900">
                                            {campaign.total_recipients.toLocaleString()}
                                        </p>
                                    </div>
                                    <div className="rounded-full bg-blue-100 p-3">
                                        <Users className="h-6 w-6 text-primary" />
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">
                                            Successfully Sent
                                        </p>
                                        <p className="mt-2 text-3xl font-bold text-green-600">
                                            {campaign.sent_count.toLocaleString()}
                                        </p>
                                    </div>
                                    <div className="rounded-full bg-green-100 p-3">
                                        <CheckCircle className="h-6 w-6 text-green-600" />
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">
                                            Failed
                                        </p>
                                        <p className="mt-2 text-3xl font-bold text-red-600">
                                            {campaign.failed_count.toLocaleString()}
                                        </p>
                                    </div>
                                    <div className="rounded-full bg-red-100 p-3">
                                        <XCircle className="h-6 w-6 text-red-600" />
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">
                                            Success Rate
                                        </p>
                                        <p className="mt-2 text-3xl font-bold text-primary">
                                            {successRate}%
                                        </p>
                                    </div>
                                    <div className="rounded-full bg-blue-100 p-3">
                                        <TrendingUp className="h-6 w-6 text-primary" />
                                    </div>
                                </div>
                                <div className="mt-2">
                                    <div className="h-2 overflow-hidden rounded-full bg-gray-200">
                                        <div
                                            className="h-full rounded-full bg-primary transition-all"
                                            style={{ width: `${successRate}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Campaign Details Grid */}
                    <div className="mb-6 grid gap-6 lg:grid-cols-2">
                        {/* Message Content */}
                        <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                            <div className="border-b bg-gray-50 p-4">
                                <div className="flex items-center gap-2">
                                    <MessageSquare className="h-5 w-5 text-gray-600" />
                                    <h3 className="font-semibold text-gray-900">
                                        Message Content
                                    </h3>
                                </div>
                            </div>
                            <div className="p-6">
                                <div className="mb-4">
                                    <label className="mb-2 block text-sm font-medium text-gray-700">
                                        Original Message
                                    </label>
                                    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                                        <p className="whitespace-pre-wrap text-gray-700">
                                            {campaign.message}
                                        </p>
                                    </div>
                                </div>

                                {campaign.spintax_message &&
                                    spintaxVariationsCount > 1 &&(
                                            <div>
                                                <div className="mb-3 flex items-center gap-2">
                                                    <Badge className="border-green-200 bg-green-100 text-green-700">
                                                        <Sparkles className="h-5 w-5" />
                                                        Mixture Active
                                                    </Badge>
                                                </div>
                                                <div className="rounded-lg border-2 border-green-200 bg-green-50 p-4">
                                                    <div className="mb-3 flex items-start gap-3">
                                                        <div className="rounded-full bg-green-600 p-2">
                                                            <MessageSquare className="h-4 w-4 text-white" />
                                                        </div>
                                                        <div className="flex-1">
                                                            <h4 className="font-semibold text-green-900">
                                                                Unique Message
                                                                Variations
                                                            </h4>
                                                            <p className="mt-1 text-sm text-green-700">
                                                                Each recipient
                                                                will receive a
                                                                unique variation
                                                                of your message
                                                            </p>
                                                        </div>
                                                    </div>

                                                    {spintaxVariationsCount >
                                                        1 && (
                                                        <div className="mt-3 rounded-md bg-white p-3">
                                                            <div className="flex items-center justify-between">
                                                                <span className="text-sm font-medium text-gray-700">
                                                                    Total
                                                                    Variations
                                                                    Available:
                                                                </span>
                                                                <span className="text-2xl font-bold text-green-600">
                                                                    {spintaxVariationsCount.toLocaleString()}
                                                                </span>
                                                            </div>
                                                            <div className="mt-2 flex items-center gap-2 text-xs text-gray-600">
                                                                <CheckCircle className="h-3 w-3 text-green-500" />
                                                                <span>
                                                                    100%
                                                                    Deliverability
                                                                </span>
                                                                <span className="text-gray-400">
                                                                    •
                                                                </span>
                                                                <span>
                                                                    Spam Filter
                                                                    Eliminated
                                                                </span>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                            </div>
                        </div>

                        {/* Campaign Details */}
                        <div className="space-y-6">
                            {/* Dispatch Information */}
                            <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                                <div className="border-b bg-gray-50 p-4">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="h-5 w-5 text-gray-600" />
                                        <h3 className="font-semibold text-gray-900">
                                            Dispatch Information
                                        </h3>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <div className="space-y-4">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <p className="text-sm text-gray-600">
                                                    Sender ID
                                                </p>
                                                <p className="mt-1 font-mono text-lg font-semibold text-gray-900">
                                                    {campaign.sender_id}
                                                </p>
                                            </div>
                                            <Badge
                                                variant="outline"
                                                className="border-blue-200 bg-blue-50 text-primary"
                                            >
                                                <Hash className="mr-1 h-3 w-3" />
                                                ID
                                            </Badge>
                                        </div>

                                        <div className="border-t pt-4">
                                            <p className="text-sm text-gray-600">
                                                Scheduled Dispatch
                                            </p>
                                            <div className="mt-2 flex items-center gap-2">
                                                <Send className="h-4 w-4 text-gray-500" />
                                                <p className="font-medium text-gray-900">
                                                    {campaign.dispatch_at
                                                        ? new Date(
                                                              campaign.dispatch_at,
                                                          ).toLocaleString(
                                                              'en-US',
                                                              {
                                                                  dateStyle:
                                                                      'full',
                                                                  timeStyle:
                                                                      'short',
                                                              },
                                                          )
                                                        : 'Immediate dispatch'}
                                                </p>
                                            </div>
                                        </div>

                                        {campaign.is_recurring && (
                                            <div className="border-t pt-4">
                                                <p className="text-sm text-gray-600">
                                                    Recurrence
                                                </p>
                                                <div className="mt-2 flex items-center gap-2">
                                                    <Repeat className="h-4 w-4 text-gray-500" />
                                                    <p className="font-medium text-gray-900">
                                                        Every{' '}
                                                        {
                                                            campaign.recurrence_interval
                                                        }{' '}
                                                        day(s)
                                                    </p>
                                                </div>
                                                {campaign.recurrence_end_date && (
                                                    <p className="mt-1 text-sm text-gray-600">
                                                        Until{' '}
                                                        {new Date(
                                                            campaign.recurrence_end_date,
                                                        ).toLocaleDateString()}
                                                    </p>
                                                )}
                                            </div>
                                        )}

                                        {campaign.recipient_type && (
                                            <div className="border-t pt-4">
                                                <p className="text-sm text-gray-600">
                                                    Recipient Type
                                                </p>
                                                <div className="mt-2 flex items-center gap-2">
                                                    <Users className="h-4 w-4 text-gray-500" />
                                                    <p className="font-medium text-gray-900 capitalize">
                                                        {
                                                            campaign.recipient_type
                                                        }
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Delivery Logs */}
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="border-b bg-gray-50 p-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <MessageSquare className="h-5 w-5 text-gray-600" />
                                    <h3 className="text-xl font-semibold text-gray-900">
                                        Delivery Logs
                                    </h3>
                                </div>
                                <Badge variant="outline" className="text-sm">
                                    {logs.length} record(s)
                                </Badge>
                            </div>
                        </div>

                        <div className="p-6">
                            {logs && logs.length > 0 ? (
                                <>
                                    <div className="overflow-x-auto">
                                        <Table>
                                            <TableHeader>
                                                <TableRow className="bg-gray-50">
                                                    <TableHead className="font-semibold">
                                                        Status
                                                    </TableHead>
                                                    <TableHead className="font-semibold">
                                                        Subscriber
                                                    </TableHead>
                                                    <TableHead className="font-semibold">
                                                        Phone Number
                                                    </TableHead>
                                                    <TableHead className="font-semibold">
                                                        Message Sent
                                                    </TableHead>
                                                    <TableHead className="font-semibold">
                                                        Sent At
                                                    </TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {logs.map((log) => {
                                                    const StatusIcon =
                                                        logStatusIcons[
                                                            log.status
                                                        ];
                                                    return (
                                                        <TableRow
                                                            key={log.id}
                                                            className="hover:bg-gray-50"
                                                        >
                                                            <TableCell>
                                                                <div className="flex items-center gap-2">
                                                                    <StatusIcon
                                                                        className={`h-4 w-4 ${
                                                                            log.status ===
                                                                            'sent'
                                                                                ? 'text-green-500'
                                                                                : log.status ===
                                                                                    'failed'
                                                                                  ? 'text-red-500'
                                                                                  : 'text-yellow-500'
                                                                        }`}
                                                                    />
                                                                    <Badge
                                                                        variant="outline"
                                                                        className={`${
                                                                            log.status ===
                                                                            'sent'
                                                                                ? 'border-green-200 bg-green-50 text-green-700'
                                                                                : log.status ===
                                                                                    'failed'
                                                                                  ? 'border-red-200 bg-red-50 text-red-700'
                                                                                  : 'border-yellow-200 bg-yellow-50 text-yellow-700'
                                                                        }`}
                                                                    >
                                                                        {
                                                                            log.status
                                                                        }
                                                                    </Badge>
                                                                </div>
                                                            </TableCell>
                                                            <TableCell className="font-medium">
                                                                {log.subscriber
                                                                    ?.name ||
                                                                    'N/A'}
                                                            </TableCell>
                                                            <TableCell>
                                                                <span className="font-mono text-sm">
                                                                    {log
                                                                        .subscriber
                                                                        ?.phone_number ||
                                                                        log.phone_number}
                                                                </span>
                                                            </TableCell>
                                                            <TableCell>
                                                                <div className="max-w-md">
                                                                    <p className="truncate text-sm text-gray-600">
                                                                        {
                                                                            log.message_sent
                                                                        }
                                                                    </p>
                                                                </div>
                                                            </TableCell>
                                                            <TableCell className="text-sm text-gray-600">
                                                                {log.sent_at
                                                                    ? new Date(
                                                                          log.sent_at,
                                                                      ).toLocaleString(
                                                                          'en-US',
                                                                          {
                                                                              month: 'short',
                                                                              day: 'numeric',
                                                                              hour: '2-digit',
                                                                              minute: '2-digit',
                                                                          },
                                                                      )
                                                                    : '-'}
                                                            </TableCell>
                                                        </TableRow>
                                                    );
                                                })}
                                            </TableBody>
                                        </Table>
                                    </div>
                                    <div className="mt-4">
                                        <Pagination links={paginationLinks} />
                                    </div>
                                </>
                            ) : (
                                <div className="py-16 text-center">
                                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                                        <MessageSquare className="h-8 w-8 text-gray-400" />
                                    </div>
                                    <h3 className="mb-2 text-lg font-medium text-gray-900">
                                        No delivery logs yet
                                    </h3>
                                    <p className="text-sm text-gray-500">
                                        Messages will appear here once the
                                        campaign is dispatched.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
