import { Head, Link } from '@inertiajs/react';
import { Plus, Eye } from 'lucide-react';
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
import {
    create as campaignCreate,
    show as campaignShow,
} from '../../routes/campaigns/index.ts';
import AppLayout from '../../layouts/app-layout.jsx';
import { dashboard } from '../../routes/index.ts';
import { cn } from '../../lib/utils.js';
import Pagination from '../../components/pagination.jsx';


const statusColors = {
  draft: 'bg-gray-500',
  scheduled: 'bg-blue-500',
  processing: 'bg-yellow-500',
  completed: 'bg-green-500',
  failed: 'bg-red-500',
};

const breadcrumbs = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

export default function Index({ campaigns }) {
    const paginationLinks = campaigns?.links || [];

  return (
      <AppLayout breadcrumbs={breadcrumbs}>
          <Head title="Campaigns" />

          <div className="py-12">
              <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                  <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                      <div className="border-b p-6">
                          <div className="flex items-center justify-between">
                              <h2 className="text-2xl font-semibold">
                                  Campaigns
                              </h2>
                              <Link href={campaignCreate().url} passive>
                                  <Button>
                                      <Plus className="mr-2 h-4 w-4" />
                                      Create Campaign
                                  </Button>
                              </Link>
                          </div>
                      </div>

                      <div className="p-6">
                          <Table>
                              <TableHeader>
                                  <TableRow>
                                      <TableHead>Name</TableHead>
                                      <TableHead>Status</TableHead>
                                      <TableHead>Recipients</TableHead>
                                      <TableHead>Sent</TableHead>
                                      <TableHead>Failed</TableHead>
                                      <TableHead>Dispatch Date</TableHead>
                                      <TableHead>Actions</TableHead>
                                  </TableRow>
                              </TableHeader>
                              <TableBody>
                                  {campaigns.data.map((campaign) => (
                                      <TableRow key={campaign.id}>
                                          <TableCell className="font-medium">
                                              {campaign.name}
                                          </TableCell>
                                          <TableCell>
                                              <Badge
                                                  className={
                                                      statusColors[
                                                          campaign.status
                                                      ]
                                                  }
                                              >
                                                  {campaign.status}
                                              </Badge>
                                          </TableCell>
                                          <TableCell>
                                              {campaign.total_recipients}
                                          </TableCell>
                                          <TableCell>
                                              {campaign.sent_count}
                                          </TableCell>
                                          <TableCell>
                                              {campaign.failed_count}
                                          </TableCell>
                                          <TableCell>
                                              {campaign.dispatch_at
                                                  ? new Date(
                                                        campaign.dispatch_at,
                                                    ).toLocaleString()
                                                  : '-'}
                                          </TableCell>
                                          <TableCell>
                                              <Link
                                                  href={campaignShow(
                                                      campaign.id,
                                                  )}
                                              >
                                                  <Button
                                                      variant="outline"
                                                      size="sm"
                                                  >
                                                      <Eye className="mr-1 h-4 w-4" />
                                                      View
                                                  </Button>
                                              </Link>
                                          </TableCell>
                                      </TableRow>
                                  ))}
                              </TableBody>
                          </Table>
                          {/* Pagination */}
                          <Pagination links={paginationLinks} />

                          {campaigns.data.length === 0 && (
                              <div className="py-12 text-center text-gray-500">
                                  No campaigns yet. Create your first campaign
                                  to get started!
                              </div>
                          )}
                      </div>
                  </div>
              </div>
          </div>
      </AppLayout>
  );
}
