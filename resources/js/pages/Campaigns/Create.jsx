import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Wand2, Send, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import axios from 'axios';
import { dashboard } from '../../routes/index.ts';
import { index as campaignIndex, generateSpintax, store as campaignStore } from '../../routes/campaigns/index.ts';
import AppLayout from '../../layouts/app-layout.jsx';

export default function Create({ tags }) {
  const [generatingSpintax, setGeneratingSpintax] = useState(false);
  const [dispatchNow, setDispatchNow] = useState(true);

  const { data, setData, post, processing, errors } = useForm({
    name: '',
    message: '',
    spintax_message: '',
    tag_ids: [],
    dispatch_at: null,
    dispatch_now: true,
  });

  const handleGenerateSpintax = async () => {
    if (!data.message) {
      alert('Please enter a message first');
      return;
    }

    setGeneratingSpintax(true);
    try {
      const response = await axios.post(generateSpintax().url, {
        message: data.message,
      });
      setData('spintax_message', response.data.spintax);
    } catch (error) {
      console.error('Failed to generate spintax:', error);
      alert('Failed to generate spintax. Please try again.');
    } finally {
      setGeneratingSpintax(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    post(campaignStore().url);
  };

  const toggleTag = (tagId) => {
    const newTags = data.tag_ids.includes(tagId)
      ? data.tag_ids.filter((id) => id !== tagId)
      : [...data.tag_ids, tagId];
    setData('tag_ids', newTags);
  };

  const selectedTagsCount = tags
    .filter((tag) => data.tag_ids.includes(tag.id))
    .reduce((sum, tag) => sum + (tag.subscribers_count || 0), 0);

    const breadcrumbs = [
        {
            title: 'Dashboard',
            href: dashboard().url,
        },
        {
            title: 'Campaigns',
            href: campaignIndex().url,
        },
    ];
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Create Campaign" />

      <div className="py-12">
        <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6 border-b">
              <h2 className="text-2xl font-semibold">Create New Campaign</h2>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Campaign Name */}
              <div>
                <Label htmlFor="name">Campaign Name</Label>
                <Input
                  id="name"
                  value={data.name}
                  onChange={(e) => setData('name', e.target.value)}
                  placeholder="e.g., Summer Sale 2025"
                  error={errors.name}
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>

              {/* Original Message */}
              <div>
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  value={data.message}
                  onChange={(e) => setData('message', e.target.value)}
                  placeholder="Enter your message here..."
                  rows={4}
                  error={errors.message}
                />
                {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
              </div>

              {/* Generate Spintax Button */}
              <div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleGenerateSpintax}
                  disabled={generatingSpintax || !data.message}
                >
                  <Wand2 className="w-4 h-4 mr-2" />
                  {generatingSpintax ? 'Generating...' : 'Generate Spintax with AI'}
                </Button>
                <p className="text-sm text-gray-500 mt-2">
                  Spintax creates message variations to make each SMS unique
                </p>
              </div>

              {/* Spintax Message */}
              <div>
                <Label htmlFor="spintax_message">Spintax Message (Generated)</Label>
                <Textarea
                  id="spintax_message"
                  value={data.spintax_message}
                  onChange={(e) => setData('spintax_message', e.target.value)}
                  placeholder="Spintax version will appear here..."
                  rows={5}
                  error={errors.spintax_message}
                />
                <p className="text-sm text-gray-500 mt-1">
                  Example: {'{Hello|Hi|Hey}'} {'{friend|there}'}!
                </p>
              </div>

              {/* Select Tags */}
              <div>
                <Label>Select Target Tags</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {tags.map((tag) => (
                    <Badge
                      key={tag.id}
                      variant={data.tag_ids.includes(tag.id) ? 'default' : 'outline'}
                      className="cursor-pointer"
                      style={
                        data.tag_ids.includes(tag.id)
                          ? { backgroundColor: tag.color }
                          : {}
                      }
                      onClick={() => toggleTag(tag.id)}
                    >
                      {tag.name} ({tag.subscribers_count || 0})
                    </Badge>
                  ))}
                </div>
                {errors.tag_ids && <p className="text-red-500 text-sm mt-1">{errors.tag_ids}</p>}
                {selectedTagsCount > 0 && (
                  <p className="text-sm text-gray-600 mt-2">
                    Total recipients: <strong>{selectedTagsCount}</strong>
                  </p>
                )}
              </div>

              {/* Dispatch Options */}
              <div className="border-t pt-6">
                <Label className="text-lg">Dispatch Schedule</Label>
                <div className="mt-4 space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="dispatch_now"
                      checked={dispatchNow}
                      onCheckedChange={(checked) => {
                        setDispatchNow(checked);
                        setData('dispatch_now', checked);
                        if (checked) {
                          setData('dispatch_at', null);
                        }
                      }}
                    />
                    <Label htmlFor="dispatch_now" className="cursor-pointer">
                      <div className="flex items-center gap-2">
                        <Send className="w-4 h-4" />
                        Send immediately
                      </div>
                    </Label>
                  </div>

                  {!dispatchNow && (
                    <div>
                      <Label htmlFor="dispatch_at">
                        <div className="flex items-center gap-2 mb-2">
                          <Clock className="w-4 h-4" />
                          Schedule for later
                        </div>
                      </Label>
                      <DatePicker
                        selected={data.dispatch_at}
                        onChange={(date) => setData('dispatch_at', date)}
                        showTimeSelect
                        minDate={new Date()}
                        dateFormat="MMMM d, yyyy h:mm aa"
                        className="w-full px-3 py-2 border rounded-md"
                        placeholderText="Select date and time"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end gap-3 pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => window.history.back()}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={processing}>
                  {dispatchNow ? 'Create & Send Now' : 'Schedule Campaign'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
