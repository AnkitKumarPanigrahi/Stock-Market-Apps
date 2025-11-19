import React from 'react';
import { OptionContract, StrikeRow, OptionGreeks } from '../types';
import { TABLE_HEADERS } from '../constants';

interface OptionChainTableProps {
  data: StrikeRow[];
  spotPrice: number;
}

const formatNumber = (num: number, decimals = 2) => num.toLocaleString('en-IN', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });

const ValueCell: React.FC<{ value: number; type?: 'price' | 'qty' | 'vol' | 'pct'; highlight?: boolean }> = ({ value, type = 'price', highlight = false }) => {
  let colorClass = 'text-gray-300';
  if (type === 'pct' || highlight) {
    if (value > 0) colorClass = 'text-green-400';
    else if (value < 0) colorClass = 'text-red-400';
  }

  return (
    <span className={`font-mono text-xs ${colorClass}`}>
      {formatNumber(value, type === 'qty' || type === 'vol' ? 0 : 2)}
    </span>
  );
};

const GreekCell: React.FC<{ greeks: OptionGreeks }> = ({ greeks }) => (
   <div className="flex flex-col text-[9px] text-gray-500 leading-tight">
      <div className="flex justify-between"><span>Δ</span><span>{greeks.delta}</span></div>
      <div className="flex justify-between"><span>θ</span><span>{greeks.theta}</span></div>
      {/* Hidden on smaller screens to save space */}
      <div className="hidden xl:flex justify-between"><span>γ</span><span>{greeks.gamma}</span></div>
      <div className="hidden xl:flex justify-between"><span>ν</span><span>{greeks.vega}</span></div>
   </div>
);

const OptionChainTable: React.FC<OptionChainTableProps> = ({ data, spotPrice }) => {
  return (
    <div className="overflow-auto flex-grow bg-gray-900 h-full relative">
      <table className="min-w-max w-full text-center border-collapse">
        <thead className="sticky top-0 z-20 bg-gray-800 text-xs uppercase text-gray-400 font-semibold shadow-sm">
          <tr>
            <th colSpan={11} className="py-2 border-b border-r border-gray-700 bg-gray-800/95 text-green-400">CALLS</th>
            <th className="py-2 border-b border-gray-700 bg-gray-800/95 text-white min-w-[80px]">STRIKE</th>
            <th colSpan={11} className="py-2 border-b border-l border-gray-700 bg-gray-800/95 text-red-400">PUTS</th>
          </tr>
          <tr className="text-[10px] tracking-tighter">
             {/* Calls Headers */}
             <th className="p-2 border-b border-gray-700 min-w-[40px]">Greeks</th>
             {TABLE_HEADERS.calls.map(h => <th key={`c-${h}`} className="p-2 border-b border-gray-700 min-w-[60px]">{h}</th>)}
             
             {/* Strike Header */}
             <th className="p-2 border-b border-gray-700 bg-gray-700 sticky left-0 z-10">Price</th>

             {/* Puts Headers */}
             {TABLE_HEADERS.puts.map(h => <th key={`p-${h}`} className="p-2 border-b border-gray-700 min-w-[60px]">{h}</th>)}
             <th className="p-2 border-b border-gray-700 min-w-[40px]">Greeks</th>
          </tr>
        </thead>
        <tbody className="text-sm divide-y divide-gray-800">
          {data.map((row) => {
            const isATM = Math.abs(row.strikePrice - spotPrice) < 50;
            const ceITM = row.strikePrice < spotPrice;
            const peITM = row.strikePrice > spotPrice;

            // Background logic
            const ceBg = ceITM ? 'bg-yellow-900/20' : '';
            const peBg = peITM ? 'bg-yellow-900/20' : '';
            const atmClass = isATM ? 'bg-blue-900/30 border-y-2 border-blue-500/50' : '';

            return (
              <tr key={row.strikePrice} className={`hover:bg-gray-800/50 transition-colors ${atmClass}`}>
                {/* CALLS SIDE */}
                <td className={`p-1 border-r border-gray-800 ${ceBg}`}><GreekCell greeks={row.CE.greeks} /></td>
                <td className={`p-2 border-r border-gray-800 ${ceBg}`}><ValueCell value={row.CE.openInterest} type="qty" /></td>
                <td className={`p-2 border-r border-gray-800 ${ceBg}`}><ValueCell value={row.CE.changeinOpenInterest} type="qty" highlight /></td>
                <td className={`p-2 border-r border-gray-800 ${ceBg}`}><ValueCell value={row.CE.totalTradedVolume} type="vol" /></td>
                <td className={`p-2 border-r border-gray-800 ${ceBg}`}><ValueCell value={row.CE.impliedVolatility} /></td>
                <td className={`p-2 border-r border-gray-800 font-bold ${ceBg}`}><ValueCell value={row.CE.lastPrice} /></td>
                <td className={`p-2 border-r border-gray-800 ${ceBg}`}><ValueCell value={row.CE.change} type="pct" /></td>
                <td className={`p-2 border-r border-gray-800 hidden lg:table-cell ${ceBg}`}><ValueCell value={row.CE.bidQty} type="qty" /></td>
                <td className={`p-2 border-r border-gray-800 hidden md:table-cell ${ceBg}`}><ValueCell value={row.CE.bidPrice} /></td>
                <td className={`p-2 border-r border-gray-800 hidden md:table-cell ${ceBg}`}><ValueCell value={row.CE.askPrice} /></td>
                <td className={`p-2 border-r border-gray-800 hidden lg:table-cell ${ceBg}`}><ValueCell value={row.CE.askQty} type="qty" /></td>

                {/* STRIKE PRICE */}
                <td className="p-2 font-bold text-white bg-gray-700 border-x border-gray-600 sticky left-0 z-10">
                  <span className={`px-2 py-1 rounded ${isATM ? 'bg-blue-600' : ''}`}>
                    {row.strikePrice}
                  </span>
                </td>

                {/* PUTS SIDE */}
                <td className={`p-2 border-l border-gray-800 hidden lg:table-cell ${peBg}`}><ValueCell value={row.PE.bidQty} type="qty" /></td>
                <td className={`p-2 border-l border-gray-800 hidden md:table-cell ${peBg}`}><ValueCell value={row.PE.bidPrice} /></td>
                <td className={`p-2 border-l border-gray-800 hidden md:table-cell ${peBg}`}><ValueCell value={row.PE.askPrice} /></td>
                <td className={`p-2 border-l border-gray-800 hidden lg:table-cell ${peBg}`}><ValueCell value={row.PE.askQty} type="qty" /></td>
                <td className={`p-2 border-l border-gray-800 ${peBg}`}><ValueCell value={row.PE.change} type="pct" /></td>
                <td className={`p-2 border-l border-gray-800 font-bold ${peBg}`}><ValueCell value={row.PE.lastPrice} /></td>
                <td className={`p-2 border-l border-gray-800 ${peBg}`}><ValueCell value={row.PE.impliedVolatility} /></td>
                <td className={`p-2 border-l border-gray-800 ${peBg}`}><ValueCell value={row.PE.totalTradedVolume} type="vol" /></td>
                <td className={`p-2 border-l border-gray-800 ${peBg}`}><ValueCell value={row.PE.changeinOpenInterest} type="qty" highlight /></td>
                <td className={`p-2 border-l border-gray-800 ${peBg}`}><ValueCell value={row.PE.openInterest} type="qty" /></td>
                <td className={`p-1 border-l border-gray-800 ${peBg}`}><GreekCell greeks={row.PE.greeks} /></td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default OptionChainTable;
