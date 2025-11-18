import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Wand2, Send, Clock, Repeat, Users, Phone, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import axios from 'axios';
import { dashboard } from '../../routes/index.ts';
import { index as campaignIndex, generateSpintax, store as campaignStore } from '../../routes/campaigns/index.ts';
import { create as senderIdCreate } from '../../routes/sender-ids/index.ts';
// import { countVariations, generateSamples } from '../../lib/spintax.js';
import AppLayout from '../../layouts/app-layout.jsx';
import { countVariations, generateSamples } from '../../lib/spintax.js';

export default function Create({ tags, senderIds }) {
    const [generatingSpintax, setGeneratingSpintax] = useState(false);
    const [dispatchNow, setDispatchNow] = useState(true);
    const [isRecurring, setIsRecurring] = useState(false);
    const [recipientType, setRecipientType] = useState('tags');
    const [inputPhones, setInputPhones] = useState('');
    const [phoneState, setPhoneState] = useState({});
    // const [overview, setOverview] = useState(null);
    const [spintaxOverview, setSpintaxOverview] = useState(null);
    const SAMPLE_LIMIT = 100;

    // SMS COUNTER — mirrors backend logic
    const [smsStats, setSmsStats] = useState({
        length: 0,
        smsUnits: 1,
        totalUnits: 0,
    });

    const computeSmsStats = (msg) => {
        const length = msg.length;

        // Each SMS = 160 chars
        const smsUnits = Math.max(Math.ceil(length / 160), 1);

        // Determine recipient count
        let recipientCount = 0;

        if (recipientType === 'tags') {
            recipientCount = selectedTagsCount; // already computed in your code
        } else if (recipientType === 'manual') {
            recipientCount = phoneState.manualRecipientsCount || 0;
        }

        const totalUnits = smsUnits * recipientCount;

        setSmsStats({
            length,
            smsUnits,
            totalUnits,
        });
    };

    // Check if current time is within allowed hours (8am - 8pm WAT)
    const isWithinAllowedHours = () => {
        const now = new Date();
        const watOffset = 1 * 60; // WAT is UTC+1
        const localOffset = now.getTimezoneOffset();
        const watTime = new Date(
            now.getTime() + (watOffset + localOffset) * 60000,
        );
        const hour = watTime.getHours();
        return hour >= 8 && hour < 20; // 8am to 8pm (20:00)
    };

    const getNextAllowedTime = () => {
        const now = new Date();
        const watOffset = 1 * 60;
        const localOffset = now.getTimezoneOffset();
        const watTime = new Date(
            now.getTime() + (watOffset + localOffset) * 60000,
        );
        const hour = watTime.getHours();

        // If before 8am, schedule for 8:30am today
        if (hour < 8) {
            watTime.setHours(8, 30, 0, 0);
        } else {
            // If after 8pm, schedule for 8:30am tomorrow
            watTime.setDate(watTime.getDate() + 1);
            watTime.setHours(8, 30, 0, 0);
        }

        // Convert back to local time
        return new Date(watTime.getTime() - (watOffset + localOffset) * 60000);
    };

    const [showTimeWarning] = useState(!isWithinAllowedHours());

    const { data, setData, post, processing, errors } = useForm({
        name: '',
        message: '',
        sender_id: '',
        spintax_message: '',
        recipient_type: 'tags',
        tag_ids: [],
        phone_numbers: '',
        dispatch_at: null,
        dispatch_now: true,
        is_recurring: false,
        recurrence_type: 'weekly',
        recurrence_interval: 7,
        recurrence_end_date: null,
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

            // Check if API returned an error
            if (response.data.error) {
                alert(response.data.error);
                return;
            }

            const generated = response.data.spintax;
            setData('spintax_message', generated);

            // Count variations and generate samples
            const total = countVariations(generated);
            const sample = generateSamples(generated, 100);

            setSpintaxOverview({ total, sample });
        } catch (error) {
            console.error('Failed to generate spintax:', error);

            // Handle Axios/network errors more gracefully
            if (error.response?.data?.error) {
                alert(error.response.data.error);
            } else {
                alert('Failed to generate spintax. Please try again.');
            }
        } finally {
            setGeneratingSpintax(false);
        }
    };


    // const handleGenerateSpintax = async () => {
    //     if (!data.message) {
    //         alert('Please enter a message first');
    //         return;
    //     }
    //
    //     setGeneratingSpintax(true);
    //     try {
    //         const response = await axios.post(generateSpintax().url, {
    //             message: data.message,
    //         });
    //         setData('spintax_message', response.data.spintax);
    //         setSpintaxOverview(response.data.overview);
    //     } catch (error) {
    //         console.error('Failed to generate spintax:', error);
    //         alert('Failed to generate spintax. Please try again.');
    //     } finally {
    //         setGeneratingSpintax(false);
    //     }
    // };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(campaignStore().url);
    };

    const toggleTag = (tagId) => {
        const newTags = data.tag_ids
            ? data.tag_ids.includes(tagId)
                ? data.tag_ids.filter((id) => id !== tagId)
                : [...data.tag_ids, tagId]
            : [];
        setData('tag_ids', newTags);
    };

    const selectedTagsCount = tags
        .filter((tag) => data.tag_ids?.includes(tag.id))
        .reduce((sum, tag) => sum + (tag.subscribers_count || 0), 0);

    const parsePhoneNumbers = (phoneString) => {
        if (!phoneString.trim()) return [];
        return phoneString
            .split(',')
            .map((num) => num.trim())
            .filter((num) => num.length > 0);
    };

    const handlePhoneChange = (e) => {
        const phoneNumbers = e.target.value;
        const phoneNumbersList = parsePhoneNumbers(phoneNumbers);
        const uniquePhoneNumbers = [...new Set(phoneNumbersList)];
        const manualRecipientsCount = uniquePhoneNumbers.length;
        const hasDuplicates =
            phoneNumbersList.length !== uniquePhoneNumbers.length;

        setInputPhones(phoneNumbers);
        setData('phone_numbers', uniquePhoneNumbers);
        setPhoneState({
            manualRecipientsCount,
            hasDuplicates,
        });
    };

    const phoneErrors = Object.keys(errors)
        .filter((key) => key.startsWith('phone_number'))
        .map((key) => errors[key])
        .join(' ');

    const breadcrumbs = [
        { title: 'Dashboard', href: dashboard().url },
        { title: 'Campaigns', href: campaignIndex().url },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Campaign" />

            <div className="py-12">
                <div className="mx-auto max-w-4xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="border-b p-6">
                            <h2 className="text-2xl font-semibold">
                                Create New Campaign
                            </h2>
                        </div>

                        <div className="space-y-6 p-6">
                            {/* Campaign Name */}
                            <div>
                                <Label htmlFor="name">Campaign Name</Label>
                                <Input
                                    id="name"
                                    value={data.name}
                                    onChange={(e) =>
                                        setData('name', e.target.value)
                                    }
                                    placeholder="e.g., Summer Sale 2025"
                                />
                                {errors.name && (
                                    <p className="mt-1 text-sm text-red-500">
                                        {errors.name}
                                    </p>
                                )}
                            </div>

                            {/* Sender ID */}
                            <div>
                                <Label htmlFor="sender_id">
                                    Sender ID{' '}
                                    <span className="text-red-500">*</span>
                                </Label>
                                <select
                                    id="sender_id"
                                    value={data.sender_id}
                                    onChange={(e) =>
                                        setData('sender_id', e.target.value)
                                    }
                                    className="mt-1 w-full rounded-md border px-3 py-2"
                                >
                                    <option value="">Select a sender ID</option>
                                    {senderIds.length > 0 ? (
                                        senderIds.map((sender) => (
                                            <option
                                                key={sender.id}
                                                value={sender.sender_id}
                                            >
                                                {sender.sender_id}
                                            </option>
                                        ))
                                    ) : (
                                        <option disabled>
                                            No approved sender IDs
                                        </option>
                                    )}
                                </select>
                                {errors.sender_id && (
                                    <p className="mt-1 text-sm text-red-500">
                                        {errors.sender_id}
                                    </p>
                                )}
                                {senderIds.length === 0 && (
                                    <p className="mt-2 flex items-center gap-2 text-sm text-amber-600">
                                        <span>⚠️</span>
                                        <span>
                                            The default WindSMS SenderID will be
                                            used.{' '}
                                            <Link
                                                href={senderIdCreate().url}
                                                className="font-medium underline"
                                            >
                                                Customize your SenderID
                                            </Link>
                                        </span>
                                    </p>
                                )}
                            </div>

                            {/* Message */}
                            <div>
                                <Label htmlFor="message">Message</Label>
                                <Textarea
                                    id="message"
                                    value={data.message}
                                    onChange={(e) => {
                                        const msg = e.target.value;
                                        setData('message', msg);
                                        computeSmsStats(msg);
                                    }}
                                    placeholder="Enter your message here..."
                                    rows={4}
                                />
                                {/* Message Stats */}
                                <div className="mt-2 flex flex-col text-sm text-gray-600">
                                    <div className="flex justify-between">
                                        <span>
                                            Message length:{' '}
                                            <strong>{smsStats.length}</strong>{' '}
                                            chars
                                        </span>
                                        <span>
                                            SMS pages:{' '}
                                            <strong>{smsStats.smsUnits}</strong>
                                        </span>
                                    </div>
                                </div>
                                {errors.message && (
                                    <p className="mt-1 text-sm text-red-500">
                                        {errors.message}
                                    </p>
                                )}
                            </div>

                            {/* Generate Spintax */}
                            <div>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleGenerateSpintax}
                                    disabled={
                                        generatingSpintax || !data.message
                                    }
                                >
                                    <Wand2 className="mr-2 h-4 w-4" />
                                    {generatingSpintax
                                        ? 'Generating...'
                                        : 'Generate Mixtures with AI'}
                                </Button>
                                <p className="mt-2 text-sm text-gray-500">
                                    Spintax creates message variations to make
                                    each SMS unique
                                </p>
                            </div>

                            {/* Spintax Overview - Sample Variations */}
                            {spintaxOverview && (
                                <div className="rounded-lg border-2 border-green-200 bg-green-50 p-4">
                                    <div className="mb-3 flex items-center gap-2">
                                        <Sparkles className="h-5 w-5 text-green-600" />
                                        <h3 className="font-semibold text-green-900">
                                            AI-Generated Message Variations
                                        </h3>
                                    </div>

                                    <div className="mb-4 rounded-md bg-white p-3">
                                        <p className="text-sm font-medium text-gray-700">
                                            We have{' '}
                                            <span className="text-lg font-bold text-green-600">
                                                {spintaxOverview.total.toLocaleString()}
                                            </span>{' '} mixtures available to be sent!
                                        </p>
                                        <p className="mt-1 text-sm text-gray-600">
                                            🎯 100% Deliverability | 🚫 Spam
                                            Filter Eliminated
                                        </p>
                                    </div>

                                    <div>
                                        <Label className="mb-2 text-sm font-medium text-gray-700">
                                            Sample Variations (showing{' '}
                                            {spintaxOverview.sample?.length ||
                                                0}{' '}
                                            of{' '}
                                            {spintaxOverview.total.toLocaleString()}
                                            ):
                                        </Label>
                                        <div className="max-h-64 space-y-2 overflow-y-auto rounded-md bg-white p-3">
                                            {spintaxOverview.sample?.map(
                                                (variation, index) => (
                                                    <div
                                                        key={index}
                                                        className="rounded border border-gray-200 bg-gray-50 p-2 text-sm text-gray-700"
                                                    >
                                                        <span className="font-mono text-xs text-gray-500">
                                                            #{index + 1}
                                                        </span>
                                                        <p className="mt-1">
                                                            {variation}
                                                        </p>
                                                    </div>
                                                ),
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Recipient Type Selection */}
                            <div className="border-t pt-6">
                                <Label className="mb-4 block text-lg">
                                    Recipients
                                </Label>
                                <div className="space-y-4">
                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id="recipient_tags"
                                            checked={recipientType === 'tags'}
                                            onCheckedChange={(checked) => {
                                                if (checked) {
                                                    setRecipientType('tags');
                                                    setData(
                                                        'recipient_type',
                                                        'tags',
                                                    );
                                                    setData(
                                                        'phone_numbers',
                                                        null,
                                                    );
                                                }
                                            }}
                                        />
                                        <Label
                                            htmlFor="recipient_tags"
                                            className="cursor-pointer"
                                        >
                                            <div className="flex items-center gap-2">
                                                <Users className="h-4 w-4" />
                                                Send to tagged subscribers
                                            </div>
                                        </Label>
                                    </div>

                                    {recipientType === 'tags' && (
                                        <div className="ml-6 rounded-md bg-gray-50 p-4">
                                            <Label>Select Target Tags</Label>
                                            <div className="mt-2 flex flex-wrap gap-2">
                                                {tags.map((tag) => (
                                                    <Badge
                                                        key={tag.id}
                                                        variant={
                                                            data.tag_ids?.includes(
                                                                tag.id,
                                                            )
                                                                ? 'default'
                                                                : 'outline'
                                                        }
                                                        className="cursor-pointer"
                                                        style={
                                                            data.tag_ids?.includes(
                                                                tag.id,
                                                            )
                                                                ? {
                                                                      backgroundColor:
                                                                          tag.color,
                                                                  }
                                                                : {}
                                                        }
                                                        onClick={() =>
                                                            toggleTag(tag.id)
                                                        }
                                                    >
                                                        {tag.name} (
                                                        {tag.subscribers_count ||
                                                            0}
                                                        )
                                                    </Badge>
                                                ))}
                                            </div>
                                            {errors.tag_ids && (
                                                <p className="mt-1 text-sm text-red-500">
                                                    {errors.tag_ids}
                                                </p>
                                            )}
                                            {selectedTagsCount > 0 && (
                                                <p className="mt-2 text-sm text-gray-600">
                                                    Total unique recipients:{' '}
                                                    <strong>
                                                        {selectedTagsCount}
                                                    </strong>
                                                </p>
                                            )}
                                        </div>
                                    )}

                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id="recipient_manual"
                                            checked={recipientType === 'manual'}
                                            onCheckedChange={(checked) => {
                                                if (checked) {
                                                    setRecipientType('manual');
                                                    setData(
                                                        'recipient_type',
                                                        'manual',
                                                    );
                                                    setData('tag_ids', null);
                                                }
                                            }}
                                        />
                                        <Label
                                            htmlFor="recipient_manual"
                                            className="cursor-pointer"
                                        >
                                            <div className="flex items-center gap-2">
                                                <Phone className="h-4 w-4" />
                                                Enter phone numbers manually
                                            </div>
                                        </Label>
                                    </div>

                                    {recipientType === 'manual' && (
                                        <div className="ml-6 rounded-md bg-gray-50 p-4">
                                            <Label htmlFor="phone_numbers">
                                                Phone Numbers
                                            </Label>
                                            <Textarea
                                                id="phone_numbers"
                                                value={inputPhones}
                                                onChange={handlePhoneChange}
                                                placeholder="Enter phone numbers separated by commas (e.g., 08012345678, 08087654321, 07012345678)"
                                                rows={4}
                                                className="mt-1 font-mono text-sm"
                                                error={phoneErrors}
                                            />
                                            {errors.phone_numbers && (
                                                <p className="mt-1 text-sm text-red-500">
                                                    {errors.phone_numbers}
                                                </p>
                                            )}
                                            <div className="mt-2 space-y-1">
                                                {phoneState.manualRecipientsCount >
                                                    0 && (
                                                    <p className="text-sm text-gray-600">
                                                        Unique recipients:{' '}
                                                        <strong>
                                                            {
                                                                phoneState.manualRecipientsCount
                                                            }
                                                        </strong>
                                                    </p>
                                                )}
                                                {phoneState.hasDuplicates && (
                                                    <p className="text-sm text-yellow-600">
                                                        ⚠️ Duplicates detected -
                                                        they will be removed
                                                        automatically
                                                    </p>
                                                )}
                                                <p className="text-sm text-gray-500">
                                                    Tip: Separate phone numbers
                                                    with commas. Duplicates will
                                                    be automatically removed.
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Dispatch Options */}
                            <div className="border-t pt-6">
                                <Label className="text-lg">
                                    Dispatch Schedule
                                </Label>

                                {/* Time Warning */}
                                {showTimeWarning && dispatchNow && (
                                    <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-4">
                                        <div className="flex gap-3">
                                            <Clock className="h-5 w-5 shrink-0 text-amber-600" />
                                            <div>
                                                <p className="font-medium text-amber-900">
                                                    Outside Allowed Hours
                                                </p>
                                                <p className="mt-1 text-sm text-amber-700">
                                                    SMS can only be sent between
                                                    8:00 AM and 8:00 PM WAT.
                                                    Your message will be
                                                    automatically scheduled for{' '}
                                                    {getNextAllowedTime().toLocaleString(
                                                        'en-US',
                                                        {
                                                            month: 'short',
                                                            day: 'numeric',
                                                            hour: '2-digit',
                                                            minute: '2-digit',
                                                        },
                                                    )}{' '}
                                                    or you can schedule it
                                                    manually below.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="mt-4 space-y-4">
                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id="dispatch_now"
                                            checked={dispatchNow}
                                            onCheckedChange={(checked) => {
                                                setDispatchNow(checked);
                                                setData(
                                                    'dispatch_now',
                                                    checked,
                                                );
                                                if (checked) {
                                                    setData(
                                                        'dispatch_at',
                                                        null,
                                                    );
                                                }
                                            }}
                                        />
                                        <Label
                                            htmlFor="dispatch_now"
                                            className="cursor-pointer"
                                        >
                                            <div className="flex items-center gap-2">
                                                <Send className="h-4 w-4" />
                                                Send immediately
                                                {showTimeWarning && (
                                                    <span className="text-xs text-amber-600">
                                                        (will be scheduled for
                                                        next allowed time)
                                                    </span>
                                                )}
                                            </div>
                                        </Label>
                                    </div>

                                    {!dispatchNow && (
                                        <div>
                                            <Label htmlFor="dispatch_at">
                                                <div className="mb-2 flex items-center gap-2">
                                                    <Clock className="h-4 w-4" />
                                                    Schedule for later
                                                </div>
                                            </Label>
                                            <DatePicker
                                                selected={data.dispatch_at}
                                                onChange={(date) =>
                                                    setData('dispatch_at', date)
                                                }
                                                showTimeSelect
                                                minDate={new Date()}
                                                minTime={new Date().setHours(
                                                    8,
                                                    0,
                                                    0,
                                                    0,
                                                )}
                                                maxTime={new Date().setHours(
                                                    20,
                                                    0,
                                                    0,
                                                    0,
                                                )}
                                                filterTime={(time) => {
                                                    const hour =
                                                        time.getHours();
                                                    return (
                                                        hour >= 8 && hour < 20
                                                    );
                                                }}
                                                dateFormat="MMMM d, yyyy h:mm aa"
                                                className="w-full rounded-md border px-3 py-2"
                                                placeholderText="Select date and time (8am - 8pm only)"
                                            />
                                            <p className="mt-2 text-xs text-gray-500">
                                                ⏰ SMS can only be scheduled
                                                between 8:00 AM and 8:00 PM WAT
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Recurring Options */}
                            <div className="border-t pt-6">
                                <div className="mb-4 flex items-center space-x-2">
                                    <Checkbox
                                        id="is_recurring"
                                        checked={isRecurring}
                                        onCheckedChange={(checked) => {
                                            setIsRecurring(checked);
                                            setData('is_recurring', checked);
                                            if (!checked) {
                                                setData(
                                                    'recurrence_type',
                                                    'weekly',
                                                );
                                                setData(
                                                    'recurrence_interval',
                                                    7,
                                                );
                                                setData(
                                                    'recurrence_end_date',
                                                    null,
                                                );
                                            }
                                        }}
                                    />
                                    <Label
                                        htmlFor="is_recurring"
                                        className="cursor-pointer"
                                    >
                                        <div className="flex items-center gap-2">
                                            <Repeat className="h-4 w-4" />
                                            Make this a recurring campaign
                                        </div>
                                    </Label>
                                </div>

                                {isRecurring && (
                                    <div className="ml-6 space-y-4 rounded-md bg-gray-50 p-4">
                                        <div>
                                            <Label htmlFor="recurrence_type">
                                                Recurrence Frequency
                                            </Label>
                                            <select
                                                id="recurrence_type"
                                                value={data.recurrence_type}
                                                onChange={(e) => {
                                                    const type = e.target.value;
                                                    setData(
                                                        'recurrence_type',
                                                        type,
                                                    );
                                                    if (type === 'daily')
                                                        setData(
                                                            'recurrence_interval',
                                                            1,
                                                        );
                                                    else if (type === 'weekly')
                                                        setData(
                                                            'recurrence_interval',
                                                            7,
                                                        );
                                                    else if (type === 'monthly')
                                                        setData(
                                                            'recurrence_interval',
                                                            30,
                                                        );
                                                }}
                                                className="mt-1 w-full rounded-md border px-3 py-2"
                                            >
                                                <option value="daily">
                                                    Daily
                                                </option>
                                                <option value="weekly">
                                                    Weekly
                                                </option>
                                                <option value="monthly">
                                                    Monthly
                                                </option>
                                                <option value="custom">
                                                    Custom Interval
                                                </option>
                                            </select>
                                        </div>

                                        {data.recurrence_type === 'custom' && (
                                            <div>
                                                <Label htmlFor="recurrence_interval">
                                                    Interval (Days)
                                                </Label>
                                                <Input
                                                    id="recurrence_interval"
                                                    type="number"
                                                    min="1"
                                                    max="365"
                                                    value={
                                                        data.recurrence_interval
                                                    }
                                                    onChange={(e) =>
                                                        setData(
                                                            'recurrence_interval',
                                                            parseInt(
                                                                e.target.value,
                                                            ),
                                                        )
                                                    }
                                                    placeholder="e.g., 3 for every 3 days"
                                                />
                                            </div>
                                        )}

                                        <div>
                                            <Label htmlFor="recurrence_end_date">
                                                End Date (Optional)
                                            </Label>
                                            <DatePicker
                                                selected={
                                                    data.recurrence_end_date
                                                }
                                                onChange={(date) =>
                                                    setData(
                                                        'recurrence_end_date',
                                                        date,
                                                    )
                                                }
                                                showTimeSelect
                                                minDate={new Date()}
                                                dateFormat="MMMM d, yyyy h:mm aa"
                                                className="mt-1 w-full rounded-md border px-3 py-2"
                                                placeholderText="Select end date (leave empty for no end)"
                                                isClearable
                                            />
                                            <p className="mt-1 text-sm text-gray-500">
                                                Leave empty if you want the
                                                campaign to run indefinitely
                                            </p>
                                        </div>
                                    </div>
                                )}
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
                                <Button
                                    onClick={handleSubmit}
                                    disabled={processing}
                                >
                                    {dispatchNow
                                        ? 'Create & Send Now'
                                        : 'Schedule Campaign'}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
