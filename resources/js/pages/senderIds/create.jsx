import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Head, useForm } from '@inertiajs/react';
import { ArrowLeft, Info } from 'lucide-react';
import AppLayout from '../../layouts/app-layout.jsx';
import { store as senderIdStore } from '../../routes/sender-ids';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        sender_id: '',
        purpose: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(senderIdStore().url);
    };

    const breadcrumbs = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Sender IDs', href: '/sender-ids' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Apply for Sender ID" />

            <div className="py-12">
                <div className="mx-auto max-w-3xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="border-b p-6">
                            <h2 className="text-2xl font-semibold">
                                Apply for Sender ID
                            </h2>
                            <p className="mt-1 text-sm text-gray-600">
                                Submit an application to use a custom sender ID
                                for your campaigns
                            </p>
                        </div>

                        <div className="p-6">
                            {/* Information Box */}
                            <div className="mb-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
                                <div className="flex gap-3">
                                    <Info className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-500" />
                                    <div className="text-sm text-blue-800">
                                        <p className="mb-2 font-semibold">
                                            Important Information:
                                        </p>
                                        <ul className="list-inside list-disc space-y-1">
                                            <li>
                                                Sender IDs must be alphanumeric
                                                (no special
                                                characters)
                                            </li>
                                            <li>Maximum 11 characters</li>
                                            <li>
                                                Your application will be
                                                reviewed by our team
                                            </li>
                                            <li>
                                                Approval typically takes 1-3
                                                business days
                                            </li>
                                            <li>
                                                Provide a clear purpose for
                                                better approval chances
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                {/* Sender ID Input */}
                                <div>
                                    <Label htmlFor="sender_id">
                                        Sender ID{' '}
                                        <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="sender_id"
                                        value={data.sender_id}
                                        onChange={(e) => {
                                            // Auto convert to uppercase and remove invalid characters
                                            const value = e.target.value
                                                .replace(/[^a-zA-Z0-9 ]/g, '');
                                            setData('sender_id', value);
                                        }}
                                        placeholder="e.g., MYCOMPANY"
                                        maxLength={11}
                                        className="font-mono"
                                    />
                                    <p className="mt-1 text-xs text-gray-500">
                                        {data.sender_id.length}/11 characters
                                    </p>
                                    {errors.sender_id && (
                                        <p className="mt-1 text-sm text-red-500">
                                            {errors.sender_id}
                                        </p>
                                    )}
                                </div>

                                {/* Purpose Textarea */}
                                <div>
                                    <Label htmlFor="purpose">
                                        Purpose{' '}
                                        <span className="text-red-500">*</span>
                                    </Label>
                                    <Textarea
                                        id="purpose"
                                        value={data.purpose}
                                        onChange={(e) =>
                                            setData('purpose', e.target.value)
                                        }
                                        placeholder="Explain why you need this sender ID and how you plan to use it..."
                                        rows={5}
                                        maxLength={500}
                                    />
                                    <p className="mt-1 text-xs text-gray-500">
                                        {data.purpose.length}/500 characters
                                    </p>
                                    {errors.purpose && (
                                        <p className="mt-1 text-sm text-red-500">
                                            {errors.purpose}
                                        </p>
                                    )}
                                </div>

                                {/* Examples */}
                                <div className="rounded-lg bg-gray-50 p-4">
                                    <p className="mb-2 text-sm font-medium">
                                        Examples of good purposes:
                                    </p>
                                    <ul className="list-inside list-disc space-y-1 text-sm text-gray-600">
                                        <li>
                                            "For sending order notifications and
                                            delivery updates to our e-commerce
                                            customers"
                                        </li>
                                        <li>
                                            "Marketing campaigns for our retail
                                            clothing brand targeting existing
                                            customers"
                                        </li>
                                        <li>
                                            "Appointment reminders and
                                            confirmations for our medical clinic
                                            patients"
                                        </li>
                                    </ul>
                                </div>

                                {/* Submit Buttons */}
                                <div className="flex justify-end gap-3 pt-4">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => window.history.back()}
                                    >
                                        <ArrowLeft className="mr-2 h-4 w-4" />
                                        Cancel
                                    </Button>
                                    <Button
                                        onClick={handleSubmit}
                                        disabled={processing}
                                    >
                                        Submit Application
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
