<?php


return [
    'default' => env('AI_PROVIDER', 'cohere'),

    'providers' => [
        'cohere' => [
            'api_key' => env('COHERE_API_KEY'),
            'base_url' => env('COHERE_BASE_URL', 'https://api.cohere.com/v2'),
        ]
    ]
];
