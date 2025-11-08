import { Head, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
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
import { index as tagsIndex, store as tagsStore, update as tagsUpdate } from '../../routes/tags/index.ts';

export default function Index({ tags }) {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingTag, setEditingTag] = useState(null);

  const { data, setData, post, put, processing, reset, errors } = useForm({
    name: '',
    color: '#3b82f6',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingTag) {
      put(tagsUpdate.url(editingTag.id), {
        onSuccess: () => {
          reset();
          setEditingTag(null);
        },
      });
    } else {
      post(tagsStore().url, {
          onSuccess: () => {
              reset();
              setShowAddDialog(false);
          },
      });
    }
  };

  const handleEdit = (tag) => {
    setEditingTag(tag);
    setData({
      name: tag.name,
      color: tag.color,
    });
  };

  const handleDelete = (tagId) => {
    if (confirm('Are you sure you want to delete this tag?')) {
      router.delete(route('tags.destroy', tagId));
    }
  };

  const colorOptions = [
    '#3b82f6', // blue
    '#10b981', // green
    '#f59e0b', // yellow
    '#ef4444', // red
    '#8b5cf6', // purple
    '#ec4899', // pink
    '#06b6d4', // cyan
    '#f97316', // orange
  ];

    const breadcrumbs = [
        {
            title: 'Dashboard',
            href: dashboard().url,
        },
        {
            title: 'Tags',
            href: tagsIndex().url,
        },
    ];

    return (
      <AppLayout breadcrumbs={breadcrumbs}>
          <Head title="Tags" />

          <div className="py-12">
            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
              <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                <div className="p-6 border-b">
                  <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-semibold">Tags</h2>
                    <Dialog open={showAddDialog || editingTag !== null} onOpenChange={(open) => {
                      setShowAddDialog(open);
                      if (!open) {
                        setEditingTag(null);
                        reset();
                      }
                    }}>
                      <DialogTrigger asChild>
                        <Button>
                          <Plus className="w-4 h-4 mr-2" />
                          Add Tag
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>{editingTag ? 'Edit Tag' : 'Add New Tag'}</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4">
                          <div>
                            <Label htmlFor="name">Tag Name</Label>
                            <Input
                              id="name"
                              value={data.name}
                              onChange={(e) => setData('name', e.target.value)}
                              error={errors.name}
                            />
                          </div>
                          <div>
                            <Label>Color</Label>
                            <div className="flex gap-2 mt-2">
                              {colorOptions.map((color) => (
                                <button
                                  key={color}
                                  type="button"
                                  className={`w-8 h-8 rounded-full border-2 ${
                                    data.color === color ? 'border-gray-900' : 'border-gray-300'
                                  }`}
                                  style={{ backgroundColor: color }}
                                  onClick={() => setData('color', color)}
                                />
                              ))}
                            </div>
                          </div>
                          <Button type="submit" disabled={processing}>
                            {editingTag ? 'Update Tag' : 'Add Tag'}
                          </Button>
                        </form>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>

                <div className="p-6">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Color</TableHead>
                        <TableHead>Subscribers</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {tags.map((tag) => (
                        <TableRow key={tag.id}>
                          <TableCell>
                            <Badge style={{ backgroundColor: tag.color }}>
                              {tag.name}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div
                                className="w-6 h-6 rounded-full border"
                                style={{ backgroundColor: tag.color }}
                              />
                              <span className="text-sm text-gray-600">{tag.color}</span>
                            </div>
                          </TableCell>
                          <TableCell>{tag.subscribers_count || 0}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEdit(tag)}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleDelete(tag.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          </div>
      </AppLayout>
  );
}
