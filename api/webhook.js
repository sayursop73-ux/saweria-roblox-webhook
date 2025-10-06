const axios = require('axios');

module.exports = async (req, res) => {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    if (req.method === 'GET') {
        return res.status(200).send('Saweria Webhook Server is running!');
    }
    
    if (req.method !== 'POST') {
        return res.status(405).send('Method not allowed');
    }
    
    // Get environment variables
    const ROBLOX_API_KEY = process.env.ROBLOX_API_KEY;
    const UNIVERSE_ID = process.env.UNIVERSE_ID;
    
    if (!ROBLOX_API_KEY || !UNIVERSE_ID) {
        console.error('Missing environment variables');
        return res.status(500).send('Server configuration error');
    }
    
    // Parse donation data
    const donationData = {
        donor_name: req.body.donor_name || req.body.donorName || 'Anonymous',
        amount: req.body.amount || 0,
        message: req.body.message || '',
        timestamp: Date.now()
    };
    
    console.log('Received donation:', donationData);
    
    try {
        // Send to Roblox MessagingService
        const response = await axios.post(
            `https://apis.roblox.com/messaging-service/v1/universes/${UNIVERSE_ID}/topics/SaweriaDonations`,
            { message: JSON.stringify(donationData) },
            {
                headers: {
                    'x-api-key': ROBLOX_API_KEY,
                    'Content-Type': 'application/json'
                }
            }
        );
        
        console.log('Successfully sent to Roblox');
        return res.status(200).json({ success: true });
        
    } catch (error) {
        console.error('Error:', error.response?.data || error.message);
        return res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
};
