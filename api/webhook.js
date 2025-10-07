const axios = require('axios');

export default async function handler(req, res) {
    // CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    // GET request untuk test
    if (req.method === 'GET') {
        return res.status(200).send('Saweria Webhook Server is running!');
    }
    
    // Hanya terima POST
    if (req.method !== 'POST') {
        return res.status(405).send('Method not allowed');
    }
    
    const ROBLOX_API_KEY = process.env.ROBLOX_API_KEY;
    const UNIVERSE_ID = process.env.UNIVERSE_ID;
    
    if (!ROBLOX_API_KEY || !UNIVERSE_ID) {
        console.error('Missing env vars');
        return res.status(500).send('Config error');
    }
    
    const donationData = {
        donor_name: req.body.donor_name || req.body.donorName || 'Anonymous',
        amount: req.body.amount || 0,
        message: req.body.message || '',
        timestamp: Date.now()
    };
    
    console.log('Donation received:', donationData);
    
    try {
        await axios.post(
            `https://apis.roblox.com/messaging-service/v1/universes/${UNIVERSE_ID}/topics/SaweriaDonations`,
            { message: JSON.stringify(donationData) },
            {
                headers: {
                    'x-api-key': ROBLOX_API_KEY,
                    'Content-Type': 'application/json'
                }
            }
        );
        
        console.log('Sent to Roblox OK');
        return res.status(200).json({ success: true });
        
    } catch (error) {
        console.error('Error:', error.response?.data || error.message);
        return res.status(500).json({ error: error.message });
    }
}
