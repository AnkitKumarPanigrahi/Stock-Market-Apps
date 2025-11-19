export const REFRESH_INTERVAL_MS = 5000;

// Placeholder for when the user actually has a key, but we won't force it for the basic UI
export const GEMINI_API_KEY = process.env.API_KEY || '';

export const INDICES = [
    { label: 'NIFTY 50', value: 'NIFTY' },
    { label: 'BANK NIFTY', value: 'BANKNIFTY' },
    { label: 'FIN NIFTY', value: 'FINNIFTY' },
];

export const TABLE_HEADERS = {
    calls: ['OI', 'Chng in OI', 'Vol', 'IV', 'LTP', 'Chng', 'Bid Qty', 'Bid', 'Ask', 'Ask Qty'],
    puts: ['Bid Qty', 'Bid', 'Ask', 'Ask Qty', 'Chng', 'LTP', 'IV', 'Vol', 'Chng in OI', 'OI']
};
