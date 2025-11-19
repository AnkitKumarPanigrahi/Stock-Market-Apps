import React from 'react';
import { INDICES } from '../constants';
import { SymbolType } from '../types';

interface MarketHeaderProps {
  selectedSymbol: SymbolType;
  onSymbolChange: (symbol: SymbolType) => void;
  spotPrice: number;
  timestamp: string;
  onRefresh: () => void;
  onAnalyze: () => void;
  isAnalyzing: boolean;
}

const MarketHeader: React.FC<MarketHeaderProps> = ({
  selectedSymbol,
  onSymbolChange,
  spotPrice,
  timestamp,
  onRefresh,
  onAnalyze,
  isAnalyzing
}) => {
  return (
    <header className="bg-gray-800 border-b border-gray-700 sticky top-0 z-50 shadow-lg">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          
          {/* Left: Title & Selector */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center bg-blue-600 rounded-lg px-3 py-1">
               <svg className="w-6 h-6 text-white mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
               <h1 className="text-lg font-bold text-white tracking-wider">NSE OPTION CHAIN</h1>
            </div>
            
            <select 
              value={selectedSymbol}
              onChange={(e) => onSymbolChange(e.target.value as SymbolType)}
              className="bg-gray-700 text-white text-sm rounded-md border-gray-600 focus:ring-blue-500 focus:border-blue-500 p-2"
            >
              {INDICES.map(idx => (
                <option key={idx.value} value={idx.value}>{idx.label}</option>
              ))}
            </select>
          </div>

          {/* Center: Spot Price */}
          <div className="flex flex-col items-center">
            <div className="text-xs text-gray-400 uppercase tracking-wide">Underlying Index: <span className="text-blue-400 font-semibold">{selectedSymbol}</span></div>
            <div className="text-2xl font-bold text-white font-mono">
              {spotPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              <span className="text-xs text-gray-500 ml-2 font-sans font-normal">Live</span>
            </div>
            <div className="text-[10px] text-gray-500">Last Updated: {timestamp}</div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center space-x-3">
             <button 
                onClick={onAnalyze}
                disabled={isAnalyzing}
                className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${isAnalyzing ? 'bg-gray-600 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700 text-white'}`}
             >
               {isAnalyzing ? (
                   <span className="flex items-center">Analyzing...</span>
               ) : (
                   <>
                     <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                     AI Insight
                   </>
               )}
             </button>

            <div className="flex items-center space-x-2 bg-gray-700 px-3 py-1 rounded-full">
               <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
               <span className="text-xs text-gray-300">Auto-refresh (5s)</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default MarketHeader;
