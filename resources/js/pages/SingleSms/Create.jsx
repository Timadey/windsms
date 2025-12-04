import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout.jsx';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { dashboard } from '../../routes/index.ts';
import singleSms from '../../routes/single-sms/index.ts';
import InputError from '@/components/input-error.jsx';
import { create as senderIdCreate } from '../../routes/sender-ids/index.ts';

const breadcrumbs = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
    {
        title: 'Single SMS',
        href: singleSms.index().url,
    },
];

export default function Create({ senderIds }) {
    const { data, setData, post, processing, errors } = useForm({
        sender_id: '',
        recipient_type: 'manual',
        phone_number: '',
        subscriber_id: '',
        message: '',
    });

    const [recipientType, setRecipientType] = useState('manual');
    const [subscribers, setSubscribers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);

    useEffect(() => {
        if (recipientType === 'subscriber' && searchQuery.length > 0) {
            setIsSearching(true);
            const debounce = setTimeout(() => {
                axios.get(singleSms.searchSubscribers().url, {
                    params: { query: searchQuery }
                })
                    .then((response) => {
                        setSubscribers(response.data);
                        setIsSearching(false);
                    })
                    .catch(() => {
                        setIsSearching(false);
                    });
            }, 300);

            return () => clearTimeout(debounce);
        } else {
            setSubscribers([]);
        }
    }, [searchQuery, recipientType]);

    const submit = (e) => {
        e.preventDefault();
        post(singleSms.store().url);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Send Single SMS" />

            <div className="py-12">
                <div className="mx-auto max-w-2xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="border-b p-6">
                            <h2 className="text-2xl font-semibold">
                                Send Single SMS
                            </h2>
                        </div>

                        <div className="p-6">
                            <form onSubmit={submit} className="space-y-6">
                                {/* Sender ID */}
                                <div>
                                    <Label htmlFor="sender_id">Sender ID</Label>
                                    <select
                                        id="sender_id"
                                        value={data.sender_id}
                                        onChange={(e) =>
                                            setData('sender_id', e.target.value)
                                        }
                                        className="mt-1 w-full rounded-md border px-3 py-2"
                                    >
                                        <option value="">
                                            Select a sender ID
                                        </option>
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
                                                Default sender ID will be used
                                                if empty
                                            </option>
                                        )}
                                    </select>
                                    <InputError
                                        message={errors.sender_id}
                                        className="mt-1"
                                    />
                                </div>
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

                                {/* Recipient Type Selection */}
                                <div className="space-y-4">
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
                                                    setData(
                                                        'subscriber_id',
                                                        '',
                                                    );
                                                }
                                            }}
                                        />
                                        <Label
                                            htmlFor="recipient_manual"
                                            className="cursor-pointer"
                                        >
                                            Enter phone number manually
                                        </Label>
                                    </div>

                                    {recipientType === 'manual' && (
                                        <div className="ml-6">
                                            <Label htmlFor="phone_number">
                                                Phone Number
                                            </Label>
                                            <Input
                                                id="phone_number"
                                                placeholder="e.g. 08012345678"
                                                value={data.phone_number}
                                                onChange={(e) =>
                                                    setData(
                                                        'phone_number',
                                                        e.target.value,
                                                    )
                                                }
                                                className="mt-1"
                                            />
                                            <InputError
                                                message={errors.phone_number}
                                                className="mt-1"
                                            />
                                        </div>
                                    )}

                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id="recipient_subscriber"
                                            checked={
                                                recipientType === 'subscriber'
                                            }
                                            onCheckedChange={(checked) => {
                                                if (checked) {
                                                    setRecipientType(
                                                        'subscriber',
                                                    );
                                                    setData(
                                                        'recipient_type',
                                                        'subscriber',
                                                    );
                                                    setData('phone_number', '');
                                                }
                                            }}
                                        />
                                        <Label
                                            htmlFor="recipient_subscriber"
                                            className="cursor-pointer"
                                        >
                                            Search for subscriber
                                        </Label>
                                    </div>

                                    {recipientType === 'subscriber' && (
                                        <div className="ml-6 space-y-2">
                                            <Label htmlFor="subscriber_search">
                                                Search Subscriber
                                            </Label>
                                            <Input
                                                id="subscriber_search"
                                                placeholder="Type name or phone number..."
                                                value={searchQuery}
                                                onChange={(e) =>
                                                    setSearchQuery(
                                                        e.target.value,
                                                    )
                                                }
                                                className="mt-1"
                                            />

                                            {isSearching && (
                                                <p className="text-sm text-gray-500">
                                                    Searching...
                                                </p>
                                            )}

                                            {subscribers.length > 0 && (
                                                <div className="mt-2 max-h-48 overflow-y-auto rounded-md border">
                                                    {subscribers.map((sub) => (
                                                        <div
                                                            key={sub.id}
                                                            onClick={() => {
                                                                setData(
                                                                    'subscriber_id',
                                                                    sub.id,
                                                                );
                                                                setSearchQuery(
                                                                    `${sub.name || 'Unknown'} (${sub.phone_number})`,
                                                                );
                                                                setSubscribers(
                                                                    [],
                                                                );
                                                            }}
                                                            className={`cursor-pointer p-2 hover:bg-gray-100 ${
                                                                data.subscriber_id ===
                                                                sub.id
                                                                    ? 'bg-blue-50'
                                                                    : ''
                                                            }`}
                                                        >
                                                            <div className="font-medium">
                                                                {sub.name ||
                                                                    'Unknown'}
                                                            </div>
                                                            <div className="text-sm text-gray-500">
                                                                {
                                                                    sub.phone_number
                                                                }
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            <InputError
                                                message={errors.subscriber_id}
                                                className="mt-1"
                                            />
                                        </div>
                                    )}
                                </div>

                                {/* Message */}
                                <div>
                                    <Label htmlFor="message">Message</Label>
                                    <Textarea
                                        id="message"
                                        placeholder="Type your message here..."
                                        value={data.message}
                                        onChange={(e) =>
                                            setData('message', e.target.value)
                                        }
                                        rows={4}
                                        className="mt-1"
                                    />
                                    <div className="mt-1 text-right text-xs text-gray-500">
                                        {data.message.length} characters
                                    </div>
                                    <InputError
                                        message={errors.message}
                                        className="mt-1"
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full"
                                >
                                    {processing ? 'Sending...' : 'Send SMS'}
                                </Button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
