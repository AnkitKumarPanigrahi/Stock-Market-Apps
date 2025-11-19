import { GoogleGenAI } from "@google/genai";
import { OptionChainResponse } from "../types";

export const analyzeMarketData = async (data: OptionChainResponse, apiKey: string): Promise<string> => {
  if (!apiKey) {
    return "Please provide a valid API Key to use the AI analysis feature.";
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    
    // Prepare a summary of the data to reduce token count
    const spot = data.records.underlyingValue;
    const atmStrike = data.records.data.reduce((prev, curr) => {
        return (Math.abs(curr.strikePrice - spot) < Math.abs(prev.strikePrice - spot) ? curr : prev);
    });

    const totalCeOI = data.records.data.reduce((acc, row) => acc + row.CE.openInterest, 0);
    const totalPeOI = data.records.data.reduce((acc, row) => acc + row.PE.openInterest, 0);
    const pcr = (totalPeOI / totalCeOI).toFixed(2);

    const summary = `
      Symbol: NIFTY/BANKNIFTY
      Current Spot Price: ${spot}
      PCR (Put Call Ratio): ${pcr}
      ATM Strike: ${atmStrike.strikePrice}
      ATM CE IV: ${atmStrike.CE.impliedVolatility.toFixed(2)}
      ATM PE IV: ${atmStrike.PE.impliedVolatility.toFixed(2)}
      ATM CE Price: ${atmStrike.CE.lastPrice}
      ATM PE Price: ${atmStrike.PE.lastPrice}
      Max CE OI Strike: ${data.records.data.reduce((p, c) => p.CE.openInterest > c.CE.openInterest ? p : c).strikePrice}
      Max PE OI Strike: ${data.records.data.reduce((p, c) => p.PE.openInterest > c.PE.openInterest ? p : c).strikePrice}
    `;

    const prompt = `
      Act as a financial market analyst. Analyze the following Option Chain summary for the Indian NSE market.
      
      Data Summary:
      ${summary}

      Provide a concise analysis (max 150 words) covering:
      1. Market Sentiment (Bullish/Bearish/Neutral) based on PCR and Price Action.
      2. Key Support and Resistance levels based on Open Interest (Max OI).
      3. Implied Volatility interpretation.
      
      Output formatted in Markdown.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "Analysis could not be generated.";
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return "Failed to generate analysis. Please check your API key or try again later.";
  }
};
