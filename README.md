# bitcart-webhook
Example webhook for bitcart API for different languages

This is a demonstration about how bitcart webhook works.

## Creating invoice with webhook
Simply include **notification_url** to receive your notifications.
```js
 const result = await axios.post('https://api.bitcart.ai/invoices', {
        "currency": "LTC", // LTC,BTC,XMR [https://sdk.bitcart.ai/en/stable/api.html#implemented-coins](Supported coin list)
        "store_id": process.env.BITCART_STORE_ID,
        "notification_url": "https://your-site.com/callback",
        "price": 15
    }, {
        headers: {
            'Authorization': `Bearer ${process.env.BITCART_API_KEY}`
        }
    });
```

## Verifying webhooks
As of now bitcart are not providing a signature to verify webhooks. 
It is highly recommended to use `callback.id` to query an invoice and continue execution of code from that invoice. 
See provided examples.

Alternatively, you can only accept requests from **5.75.174.52** used by *bitcart.ai*

## Payment Status Enum
| status    | description                                                            |
|-----------|------------------------------------------------------------------------|
| expired   | Invoice is expired because no payment detected in provided time frame. |
| confirmed | For each confirmation is passed, this will be sent.                    |
| paid      | Transaction detected but not yet confirmed.                            |
| complete  | Fully confirmed. Transaction has full confirmations.                   |

## Recommended Approach
It's better to set 'transaction speed' to 2 or 3 in order to receive 'complete' status earlier. Transactions that have more than one confirmation is considered as irreservible, thus no security issues.
After hitting provided number, you will receive 'complete' status.

![image](https://github.com/user-attachments/assets/6077dc0a-4b7a-4115-8dbc-86e2c406272c)

## Issues & PR
Feel free to create issue or PR for another languages.

