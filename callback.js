// You can use express or any other framework to handle the callback.
router.post('/pay', async (req, res) => {

    const { id, status } = req.body;
    if (!id || !status) {
        // Missing Paramaters
        return;
    }

    /*
    Note:
    You should check if payment is already processed or not by saving its status in your database after receiving 'complete' status.
    */

    switch (status) {
        case 'expired': {
            // Payment is expired.
            break;
        }
        case 'confirmed': {
            // Passed a confirmation.
            break;
        }
        case 'paid': {
            // sent the money, but not passed any confirmation
            break;
        }
        // fully confirmed
        case 'complete':
            {

                const resC = await axios.get(`https://api.bitcart.ai/invoices/${id}`);
                const data = resC.data;
                if (!data?.notification_url) {
                    // Invoice not found. Probably a fake request.
                    return;
                }

                const amountCrypto = data.sent_amount;
                const amount = await get_price(data.currency, amountCrypto);
                const txid = data.tx_hashes[0];

                /* You can now execute final steps here.

                // save to db etc.

                */

            }

    }
});

// You can use express or any other framework to handle the callback.
router.post('/pay', async (req, res) => {

    const { id, status } = req.body;
    if (!id || !status) {
        // Missing Paramaters
        return;
    }

    /*
    Note:
    You should check if payment is already processed or not by saving its status in your database after receiving 'complete' status.
    */

    switch (status) {
        case 'expired': {
            // Payment is expired.
            break;
        }
        case 'confirmed': {
            // Passed a confirmation.
            break;
        }
        case 'paid': {
            // sent the money, but not passed any confirmation
            break;
        }
        // fully confirmed
        case 'complete':
            {

                const resC = await axios.get(`https://api.bitcart.ai/invoices/${id}`);
                const data = resC.data;
                if (!data?.notification_url) {
                    // Invoice not found. Probably a fake request.
                    return;
                }

                const amountCrypto = data.sent_amount;
                const amount = await get_price(data.currency, amountCrypto); // amount as USD, eg, 7.65 
                const txid = data.tx_hashes[0];

                /* You can now execute final steps here.

                // save to db etc.

                */

            }

    }
});

async function get_price(coin, amount) {
    const fiat = 'usd';
    const { data } = await axios.get(`https://api.bitcart.ai/cryptos/rate?currency=${coin.toLowerCase()}&fiat_currency=${fiat}`);
    
    const rate = parseFloat(data);
    if (isNaN(rate)) {
        throw new Error('Invalid rate value');
    }

    let p = rate * amount;
    p = Math.round((p + Number.EPSILON) * 100) / 100;
    return p;
}
