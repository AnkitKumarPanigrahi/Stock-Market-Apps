import { OptionContract, OptionGreeks, StrikeRow, SymbolType, OptionChainResponse } from '../types';

// Constants for simulation
const BASE_PRICES = {
  [SymbolType.NIFTY]: 22500,
  [SymbolType.BANKNIFTY]: 48000,
  [SymbolType.FINNIFTY]: 21400,
};

const STRIKE_STEP = {
  [SymbolType.NIFTY]: 50,
  [SymbolType.BANKNIFTY]: 100,
  [SymbolType.FINNIFTY]: 50,
};

const generateGreeks = (type: 'CE' | 'PE', spot: number, strike: number, timeToExpiry: number = 0.05): OptionGreeks => {
  // Simplified Black-Scholes-ish approximations for visual realism
  const d1 = (Math.log(spot / strike) + (0.05 + 0.5 * 0.2 * 0.2) * timeToExpiry) / (0.2 * Math.sqrt(timeToExpiry));
  
  let delta = type === 'CE' 
    ? 1 / (1 + Math.exp(-d1 * 3)) // Sigmoid approx for N(d1)
    : (1 / (1 + Math.exp(-d1 * 3))) - 1;

  const gamma = (Math.exp(-0.5 * d1 * d1) / Math.sqrt(2 * Math.PI)) / (spot * 0.2 * Math.sqrt(timeToExpiry));
  const theta = -1 * (spot * 0.2 * Math.exp(-0.5 * d1 * d1) / (2 * Math.sqrt(timeToExpiry))) / 365;
  const vega = spot * Math.sqrt(timeToExpiry) * (Math.exp(-0.5 * d1 * d1) / Math.sqrt(2 * Math.PI)) / 100;

  return {
    delta: parseFloat(delta.toFixed(2)),
    gamma: parseFloat(gamma.toFixed(4)),
    theta: parseFloat(theta.toFixed(2)),
    vega: parseFloat(vega.toFixed(2))
  };
};

const generateOption = (
  type: 'CE' | 'PE', 
  strike: number, 
  spot: number, 
  expiry: string, 
  symbol: string
): OptionContract => {
  const isITM = type === 'CE' ? spot > strike : spot < strike;
  const dist = Math.abs(spot - strike);
  
  // Simulate Price
  let intrinsic = isITM ? dist : 0;
  let timeValue = Math.max(0, (spot * 0.015) - (dist * 0.005)); // Decaying time value
  if (timeValue < 0) timeValue = 5;
  
  const ltp = intrinsic + timeValue + (Math.random() * 2);
  
  // Simulate Change
  const change = (Math.random() * 20) - 10;
  
  return {
    strikePrice: strike,
    expiryDate: expiry,
    type,
    underlying: symbol,
    identifier: `${symbol}${expiry}${strike}${type}`,
    openInterest: Math.floor(Math.random() * 100000) + 5000,
    changeinOpenInterest: Math.floor(Math.random() * 20000) - 10000,
    pchangeinOpenInterest: (Math.random() * 10) - 5,
    totalTradedVolume: Math.floor(Math.random() * 500000),
    impliedVolatility: 12 + (Math.random() * 5),
    lastPrice: parseFloat(ltp.toFixed(2)),
    change: parseFloat(change.toFixed(2)),
    pChange: (change / ltp) * 100,
    bidPrice: parseFloat((ltp - 0.5).toFixed(2)),
    askPrice: parseFloat((ltp + 0.5).toFixed(2)),
    bidQty: Math.floor(Math.random() * 1000),
    askQty: Math.floor(Math.random() * 1000),
    greeks: generateGreeks(type, spot, strike)
  };
};

export const fetchMockOptionChain = (symbol: SymbolType): Promise<OptionChainResponse> => {
    return new Promise((resolve) => {
        const spot = BASE_PRICES[symbol] + (Math.random() * 20 - 10); // Random walk spot
        const step = STRIKE_STEP[symbol];
        const startStrike = Math.floor(spot / step) * step - (step * 10); // 10 strikes down
        const strikesCount = 21; // 10 down, 1 ATM, 10 up
        
        const rows: StrikeRow[] = [];
        const today = new Date();
        const expiry = new Date(today.setDate(today.getDate() + (4 + 7 - today.getDay()) % 7)).toDateString();

        for (let i = 0; i < strikesCount; i++) {
            const strike = startStrike + (i * step);
            rows.push({
                strikePrice: strike,
                expiryDate: expiry,
                CE: generateOption('CE', strike, spot, expiry, symbol),
                PE: generateOption('PE', strike, spot, expiry, symbol)
            });
        }

        resolve({
            records: {
                expiryDates: [expiry, "Next Week", "Next Month"],
                data: rows,
                timestamp: new Date().toLocaleTimeString(),
                underlyingValue: parseFloat(spot.toFixed(2))
            }
        });
    });
};

// Simulate live updates by slightly modifying existing data
export const updateMockData = (currentData: OptionChainResponse): OptionChainResponse => {
    const spotChange = (Math.random() * 4) - 2;
    const newSpot = currentData.records.underlyingValue + spotChange;
    
    const newData = currentData.records.data.map(row => {
        // Update CE
        const ceChange = (Math.random() * 2) - 1;
        const newCeLtp = Math.max(0.05, row.CE.lastPrice + ceChange);
        
        // Update PE
        const peChange = (Math.random() * 2) - 1;
        const newPeLtp = Math.max(0.05, row.PE.lastPrice + peChange);

        return {
            ...row,
            CE: {
                ...row.CE,
                lastPrice: parseFloat(newCeLtp.toFixed(2)),
                change: parseFloat((row.CE.change + ceChange).toFixed(2)),
                totalTradedVolume: row.CE.totalTradedVolume + Math.floor(Math.random() * 100),
                openInterest: row.CE.openInterest + Math.floor(Math.random() * 50) - 25
            },
            PE: {
                ...row.PE,
                lastPrice: parseFloat(newPeLtp.toFixed(2)),
                change: parseFloat((row.PE.change + peChange).toFixed(2)),
                totalTradedVolume: row.PE.totalTradedVolume + Math.floor(Math.random() * 100),
                openInterest: row.PE.openInterest + Math.floor(Math.random() * 50) - 25
            }
        };
    });

    return {
        records: {
            ...currentData.records,
            data: newData,
            timestamp: new Date().toLocaleTimeString(),
            underlyingValue: parseFloat(newSpot.toFixed(2))
        }
    };
};
