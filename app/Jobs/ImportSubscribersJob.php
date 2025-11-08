<?php

namespace App\Jobs;

use App\Models\Subscriber;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use League\Csv\Reader;

class ImportSubscribersJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $timeout = 600; // 10 minutes
    public $tries = 3;

    protected $userId;
    protected $filename;
    protected $tagIds;

    /**
     * Create a new job instance.
     */
    public function __construct($userId, $filename, $tagIds = [])
    {
        $this->userId = $userId;
        $this->filename = $filename;
        $this->tagIds = $tagIds;
    }

    /**
     * Execute the job.
     */
    public function handle()
    {
        $user = User::find($this->userId);

        if (!$user) {
            $this->fail(new \Exception('User not found'));
            return;
        }

        try {
            $filePath = Storage::path($this->filename);

            if (!file_exists($filePath)) {
                $this->fail(new \Exception('Import file not found'));
                return;
            }

            $csv = Reader::createFromPath($filePath, 'r');
            $csv->setHeaderOffset(0);

            $records = $csv->getRecords();
            $imported = 0;
            $skipped = 0;
            $errors = [];

            foreach ($records as $index => $record) {
                try {
                    // Get phone number from either column
                    $phoneNumber = $record['phone_number'] ?? $record['phone'] ?? null;
                    $name = $record['name'] ??  null;

                    if (empty($phoneNumber)) {
                        $skipped++;
                        continue;
                    }

                    // Clean phone number (remove spaces, dashes, etc.)
                    $phoneNumber = formatPhoneNumber($phoneNumber);

                    if (empty($phoneNumber)) {
                        $skipped++;
                        continue;
                    }

                    $subscriber = Subscriber::firstOrCreate(
                        [
                            'user_id' => $this->userId,
                            'phone_number' => $phoneNumber,
                        ],
                        [
                            'name' => $name,
                        ]
                    );

                    if (!empty($this->tagIds)) {
                        $subscriber->tags()->syncWithoutDetaching($this->tagIds);
                    }

                    $imported++;

                    // Process in batches to avoid memory issues
                    if ($imported % 100 === 0) {
                        usleep(100000); // 0.1 second pause every 100 records
                    }

                } catch (\Exception $e) {
                    $errors[] = "Row " . ($index + 2) . ": " . $e->getMessage();

                    // Limit error collection to prevent memory issues
                    if (count($errors) >= 100) {
                        break;
                    }
                }
            }

            // Clean up the file after processing
            Storage::delete($this->filename);

            // Prepare success message
            $message = "{$imported} subscribers imported successfully.";
            if ($skipped > 0) {
                $message .= " {$skipped} rows skipped.";
            }
            if (!empty($errors)) {
                $message .= " " . count($errors) . " errors occurred.";
            }

            // Log the completion
            Log::info("Subscriber import completed for user {$this->userId}: {$message}");

            // TODO: Send notification to user (optional)
            // You can create a notification class and uncomment below:
            // $user->notify(new ImportCompletedNotification($imported, $skipped, count($errors)));

        } catch (\Exception $e) {
            // Clean up the file on error
            if (Storage::exists($this->filename)) {
                Storage::delete($this->filename);
            }

            Log::error("Subscriber import failed for user {$this->userId}: " . $e->getMessage());

            // TODO: Notify user of failure (optional)
            // $user->notify(new ImportFailedNotification($e->getMessage()));

            throw $e;
        }
    }

    /**
     * Handle a job failure.
     */
    public function failed(\Exception $exception): void
    {
        // Clean up the file if job fails permanently
        if (Storage::exists($this->filename)) {
            Storage::delete($this->filename);
        }

        Log::error("Subscriber import job failed permanently for user {$this->userId}: " . $exception->getMessage());

        // TODO: Notify user of permanent failure (optional)
        // $user = User::find($this->userId);
        // if ($user) {
        //     $user->notify(new ImportFailedNotification($exception->getMessage()));
        // }
    }
}
