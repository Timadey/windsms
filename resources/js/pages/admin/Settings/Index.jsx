import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import InputError from '@/components/input-error';
import admin from '../../../routes/admin/index.ts';

export default function SettingsIndex({ settings }) {
    const { data, setData, post, processing, errors } = useForm({
        settings: [
            {
                key: 'sms_provider',
                value: settings.sms_provider || 'mtn',
                group: 'sms',
                label: 'Active SMS Provider',
                type: 'select',
                options: [
                    { value: 'mtn', label: 'MTN Nigeria' },
                    { value: 'smslive247', label: 'SMSLive247' },
                ]
            },
            {
                key: 'smslive247_api_key',
                value: settings.smslive247_api_key || '',
                group: 'sms',
                label: 'SMSLive247 API Key',
                type: 'password',
            },
            // Add more settings here as needed
        ]
    });

    const updateSetting = (index, value) => {
        const newSettings = [...data.settings];
        newSettings[index].value = value;
        setData('settings', newSettings);
    };

    const submit = (e) => {
        e.preventDefault();
        post(admin.settings.update(), {
            preserveScroll: true,
        });
    };

    return (
        <AppLayout breadcrumbs={[
            { title: 'Admin', href: '#' },
            { title: 'Settings', href: admin.settings.index() },
        ]}>
            <Head title="System Settings" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>SMS Configuration</CardTitle>
                            <CardDescription>
                                Configure SMS providers and API keys.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={submit} className="space-y-6">
                                {data.settings.map((setting, index) => (
                                    <div key={setting.key} className="space-y-2">
                                        <Label htmlFor={setting.key}>{setting.label}</Label>

                                        {setting.type === 'select' ? (
                                            <Select
                                                value={setting.value}
                                                onValueChange={(val) => updateSetting(index, val)}
                                            >
                                                <SelectTrigger className="w-full md:w-1/2">
                                                    <SelectValue placeholder="Select provider" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {setting.options.map((opt) => (
                                                        <SelectItem key={opt.value} value={opt.value}>
                                                            {opt.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        ) : (
                                            <Input
                                                id={setting.key}
                                                type={setting.type || 'text'}
                                                value={setting.value}
                                                onChange={(e) => updateSetting(index, e.target.value)}
                                                className="w-full md:w-1/2"
                                                placeholder={setting.label}
                                            />
                                        )}

                                        <InputError message={errors[`settings.${index}.value`]} />
                                    </div>
                                ))}

                                <div className="flex items-center gap-4">
                                    <Button disabled={processing}>
                                        Save Changes
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
