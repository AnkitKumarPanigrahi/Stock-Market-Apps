import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { GEMINI_API_KEY } from '../constants';
import { OptionChainResponse } from '../types';
import { analyzeMarketData } from '../services/geminiService';

interface AnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: OptionChainResponse | null;
}

const AnalysisModal: React.FC<AnalysisModalProps> = ({ isOpen, onClose, data }) => {
  const [analysis, setAnalysis] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [apiKey, setApiKey] = useState(GEMINI_API_KEY);
  const [error, setError] = useState('');

  // Reset when opened
  useEffect(() => {
    if (isOpen && data) {
        // Don't auto-trigger to save API calls/allow key entry
        // But if key exists in env, trigger immediately?
        // Let's wait for user to confirm key or press "Generate"
    }
  }, [isOpen, data]);

  const handleAnalyze = async () => {
    if (!data) return;
    setLoading(true);
    setError('');
    setAnalysis('');

    if (!apiKey) {
        setError("API Key is required (simulated env).");
        setLoading(false);
        return;
    }

    const result = await analyzeMarketData(data, apiKey);
    setAnalysis(result);
    setLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-gray-800 w-full max-w-2xl rounded-xl shadow-2xl border border-gray-700 flex flex-col max-h-[90vh]">
        
        <div className="flex justify-between items-center p-6 border-b border-gray-700">
          <h2 className="text-xl font-bold text-white flex items-center">
            <svg className="w-6 h-6 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
            Market Analysis (Gemini AI)
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-grow space-y-4">
           {/* API Key Input for Demo */}
           {!process.env.API_KEY && (
             <div className="bg-gray-700/50 p-4 rounded-lg border border-gray-600">
               <label className="block text-xs text-gray-400 mb-1">Enter Gemini API Key (Required for Demo)</label>
               <input 
                 type="password" 
                 value={apiKey} 
                 onChange={(e) => setApiKey(e.target.value)}
                 placeholder="AIzaSy..."
                 className="w-full bg-gray-900 border border-gray-600 rounded px-3 py-2 text-white focus:border-purple-500 outline-none"
               />
             </div>
           )}

           {error && <div className="text-red-400 text-sm p-2 bg-red-900/20 rounded">{error}</div>}

           {!analysis && !loading && (
               <div className="text-center py-8">
                   <p className="text-gray-400 mb-4">Generate a real-time sentiment analysis of the current option chain data using Google Gemini.</p>
                   <button 
                     onClick={handleAnalyze}
                     className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-full font-medium transition-all shadow-lg shadow-purple-900/50"
                   >
                     Generate Analysis
                   </button>
               </div>
           )}

           {loading && (
               <div className="flex flex-col items-center justify-center py-10 space-y-4">
                   <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                   <span className="text-purple-400 animate-pulse">Analyzing Greeks & OI data...</span>
               </div>
           )}

           {analysis && (
               <div className="prose prose-invert prose-sm max-w-none">
                   <div className="whitespace-pre-wrap bg-gray-900/50 p-4 rounded-lg border border-gray-700 text-gray-200">
                       {analysis}
                   </div>
               </div>
           )}
        </div>

        <div className="p-4 border-t border-gray-700 bg-gray-800/50 text-center">
            <span className="text-xs text-gray-500">Powered by Google Gemini 2.5 Flash • Not Investment Advice</span>
        </div>
      </div>
    </div>
  );
};

export default AnalysisModal;
