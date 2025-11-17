import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { Head, router } from '@inertiajs/react';
import { CheckCircle, Filter, Trash2, XCircle } from 'lucide-react';
import { useState } from 'react';
import Pagination from '../../../components/pagination.jsx';
import AppLayout from '../../../layouts/app-layout.jsx';

const statusColors = {
    approved: 'bg-green-500',
    pending: 'bg-yellow-500',
    rejected: 'bg-red-500',
};

export default function Index({ senderIds, currentStatus }) {
    const [rejectModalOpen, setRejectModalOpen] = useState(false);
    const [selectedSenderId, setSelectedSenderId] = useState(null);
    const [rejectionReason, setRejectionReason] = useState('');

    const handleApprove = (senderIdRecord) => {
        if (
            confirm(
                `Approve sender ID "${senderIdRecord.sender_id}" for ${senderIdRecord.user?.name}?`,
            )
        ) {
            router.post(`/admin/sender-ids/${senderIdRecord.id}/approve`);
        }
    };

    const openRejectModal = (senderIdRecord) => {
        setSelectedSenderId(senderIdRecord);
        setRejectModalOpen(true);
        setRejectionReason('');
    };

    const handleReject = () => {
        if (!rejectionReason.trim()) {
            alert('Please provide a rejection reason');
            return;
        }

        router.post(`/admin/sender-ids/${selectedSenderId.id}/reject`, {
            reason: rejectionReason,
        });

        setRejectModalOpen(false);
        setSelectedSenderId(null);
        setRejectionReason('');
    };

    const handleDelete = (senderIdRecord) => {
        if (
            confirm(
                `Delete sender ID "${senderIdRecord.sender_id}"? This action cannot be undone.`,
            )
        ) {
            router.delete(`/admin/sender-ids/${senderIdRecord.id}`);
        }
    };

    const filterByStatus = (status) => {
        router.get(`/admin/sender-ids?status=${status}`);
    };

    const paginationLinks = senderIds?.links || [];

    return (
        <AppLayout>
            <Head title="Admin - Sender IDs" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="border-b p-6">
                            <h2 className="text-2xl font-semibold">
                                Sender ID Applications
                            </h2>
                            <p className="mt-1 text-sm text-gray-600">
                                Review and manage sender ID applications
                            </p>
                        </div>

                        {/* Status Filter */}
                        <div className="border-b bg-gray-50 p-4">
                            <div className="flex items-center gap-2">
                                <Filter className="h-4 w-4 text-gray-500" />
                                <span className="text-sm font-medium text-gray-700">
                                    Filter:
                                </span>
                                <div className="flex gap-2">
                                    {[
                                        'all',
                                        'pending',
                                        'approved',
                                        'rejected',
                                    ].map((status) => (
                                        <Button
                                            key={status}
                                            size="sm"
                                            variant={
                                                currentStatus === status
                                                    ? 'default'
                                                    : 'outline'
                                            }
                                            onClick={() =>
                                                filterByStatus(status)
                                            }
                                        >
                                            {status.charAt(0).toUpperCase() +
                                                status.slice(1)}
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="p-6">
                            {senderIds.data.length > 0 ? (
                                <>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Sender ID</TableHead>
                                                <TableHead>User</TableHead>
                                                <TableHead>Purpose</TableHead>
                                                <TableHead>Status</TableHead>
                                                <TableHead>
                                                    Applied On
                                                </TableHead>
                                                <TableHead>Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {senderIds.data.map(
                                                (senderIdRecord) => (
                                                    <TableRow
                                                        key={senderIdRecord.id}
                                                    >
                                                        <TableCell className="font-mono font-medium">
                                                            {
                                                                senderIdRecord.sender_id
                                                            }
                                                        </TableCell>
                                                        <TableCell>
                                                            {senderIdRecord.user
                                                                ?.name || 'N/A'}
                                                            <br />
                                                            <span className="text-xs text-gray-500">
                                                                {
                                                                    senderIdRecord
                                                                        .user
                                                                        ?.email
                                                                }
                                                            </span>
                                                        </TableCell>
                                                        <TableCell className="max-w-xs">
                                                            <p className="truncate text-sm">
                                                                {
                                                                    senderIdRecord.purpose
                                                                }
                                                            </p>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Badge
                                                                className={
                                                                    statusColors[
                                                                        senderIdRecord
                                                                            .status
                                                                    ]
                                                                }
                                                            >
                                                                {
                                                                    senderIdRecord.status
                                                                }
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell>
                                                            {new Date(
                                                                senderIdRecord.created_at,
                                                            ).toLocaleDateString()}
                                                        </TableCell>
                                                        <TableCell>
                                                            <div className="flex gap-2">
                                                                {senderIdRecord.status ===
                                                                    'pending' && (
                                                                    <>
                                                                        <Button
                                                                            size="sm"
                                                                            variant="outline"
                                                                            onClick={() =>
                                                                                handleApprove(
                                                                                    senderIdRecord,
                                                                                )
                                                                            }
                                                                            className="border-green-600 text-green-600"
                                                                        >
                                                                            <CheckCircle className="h-4 w-4" />
                                                                        </Button>
                                                                        <Button
                                                                            size="sm"
                                                                            variant="outline"
                                                                            onClick={() =>
                                                                                openRejectModal(
                                                                                    senderIdRecord,
                                                                                )
                                                                            }
                                                                            className="border-red-600 text-red-600"
                                                                        >
                                                                            <XCircle className="h-4 w-4" />
                                                                        </Button>
                                                                    </>
                                                                )}
                                                                <Button
                                                                    size="sm"
                                                                    variant="outline"
                                                                    onClick={() =>
                                                                        handleDelete(
                                                                            senderIdRecord,
                                                                        )
                                                                    }
                                                                >
                                                                    <Trash2 className="h-4 w-4 text-red-500" />
                                                                </Button>
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                ),
                                            )}
                                        </TableBody>
                                    </Table>
                                    <Pagination links={paginationLinks} />
                                </>
                            ) : (
                                <div className="py-12 text-center text-gray-500">
                                    No sender ID applications found.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Reject Modal */}
            <Dialog open={rejectModalOpen} onOpenChange={setRejectModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Reject Sender ID</DialogTitle>
                        <DialogDescription>
                            Provide a reason for rejecting "
                            {selectedSenderId?.sender_id}"
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <Textarea
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                            placeholder="Enter rejection reason..."
                            rows={4}
                        />
                        <div className="flex justify-end gap-2">
                            <Button
                                variant="outline"
                                onClick={() => setRejectModalOpen(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleReject}
                                disabled={!rejectionReason.trim()}
                            >
                                Reject
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
