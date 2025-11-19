export interface OptionContract {
  strikePrice: number;
  expiryDate: string;
  type: 'CE' | 'PE';
  underlying: string;
  identifier: string;
  openInterest: number;
  changeinOpenInterest: number;
  pchangeinOpenInterest: number;
  totalTradedVolume: number;
  impliedVolatility: number;
  lastPrice: number;
  change: number;
  pChange: number;
  bidPrice: number;
  askPrice: number;
  bidQty: number;
  askQty: number;
  greeks: OptionGreeks;
}

export interface OptionGreeks {
  delta: number;
  theta: number;
  gamma: number;
  vega: number;
}

export interface StrikeRow {
  strikePrice: number;
  expiryDate: string;
  CE: OptionContract;
  PE: OptionContract;
}

export interface MarketStatus {
  timestamp: string;
  underlyingValue: number;
  marketStatus: 'Open' | 'Closed';
  symbol: string;
}

export interface OptionChainResponse {
  records: {
    expiryDates: string[];
    data: StrikeRow[];
    timestamp: string;
    underlyingValue: number;
  };
}

export enum SymbolType {
  NIFTY = 'NIFTY',
  BANKNIFTY = 'BANKNIFTY',
  FINNIFTY = 'FINNIFTY'
}
