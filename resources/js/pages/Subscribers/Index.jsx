import { Head, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { Plus, Upload, X, Tag as TagIcon, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
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
import { dashboard } from '../../routes/index.ts';
import {
    store as subscriberStore,
    bulkImport as subscriberBulkImport,
    destroy as subscriberDestroy,
} from '../../routes/subscribers/index.ts';
import Pagination from '../../components/pagination.jsx';

export default function Index({ subscribers, tags, filters }) {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showBulkUploadDialog, setShowBulkUploadDialog] = useState(false);
  const paginationLinks = subscribers.links || [];

  const { data, setData, post, processing, reset, errors } = useForm({
    phone_number: '',
    name: '',
    tag_ids: [],
  });

  const bulkUploadForm = useForm({
    file: null,
    tag_ids: [],
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    post(subscriberStore().url, {
      onSuccess: () => {
        reset();
        setShowAddDialog(false);
      },
    });
  };

  const handleBulkUpload = (e) => {
    e.preventDefault();
    bulkUploadForm.post(subscriberBulkImport().url, {
      onSuccess: () => {
        bulkUploadForm.reset();
        setShowBulkUploadDialog(false);
      },
    });
  };

  const handleDelete = (subscriberId) => {
    if (confirm('Are you sure you want to delete this subscriber?')) {
      // router.delete(route('subscribers.destroy', subscriberId));
        router.delete(subscriberDestroy(subscriberId).url, {
            onSuccess: () => {
                console.log('Subscriber deleted successfully');
            },
            preserveScroll: true,
        });
    }
  };

    const breadcrumbs = [
        {
            title: 'Dashboard',
            href: dashboard().url,
        },
    ];

  return (
      <AppLayout breadcrumbs={breadcrumbs}>
          <Head title="Subscribers" />

          <div className="py-12">
              <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                  <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                      <div className="border-b p-6">
                          <div className="flex items-center justify-between">
                              <h2 className="text-2xl font-semibold">
                                  Subscribers
                              </h2>
                              <div className="flex gap-2">
                                  <Dialog
                                      open={showBulkUploadDialog}
                                      onOpenChange={setShowBulkUploadDialog}
                                  >
                                      <DialogTrigger asChild>
                                          <Button variant="outline">
                                              <Upload className="mr-2 h-4 w-4" />
                                              Bulk Upload
                                          </Button>
                                      </DialogTrigger>
                                      <DialogContent>
                                          <DialogHeader>
                                              <DialogTitle>
                                                  Bulk Upload Subscribers
                                              </DialogTitle>
                                          </DialogHeader>
                                          <form
                                              onSubmit={handleBulkUpload}
                                              className="space-y-4"
                                          >
                                              <div>
                                                  <Label htmlFor="file">
                                                      CSV File
                                                  </Label>
                                                  <Input
                                                      id="file"
                                                      type="file"
                                                      accept=".csv,.txt"
                                                      onChange={(e) =>
                                                          bulkUploadForm.setData(
                                                              'file',
                                                              e.target.files[0],
                                                          )
                                                      }
                                                  />
                                                  <p className="mt-1 text-sm text-gray-500">
                                                      CSV should have columns:
                                                      phone_number{/*, name*/}
                                                      {/*(optional)*/}
                                                  </p>
                                              </div>
                                              <div>
                                                  <Label>Tags (optional)</Label>
                                                  <div className="mt-2 flex flex-wrap gap-2">
                                                      {tags.map((tag) => (
                                                          <Badge
                                                              key={tag.id}
                                                              variant={
                                                                  bulkUploadForm.data.tag_ids.includes(
                                                                      tag.id,
                                                                  )
                                                                      ? 'default'
                                                                      : 'outline'
                                                              }
                                                              className="cursor-pointer"
                                                              onClick={() => {
                                                                  const newTags =
                                                                      bulkUploadForm.data.tag_ids.includes(
                                                                          tag.id,
                                                                      )
                                                                          ? bulkUploadForm.data.tag_ids.filter(
                                                                                (
                                                                                    id,
                                                                                ) =>
                                                                                    id !==
                                                                                    tag.id,
                                                                            )
                                                                          : [
                                                                                ...bulkUploadForm
                                                                                    .data
                                                                                    .tag_ids,
                                                                                tag.id,
                                                                            ];
                                                                  bulkUploadForm.setData(
                                                                      'tag_ids',
                                                                      newTags,
                                                                  );
                                                              }}
                                                          >
                                                              {tag.name}
                                                          </Badge>
                                                      ))}
                                                  </div>
                                              </div>
                                              <Button
                                                  type="submit"
                                                  disabled={
                                                      bulkUploadForm.processing
                                                  }
                                              >
                                                  Upload
                                              </Button>
                                          </form>
                                      </DialogContent>
                                  </Dialog>

                                  <Dialog
                                      open={showAddDialog}
                                      onOpenChange={setShowAddDialog}
                                  >
                                      <DialogTrigger asChild>
                                          <Button>
                                              <Plus className="mr-2 h-4 w-4" />
                                              Add Subscriber
                                          </Button>
                                      </DialogTrigger>
                                      <DialogContent>
                                          <DialogHeader>
                                              <DialogTitle>
                                                  Add New Subscriber
                                              </DialogTitle>
                                          </DialogHeader>
                                          <form
                                              onSubmit={handleSubmit}
                                              className="space-y-4"
                                          >
                                              <div>
                                                  <Label htmlFor="phone_number">
                                                      Phone Number
                                                  </Label>
                                                  <Input
                                                      id="phone_number"
                                                      value={data.phone_number}
                                                      onChange={(e) =>
                                                          setData(
                                                              'phone_number',
                                                              e.target.value,
                                                          )
                                                      }
                                                      error={
                                                          errors.phone_number
                                                      }
                                                  />
                                              </div>
                                              <div>
                                                  <Label htmlFor="name">
                                                      Name (optional)
                                                  </Label>
                                                  <Input
                                                      id="name"
                                                      value={data.name}
                                                      onChange={(e) =>
                                                          setData(
                                                              'name',
                                                              e.target.value,
                                                          )
                                                      }
                                                  />
                                              </div>
                                              <div>
                                                  <Label>Tags</Label>
                                                  <div className="mt-2 flex flex-wrap gap-2">
                                                      {tags.map((tag) => (
                                                          <Badge
                                                              key={tag.id}
                                                              variant={
                                                                  data.tag_ids.includes(
                                                                      tag.id,
                                                                  )
                                                                      ? 'default'
                                                                      : 'outline'
                                                              }
                                                              className="cursor-pointer"
                                                              onClick={() => {
                                                                  const newTags =
                                                                      data.tag_ids.includes(
                                                                          tag.id,
                                                                      )
                                                                          ? data.tag_ids.filter(
                                                                                (
                                                                                    id,
                                                                                ) =>
                                                                                    id !==
                                                                                    tag.id,
                                                                            )
                                                                          : [
                                                                                ...data.tag_ids,
                                                                                tag.id,
                                                                            ];
                                                                  setData(
                                                                      'tag_ids',
                                                                      newTags,
                                                                  );
                                                              }}
                                                          >
                                                              {tag.name}
                                                          </Badge>
                                                      ))}
                                                  </div>
                                              </div>
                                              <Button
                                                  type="submit"
                                                  disabled={processing}
                                              >
                                                  Add Subscriber
                                              </Button>
                                          </form>
                                      </DialogContent>
                                  </Dialog>
                              </div>
                          </div>
                      </div>

                      <div className="p-6">
                          <Table>
                              <TableHeader>
                                  <TableRow>
                                      <TableHead>Phone Number</TableHead>
                                      {/*<TableHead>Name</TableHead>*/}
                                      <TableHead>Tags</TableHead>
                                      <TableHead>Added</TableHead>
                                      <TableHead>Actions</TableHead>
                                  </TableRow>
                              </TableHeader>
                              <TableBody>
                                  {subscribers.data.map((subscriber) => (
                                      <TableRow key={subscriber.id}>
                                          <TableCell className="font-medium">
                                              {subscriber.phone_number}
                                          </TableCell>
                                          <TableCell>
                                              {subscriber.name || '-'}
                                          </TableCell>
                                          <TableCell>
                                              <div className="flex flex-wrap gap-1">
                                                  {subscriber.tags?.map(
                                                      (tag) => (
                                                          <Badge
                                                              key={tag.id}
                                                              variant="secondary"
                                                          >
                                                              {tag.name}
                                                          </Badge>
                                                      ),
                                                  )}
                                              </div>
                                          </TableCell>
                                          <TableCell>
                                              {new Date(
                                                  subscriber.created_at,
                                              ).toLocaleDateString()}
                                          </TableCell>
                                          <TableCell>
                                              <Button
                                                  variant="destructive"
                                                  size="sm"
                                                  onClick={() =>
                                                      handleDelete(
                                                          subscriber.id,
                                                      )
                                                  }
                                              >
                                                  Delete
                                              </Button>
                                          </TableCell>
                                      </TableRow>
                                  ))}
                              </TableBody>
                          </Table>
                          <Pagination links={paginationLinks} />
                      </div>
                  </div>
              </div>
          </div>
      </AppLayout>
  );
}
