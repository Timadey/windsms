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
import { Head, Link } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import Pagination from '@/components/pagination.jsx';
import AppLayout from '@/layouts/app-layout.jsx';
import singleSms from '../../routes/single-sms/index.ts';
import { dashboard } from '../../routes/index.ts';

const breadcrumbs = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

export default function Index({ logs }) {
    const paginationLinks = logs?.links || [];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Single SMS Logs" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="border-b p-6">
                            <div className="flex items-center justify-between">
                                <h2 className="text-2xl font-semibold">
                                    Single SMS Logs
                                </h2>
                                <Link href={singleSms.create().url}>
                                    <Button>
                                        <Plus className="mr-2 h-4 w-4" />
                                        Send New SMS
                                    </Button>
                                </Link>
                            </div>
                        </div>

                        <div className="p-6">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Recipient</TableHead>
                                        <TableHead>Message</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Sent At</TableHead>
                                        <TableHead>Type</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {logs.data.map((log) => (
                                        <TableRow key={log.id}>
                                            <TableCell className="font-medium">
                                                {log.subscriber ? (
                                                    <div>
                                                        <div className="font-bold">{log.subscriber.name}</div>
                                                        <div className="text-sm text-gray-500">{log.subscriber.phone_number}</div>
                                                    </div>
                                                ) : (
                                                    log.phone_number
                                                )}
                                            </TableCell>
                                            <TableCell className="max-w-xs truncate" title={log.message_sent}>
                                                {log.message_sent}
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    className={
                                                        log.status === 'sent' ? 'bg-green-500' :
                                                            log.status === 'failed' ? 'bg-red-500' : 'bg-gray-500'
                                                    }
                                                >
                                                    {log.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                {log.sent_at
                                                    ? new Date(log.sent_at).toLocaleString()
                                                    : '-'}
                                            </TableCell>
                                            <TableCell>
                                                {log.campaign_id ? (
                                                    <Badge variant="outline">Campaign</Badge>
                                                ) : (
                                                    <Badge variant="outline">Single</Badge>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>

                            <Pagination links={paginationLinks} />

                            {logs.data.length === 0 && (
                                <div className="py-12 text-center text-gray-500">
                                    No SMS logs found.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
