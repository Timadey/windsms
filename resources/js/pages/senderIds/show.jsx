import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, CheckCircle, Clock, XCircle } from 'lucide-react';
import AppLayout from '../../layouts/app-layout.jsx';
import { create as campaignCreate } from '../../routes/campaigns/index.ts';
import { index as senderIdIndex } from '../../routes/sender-ids/index.ts';

const statusColors = {
    approved: 'bg-green-500',
    pending: 'bg-yellow-500',
    rejected: 'bg-red-500',
};

const statusIcons = {
    approved: CheckCircle,
    pending: Clock,
    rejected: XCircle,
};

export default function Show({ senderId }) {
    const StatusIcon = statusIcons[senderId.status];

    const breadcrumbs = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Sender IDs', href: '/sender-ids' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Sender ID: ${senderId.sender_id}`} />

            <div className="py-12">
                <div className="mx-auto max-w-4xl sm:px-6 lg:px-8">
                    {/* Back Button */}
                    <div className="mb-4">
                        <Link href={senderIdIndex()}>
                            <Button variant="outline">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to Sender IDs
                            </Button>
                        </Link>
                    </div>

                    {/* Sender ID Details */}
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="border-b p-6">
                            <div className="flex items-start justify-between">
                                <div>
                                    <h2 className="mb-2 font-mono text-2xl font-semibold">
                                        {senderId.sender_id}
                                    </h2>
                                    <div className="flex items-center gap-2">
                                        <StatusIcon
                                            className={`h-5 w-5 ${
                                                senderId.status === 'approved'
                                                    ? 'text-green-500'
                                                    : senderId.status ===
                                                        'pending'
                                                      ? 'text-yellow-500'
                                                      : 'text-red-500'
                                            }`}
                                        />
                                        <Badge
                                            className={
                                                statusColors[senderId.status]
                                            }
                                        >
                                            {senderId.status}
                                        </Badge>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-gray-500">
                                        Applied On
                                    </p>
                                    <p className="font-medium">
                                        {new Date(
                                            senderId.created_at,
                                        ).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6 p-6">
                            {/* Status Message */}
                            {senderId.status === 'pending' && (
                                <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
                                    <div className="flex gap-3">
                                        <Clock className="h-5 w-5 flex-shrink-0 text-yellow-600" />
                                        <div>
                                            <p className="font-medium text-yellow-900">
                                                Application Pending Review
                                            </p>
                                            <p className="mt-1 text-sm text-yellow-800">
                                                Your sender ID application is
                                                being reviewed by our team. This
                                                typically takes 1-3 business
                                                days. You'll be notified once a
                                                decision is made.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {senderId.status === 'approved' && (
                                <div className="rounded-lg border border-green-200 bg-green-50 p-4">
                                    <div className="flex gap-3">
                                        <CheckCircle className="h-5 w-5 flex-shrink-0 text-green-600" />
                                        <div>
                                            <p className="font-medium text-green-900">
                                                Sender ID Approved!
                                            </p>
                                            <p className="mt-1 text-sm text-green-800">
                                                Your sender ID has been approved
                                                and is now available for use in
                                                your campaigns.
                                            </p>
                                            {senderId.approved_at && (
                                                <p className="mt-2 text-xs text-green-700">
                                                    Approved on:{' '}
                                                    {new Date(
                                                        senderId.approved_at,
                                                    ).toLocaleString()}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {senderId.status === 'rejected' && (
                                <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                                    <div className="flex gap-3">
                                        <XCircle className="h-5 w-5 flex-shrink-0 text-red-600" />
                                        <div>
                                            <p className="font-medium text-red-900">
                                                Application Rejected
                                            </p>
                                            {senderId.rejection_reason && (
                                                <div className="mt-2">
                                                    <p className="text-sm font-medium text-red-800">
                                                        Reason:
                                                    </p>
                                                    <p className="mt-1 text-sm text-red-700">
                                                        {
                                                            senderId.rejection_reason
                                                        }
                                                    </p>
                                                </div>
                                            )}
                                            {senderId.rejected_at && (
                                                <p className="mt-2 text-xs text-red-700">
                                                    Rejected on:{' '}
                                                    {new Date(
                                                        senderId.rejected_at,
                                                    ).toLocaleString()}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Purpose Section */}
                            <div>
                                <h3 className="mb-2 text-lg font-semibold">
                                    Purpose
                                </h3>
                                <div className="rounded-lg bg-gray-50 p-4">
                                    <p className="whitespace-pre-wrap text-gray-700">
                                        {senderId.purpose}
                                    </p>
                                </div>
                            </div>

                            {/* Timeline */}
                            <div>
                                <h3 className="mb-3 text-lg font-semibold">
                                    Timeline
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex gap-3">
                                        <div className="flex flex-col items-center">
                                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                                                <div className="h-3 w-3 rounded-full bg-blue-500" />
                                            </div>
                                            {(senderId.approved_at ||
                                                senderId.rejected_at) && (
                                                <div className="h-8 w-px bg-gray-300" />
                                            )}
                                        </div>
                                        <div className="pb-4">
                                            <p className="font-medium">
                                                Application Submitted
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                {new Date(
                                                    senderId.created_at,
                                                ).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>

                                    {senderId.approved_at && (
                                        <div className="flex gap-3">
                                            <div className="flex flex-col items-center">
                                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
                                                    <CheckCircle className="h-4 w-4 text-green-600" />
                                                </div>
                                            </div>
                                            <div>
                                                <p className="font-medium text-green-700">
                                                    Approved
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    {new Date(
                                                        senderId.approved_at,
                                                    ).toLocaleString()}
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {senderId.rejected_at && (
                                        <div className="flex gap-3">
                                            <div className="flex flex-col items-center">
                                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100">
                                                    <XCircle className="h-4 w-4 text-red-600" />
                                                </div>
                                            </div>
                                            <div>
                                                <p className="font-medium text-red-700">
                                                    Rejected
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    {new Date(
                                                        senderId.rejected_at,
                                                    ).toLocaleString()}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Actions */}
                            {senderId.status === 'approved' && (
                                <div className="border-t pt-6">
                                    <Link href={campaignCreate()}>
                                        <Button>
                                            Create Campaign with this Sender ID
                                        </Button>
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
