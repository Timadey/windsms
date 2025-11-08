<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use LucasDotVin\Soulbscription\Enums\PeriodicityType;
use LucasDotVin\Soulbscription\Models\Feature;
use LucasDotVin\Soulbscription\Models\Plan;

class PlanSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // PLANS
        $starter = Plan::create([
            'name'             => 'starter',
            'periodicity_type' => PeriodicityType::Month,
            'periodicity'      => 1,
            'grace_days'       => 7,
        ]);

        $pro = Plan::create([
            'name'             => 'pro',
            'periodicity_type' => PeriodicityType::Month,
            'periodicity'      => 1,
            'grace_days'       => 7,
        ]);

        $business = Plan::create([
            'name'             => 'business',
            'periodicity_type' => PeriodicityType::Month,
            'periodicity'      => 1,
            'grace_days'       => 7,
        ]);

        $enterprise = Plan::create([
            'name'             => 'enterprise',
            'periodicity_type' => PeriodicityType::Month,
            'periodicity'      => 1,
            'grace_days'       => 7,
        ]);

        $starterYearly = Plan::create([
            'name'             => 'starter-yearly',
            'periodicity_type' => PeriodicityType::Year,
            'periodicity'      => 1,
            'grace_days'       => 14,
        ]);

        $proYearly = Plan::create([
            'name'             => 'pro-yearly',
            'periodicity_type' => PeriodicityType::Year,
            'periodicity'      => 1,
            'grace_days'       => 14,
        ]);

        $businessYearly = Plan::create([
            'name'             => 'business-yearly',
            'periodicity_type' => PeriodicityType::Year,
            'periodicity'      => 1,
            'grace_days'       => 14,
        ]);

        $enterpriseYearly = Plan::create([
            'name'             => 'enterprise-yearly',
            'periodicity_type' => PeriodicityType::Year,
            'periodicity'      => 1,
            'grace_days'       => 14,
        ]);

        // Attach Features to Plans

        // Features
        $smsUnit = Feature::create([
            'consumable'       => true,
            'name'             => 'sms-units',
            'periodicity_type' => PeriodicityType::Month,
            'periodicity'      => 1,
        ]);

        $starter->features()->attach($smsUnit, ['charges' => 610 ]);
        $starterYearly->features()->attach($smsUnit, ['charges' => 610 ]);
        $pro->features()->attach($smsUnit, ['charges' => 1050 ]);
        $proYearly->features()->attach($smsUnit, ['charges' => 1050 ]);
        $business->features()->attach($smsUnit, ['charges' => 2200 ]);
        $businessYearly->features()->attach($smsUnit, ['charges' => 2200 ]);
        $enterprise->features()->attach($smsUnit, ['charges' => 4600 ]);
        $enterpriseYearly->features()->attach($smsUnit, ['charges' => 4600 ]);


        $apiAccess = Feature::create([
            'consumable' => false,
            'name'       => 'api-access',
        ]);

        $business->features()->attach($apiAccess);
        $businessYearly->features()->attach($apiAccess);
        $enterprise->features()->attach($apiAccess);
        $enterpriseYearly->features()->attach($apiAccess);

        $mixer = Feature::create([
            'consumable' => true,
            'name'       => 'ai-mixer',
            'quota'      => true,
        ]);

        $business->features()->attach($mixer, ['charges' => 50 ]);
        $businessYearly->features()->attach($mixer, ['charges' => 50 ]);
        $enterprise->features()->attach($mixer, ['charges' => 50 ]);
        $enterpriseYearly->features()->attach($mixer, ['charges' => 50 ]);

        $contacts = Feature::create([
            'consumable' => true,
            'name'       => 'contacts-upload',
            // 'quota'      => true,
            'periodicity_type' => PeriodicityType::Month,
            'periodicity'      => 1,
        ]);

        $starter->features()->attach($contacts, ['charges' => 5000 ]);
        $starterYearly->features()->attach($contacts, ['charges' => 5000 ]);
        $pro->features()->attach($contacts, ['charges' => 300000 ]);
        $proYearly->features()->attach($contacts, ['charges' => 300000 ]);
        $business->features()->attach($contacts, ['charges' => 2000000 ]);
        $businessYearly->features()->attach($contacts, ['charges' => 2000000 ]);
        $enterprise->features()->attach($contacts, ['charges' => 200000000 ]);
        $enterpriseYearly->features()->attach($contacts, ['charges' => 200000000 ]);

        $senderId = Feature::create([
            'consumable' => true,
            'name'       => 'sender-id',
            'quota'      => true,
        ]);

        $starter->features()->attach($senderId, ['charges' => 1 ]);
        $starterYearly->features()->attach($senderId, ['charges' => 1 ]);
        $pro->features()->attach($senderId, ['charges' => 3 ]);
        $proYearly->features()->attach($senderId, ['charges' => 3 ]);
        $business->features()->attach($senderId, ['charges' => 7 ]);
        $businessYearly->features()->attach($senderId, ['charges' => 7 ]);
        $enterprise->features()->attach($senderId, ['charges' => 10000 ]);
        $enterpriseYearly->features()->attach($senderId, ['charges' => 10000 ]);

        $tags = Feature::create([
            'consumable' => true,
            'name'       => 'tags',
            'quota'      => true,
        ]);

        $starter->features()->attach($tags, ['charges' => 5 ]);
        $starterYearly->features()->attach($tags, ['charges' => 5 ]);
        $pro->features()->attach($tags, ['charges' => 20 ]);
        $proYearly->features()->attach($tags, ['charges' => 20 ]);
        $business->features()->attach($tags, ['charges' => 200000 ]);
        $businessYearly->features()->attach($tags, ['charges' => 200000 ]);
        $enterprise->features()->attach($tags, ['charges' => 200000 ]);
        $enterpriseYearly->features()->attach($tags, ['charges' => 200000 ]);
    }
}
