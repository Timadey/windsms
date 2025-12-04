<?php

namespace App\Services;

use App\Jobs\ImportSubscribersJob;
use App\Models\Subscriber;
use App\Models\User;
use App\Shared\Enums\FeaturesEnum;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Storage;
use League\Csv\Reader;

class SubscriberService
{
    /**
     * Create a single or multiple subscribers
     */
    public function createSubscribers(array $phoneNumbers, User $user, ?string $name = null, ?array $tagIds = null): int
    {
        // Validate feature consumption
        $numberOfContacts = count($phoneNumbers);
        if ($user->cantConsume(FeaturesEnum::contacts->value, $numberOfContacts)) {
            throw new \Exception('You do not have enough credits to add this number of contacts.');
        }

        $user->consume(FeaturesEnum::contacts->value, $numberOfContacts);

        $imported = 0;

        if (count($phoneNumbers) > 1) {
            foreach ($phoneNumbers as $phoneNumber) {
                $formattedPhoneNumber = formatPhoneNumber($phoneNumber);
                if (strlen($formattedPhoneNumber) != 11) continue;

                $subscriber = Subscriber::updateOrCreate([
                    'phone_number' => $formattedPhoneNumber,
                    'user_id' => $user->id
                ]);

                if (!empty($tagIds)) {
                    $subscriber->tags()->sync($tagIds, false);
                }
                $imported++;
            }
        } else {
            $phone = $phoneNumbers[0];
            $subscriber = Subscriber::updateOrCreate([
                'user_id' => $user->id,
                'phone_number' => formatPhoneNumber($phone)
            ], [
                'name' => $name ?? null
            ]);

            if (!empty($tagIds)) {
                $subscriber->tags()->sync($tagIds, false);
            }
            $imported = 1;
        }

        return $imported;
    }

    /**
     * Update a subscriber
     */
    public function updateSubscriber(Subscriber $subscriber, array $data): Subscriber
    {
        $subscriber->update([
            'phone_number' => formatPhoneNumber($data['phone_number']),
            'name' => $data['name'] ?? null,
        ]);

        if (isset($data['tag_ids'])) {
            $subscriber->tags()->sync($data['tag_ids']);
        }

        return $subscriber;
    }

    /**
     * Delete a subscriber
     */
    public function deleteSubscriber(Subscriber $subscriber): void
    {
        $subscriber->delete();
    }

    /**
     * Bulk import subscribers from CSV
     */
    public function bulkImport(UploadedFile $file, User $user, ?array $tagIds = null): array
    {
        $csv = Reader::createFromPath($file->getRealPath(), 'r');
        $csv->setHeaderOffset(0);

        $headers = $csv->getHeader();

        // Validate headers
        $hasPhoneNumber = in_array('phone_number', $headers);
        $hasPhone = in_array('phone', $headers);

        if (!$hasPhoneNumber && !$hasPhone) {
            throw new \Exception('CSV file must contain either "phone_number" or "phone" column header.');
        }

        $records = iterator_to_array($csv->getRecords());
        $totalRecords = count($records);

        if ($totalRecords === 0) {
            throw new \Exception('CSV file is empty or contains no valid records.');
        }

        // Check feature consumption
        if ($user->cantConsume(FeaturesEnum::contacts->value, $totalRecords)) {
            throw new \Exception('You do not have enough credits to add this number of contacts.');
        }

        $user->consume(FeaturesEnum::contacts->value, $totalRecords);

        // For large files, process in background
        if ($totalRecords > 500) {
            $filename = 'imports/' . uniqid() . '_' . $file->getClientOriginalName();
            Storage::put($filename, file_get_contents($file->getRealPath()));

            ImportSubscribersJob::dispatch($user->id, $filename, $tagIds ?? []);

            return [
                'background' => true,
                'total' => $totalRecords,
                'message' => "Your import of {$totalRecords} subscribers has been queued and will be processed in the background."
            ];
        }

        // Process immediately for smaller files
        return $this->processImportRecords($records, $user, $tagIds);
    }

    /**
     * Process import records immediately
     */
    private function processImportRecords(array $records, User $user, ?array $tagIds): array
    {
        $imported = 0;
        $skipped = 0;
        $errors = [];

        foreach ($records as $index => $record) {
            try {
                $phoneNumber = $record['phone_number'] ?? $record['phone'] ?? null;

                if (empty($phoneNumber)) {
                    $skipped++;
                    continue;
                }

                $phoneNumber = formatPhoneNumber($phoneNumber);

                if (empty($phoneNumber)) {
                    $skipped++;
                    continue;
                }

                $subscriber = Subscriber::firstOrCreate([
                    'user_id' => $user->id,
                    'phone_number' => $phoneNumber,
                ]);

                if (!empty($tagIds)) {
                    $subscriber->tags()->syncWithoutDetaching($tagIds);
                }

                $imported++;
            } catch (\Exception $e) {
                $errors[] = "Row " . ($index + 2) . ": " . $e->getMessage();
            }
        }

        return [
            'background' => false,
            'imported' => $imported,
            'skipped' => $skipped,
            'errors' => $errors,
        ];
    }
}
