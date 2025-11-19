import React, { useEffect, useState, useCallback } from 'react';
import { REFRESH_INTERVAL_MS } from './constants';
import { OptionChainResponse, SymbolType } from './types';
import { fetchMockOptionChain, updateMockData } from './services/mockNseService';
import OptionChainTable from './components/OptionChainTable';
import MarketHeader from './components/MarketHeader';
import AnalysisModal from './components/AnalysisModal';

const App: React.FC = () => {
  const [data, setData] = useState<OptionChainResponse | null>(null);
  const [symbol, setSymbol] = useState<SymbolType>(SymbolType.NIFTY);
  const [loading, setLoading] = useState(true);
  const [showAnalysis, setShowAnalysis] = useState(false);

  // Initial Fetch
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      // In a real app, this would be fetch('/api/nse/option-chain?symbol=' + symbol)
      const response = await fetchMockOptionChain(symbol);
      setData(response);
    } catch (e) {
      console.error("Failed to fetch option chain", e);
    } finally {
      setLoading(false);
    }
  }, [symbol]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // 5 Second polling interval
  useEffect(() => {
    const intervalId = setInterval(() => {
      setData((currentData) => {
        if (!currentData) return null;
        return updateMockData(currentData);
      });
    }, REFRESH_INTERVAL_MS);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white font-sans">
      <MarketHeader 
        selectedSymbol={symbol}
        onSymbolChange={setSymbol}
        spotPrice={data?.records.underlyingValue || 0}
        timestamp={data?.records.timestamp || '--:--:--'}
        onRefresh={loadData}
        onAnalyze={() => setShowAnalysis(true)}
        isAnalyzing={false}
      />

      <main className="flex-grow flex flex-col overflow-hidden relative">
        {loading && !data ? (
           <div className="flex items-center justify-center h-full">
             <div className="text-center">
               <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
               <div className="text-gray-400">Connecting to Market Data...</div>
             </div>
           </div>
        ) : data ? (
          <>
             <div className="bg-yellow-900/30 border-b border-yellow-800 px-4 py-1 text-[10px] text-yellow-200 text-center">
                ⚠ DEMO MODE: Data is simulated. Direct NSE access requires a backend proxy due to CORS policies. 
             </div>
             <OptionChainTable data={data.records.data} spotPrice={data.records.underlyingValue} />
          </>
        ) : (
           <div className="flex items-center justify-center h-full text-red-400">
             Failed to load data.
           </div>
        )}
      </main>

      <AnalysisModal 
        isOpen={showAnalysis} 
        onClose={() => setShowAnalysis(false)} 
        data={data} 
      />
    </div>
  );
};

export default App;
