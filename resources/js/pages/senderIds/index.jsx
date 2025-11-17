import { Head, Link, router } from '@inertiajs/react';
import { Plus, Eye, Trash2, CheckCircle, XCircle, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import Pagination from '../../components/pagination.jsx';
import AppLayout from '../../layouts/app-layout.jsx';
import { destroy, index, create, show } from '../../routes/sender-ids';

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

export default function Index({ senderIds }) {
    const paginationLinks = senderIds?.links || [];

    const handleDelete = (senderIdRecord) => {
        if (senderIdRecord.status === 'approved') {
            alert('Cannot delete approved sender IDs. Please contact support.');
            return;
        }

        if (confirm(`Are you sure you want to delete sender ID "${senderIdRecord.sender_id}"?`)) {
            router.delete(destroy(senderIdRecord.id).url);
            // router.delete(`/sender-ids/${senderIdRecord.id}`);
        }
    };

    const breadcrumbs = [
        { title: 'Dashboard', href: '/dashboard' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Sender IDs" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="border-b p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-2xl font-semibold">Sender IDs</h2>
                                    <p className="text-sm text-gray-600 mt-1">
                                        Manage your sender IDs for SMS campaigns
                                    </p>
                                </div>
                                <Link href={create().url}>
                                    <Button>
                                        <Plus className="mr-2 h-4 w-4" />
                                        Apply for Sender ID
                                    </Button>
                                </Link>
                            </div>
                        </div>

                        <div className="p-6">
                            {senderIds.data.length > 0 ? (
                                <>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Sender ID</TableHead>
                                                <TableHead>Purpose</TableHead>
                                                <TableHead>Status</TableHead>
                                                <TableHead>Applied On</TableHead>
                                                <TableHead>Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {senderIds.data.map((senderIdRecord) => {
                                                const StatusIcon = statusIcons[senderIdRecord.status];
                                                return (
                                                    <TableRow
                                                        key={senderIdRecord.id}
                                                    >
                                                        <TableCell className="font-mono font-medium">
                                                            {
                                                                senderIdRecord.sender_id
                                                            }
                                                        </TableCell>
                                                        <TableCell className="max-w-md truncate">
                                                            {
                                                                senderIdRecord.purpose
                                                            }
                                                        </TableCell>
                                                        <TableCell>
                                                            <div className="flex items-center gap-2">
                                                                <StatusIcon
                                                                    className={`h-4 w-4 ${
                                                                        senderIdRecord.status ===
                                                                        'approved'
                                                                            ? 'text-green-500'
                                                                            : senderIdRecord.status ===
                                                                                'pending'
                                                                              ? 'text-yellow-500'
                                                                              : 'text-red-500'
                                                                    }`}
                                                                />
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
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>
                                                            {new Date(
                                                                senderIdRecord.created_at,
                                                            ).toLocaleDateString()}
                                                        </TableCell>
                                                        <TableCell>
                                                            <div className="flex gap-2">
                                                                <Link
                                                                    href={
                                                                        show(
                                                                            senderIdRecord.id,
                                                                        ).url
                                                                    }
                                                                >
                                                                    <Button
                                                                        variant="outline"
                                                                        size="sm"
                                                                    >
                                                                        <Eye className="h-4 w-4" />
                                                                    </Button>
                                                                </Link>
                                                                {senderIdRecord.status !==
                                                                    'approved' && (
                                                                    <Button
                                                                        variant="outline"
                                                                        size="sm"
                                                                        onClick={() =>
                                                                            handleDelete(
                                                                                senderIdRecord,
                                                                            )
                                                                        }
                                                                    >
                                                                        <Trash2 className="h-4 w-4 text-red-500" />
                                                                    </Button>
                                                                )}
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                );
                                            })}
                                        </TableBody>
                                    </Table>
                                    <Pagination links={paginationLinks} />
                                </>
                            ) : (
                                <div className="py-12 text-center">
                                    <div className="mb-4 text-gray-400">
                                        <Plus className="mx-auto h-12 w-12" />
                                    </div>
                                    <h3 className="mb-2 text-lg font-medium text-gray-900">
                                        No Sender IDs
                                    </h3>
                                    <p className="mb-4 text-gray-500">
                                        You haven't applied for any sender IDs yet.
                                    </p>
                                    <Link href={create().url}>
                                        <Button>
                                            <Plus className="mr-2 h-4 w-4" />
                                            Apply for Your First Sender ID
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
