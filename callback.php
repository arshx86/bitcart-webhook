<?php

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $id = $_POST['id'] ?? null;
    $status = $_POST['status'] ?? null;

    if (!$id || !$status) {
        // Missing parameters
        http_response_code(400);
        exit("Missing parameters");
    }

    /*
    Note:
    You should check if payment is already processed or not by saving its status in your database after receiving 'complete' status.
    */

    switch ($status) {
        case 'expired':
            // Payment is expired
            break;

        case 'confirmed':
            // Passed a confirmation
            break;

        case 'paid':
            // Sent the money, but not passed any confirmation
            break;

        case 'complete': {
            $response = file_get_contents("https://api.bitcart.ai/invoices/$id");
            $data = json_decode($response, true);

            if (empty($data['notification_url'])) {
                // Invoice not found. Probably a fake request.
                http_response_code(404);
                exit("Invoice not found");
            }

            $amountCrypto = $data['sent_amount'];
            $amount = get_price($data['currency'], $amountCrypto);
            $txid = $data['tx_hashes'][0];

            // Execute final steps here: save to db, etc.
        }
            break;
    }
}

function get_price($coin, $amount)
{
    $mappings = [
        'BTC' => 'bitcoin',
        'ETH' => 'ethereum',
        'LTC' => 'litecoin',
        'BCH' => 'bitcoin-cash',
        'XMR' => 'monero',
        'DASH' => 'dash',
        'ZEC' => 'zcash',
        'DOGE' => 'dogecoin',
        'USDT' => 'tether'
    ];

    $response = file_get_contents('https://api.coincap.io/v2/rates/' . $mappings[$coin]);
    $data = json_decode($response, true);

    $rateUsd = $data['data']['rateUsd'];
    $price = round($rateUsd * $amount, 2);
    return $price;
}