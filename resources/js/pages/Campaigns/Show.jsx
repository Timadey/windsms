import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, CheckCircle, XCircle, Clock } from 'lucide-react';
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
import {
    index as campaignIndex,
} from '../../routes/campaigns/index.ts';
import { cn } from '../../lib/utils.js';
import Pagination from '../../components/pagination.jsx';

const statusColors = {
  draft: 'bg-gray-500',
  scheduled: 'bg-blue-500',
  processing: 'bg-yellow-500',
  completed: 'bg-green-500',
  failed: 'bg-red-500',
};

const logStatusIcons = {
  sent: CheckCircle,
  failed: XCircle,
  pending: Clock,
};

export default function Show({ campaign }) {
    const logs = campaign.logs?.data || campaign.logs || [];
    const paginationLinks = campaign.logs?.links || [];

  return (
      <AppLayout>
          <Head title={`Campaign: ${campaign.name}`} />

          <div className="py-12">
              <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                  {/* Back Button */}
                  <div className="mb-4">
                      <Link href={campaignIndex().url}>
                          <Button variant="outline">
                              <ArrowLeft className="mr-2 h-4 w-4" />
                              Back to Campaigns
                          </Button>
                      </Link>
                  </div>

                  {/* Campaign Details */}
                  <div className="mb-6 overflow-hidden bg-white shadow-sm sm:rounded-lg">
                      <div className="border-b p-6">
                          <div className="flex items-start justify-between">
                              <div>
                                  <h2 className="mb-2 text-2xl font-semibold">
                                      {campaign.name}
                                  </h2>
                                  <Badge
                                      className={statusColors[campaign.status]}
                                  >
                                      {campaign.status}
                                  </Badge>
                              </div>
                              <div className="text-right">
                                  <p className="text-sm text-gray-500">
                                      Created
                                  </p>
                                  <p className="font-medium">
                                      {new Date(
                                          campaign.created_at,
                                      ).toLocaleString()}
                                  </p>
                              </div>
                          </div>
                      </div>

                      <div className="space-y-6 p-6">
                          {/* Statistics */}
                          <div className="grid grid-cols-4 gap-4">
                              <div className="rounded-lg bg-blue-50 p-4">
                                  <p className="text-sm text-gray-600">
                                      Total Recipients
                                  </p>
                                  <p className="text-2xl font-bold text-blue-600">
                                      {campaign.total_recipients}
                                  </p>
                              </div>
                              <div className="rounded-lg bg-green-50 p-4">
                                  <p className="text-sm text-gray-600">Sent</p>
                                  <p className="text-2xl font-bold text-green-600">
                                      {campaign.sent_count}
                                  </p>
                              </div>
                              <div className="rounded-lg bg-red-50 p-4">
                                  <p className="text-sm text-gray-600">
                                      Failed
                                  </p>
                                  <p className="text-2xl font-bold text-red-600">
                                      {campaign.failed_count}
                                  </p>
                              </div>
                              <div className="rounded-lg bg-gray-50 p-4">
                                  <p className="text-sm text-gray-600">
                                      Success Rate
                                  </p>
                                  <p className="text-2xl font-bold text-gray-700">
                                      {campaign.total_recipients > 0
                                          ? Math.round(
                                                (campaign.sent_count /
                                                    campaign.total_recipients) *
                                                    100,
                                            )
                                          : 0}
                                      %
                                  </p>
                              </div>
                          </div>

                          {/* Messages */}
                          <div className="grid grid-cols-2 gap-4">
                              <div>
                                  <h3 className="mb-2 font-semibold">
                                      Original Message
                                  </h3>
                                  <div className="rounded-lg bg-gray-50 p-4">
                                      <p className="whitespace-pre-wrap">
                                          {campaign.message}
                                      </p>
                                  </div>
                              </div>
                              <div>
                                  <h3 className="mb-2 font-semibold">
                                      Spintax Message
                                  </h3>
                                  <div className="rounded-lg bg-blue-50 p-4">
                                      <p className="font-mono text-sm whitespace-pre-wrap">
                                          {campaign.spintax_message}
                                      </p>
                                  </div>
                              </div>
                          </div>

                          {/* Dispatch Info */}
                          <div>
                              <h3 className="mb-2 font-semibold">
                                  Dispatch Information
                              </h3>
                              <div className="rounded-lg bg-gray-50 p-4">
                                  <p>
                                      <span className="font-medium">
                                          Dispatch Time:
                                      </span>{' '}
                                      {campaign.dispatch_at
                                          ? new Date(
                                                campaign.dispatch_at,
                                            ).toLocaleString()
                                          : 'Not scheduled'}
                                  </p>
                              </div>
                          </div>
                      </div>
                  </div>

                  {/* Campaign Logs */}
                  <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                      <div className="border-b p-6">
                          <h3 className="text-xl font-semibold">
                              Delivery Logs
                          </h3>
                      </div>

                      <div className="p-6">
                          <Table>
                              <TableHeader>
                                  <TableRow>
                                      <TableHead>Status</TableHead>
                                      <TableHead>Subscriber</TableHead>
                                      <TableHead>Phone Number</TableHead>
                                      <TableHead>Message Sent</TableHead>
                                      <TableHead>Sent At</TableHead>
                                      <TableHead>Error</TableHead>
                                  </TableRow>
                              </TableHeader>
                              <TableBody>
                                  {logs?.map((log) => {
                                      const StatusIcon =
                                          logStatusIcons[log.status];
                                      return (
                                          <TableRow key={log.id}>
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
                                                      <span className="capitalize">
                                                          {log.status}
                                                      </span>
                                                  </div>
                                              </TableCell>
                                              <TableCell>
                                                  {log.subscriber?.name || '-'}
                                              </TableCell>
                                              <TableCell className="font-medium">
                                                  {log.subscriber?.phone_number}
                                              </TableCell>
                                              <TableCell className="max-w-md truncate">
                                                  {log.message_sent}
                                              </TableCell>
                                              <TableCell>
                                                  {log.sent_at
                                                      ? new Date(
                                                            log.sent_at,
                                                        ).toLocaleString()
                                                      : '-'}
                                              </TableCell>
                                              <TableCell className="text-sm text-red-500">
                                                  {log.error_message || '-'}
                                              </TableCell>
                                          </TableRow>
                                      );
                                  })}
                              </TableBody>
                          </Table>

                          {(!logs || logs.length === 0) && (
                              <div className="py-12 text-center text-gray-500">
                                  No delivery logs yet. Messages will appear
                                  here once sent.
                              </div>
                          )}
                          <Pagination links={paginationLinks} />
                      </div>
                  </div>
              </div>
          </div>
      </AppLayout>
  );
}
