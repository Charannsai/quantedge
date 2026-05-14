"use client";

import { useState, useEffect } from "react";
import { Candle, Opportunity } from "@/types";
import { UTCTimestamp } from "lightweight-charts";

export const useMarketData = (symbol: string | null, token: string | null) => {
  const [candles, setCandles] = useState<Candle[]>([]);
  const [livePrice, setLivePrice] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!symbol || !token) return;

    const fetchLiveData = async () => {
      try {
        const response = await fetch(`/api/market/ltp?symbol=${symbol}&token=${token}`);
        if (!response.ok) {
            const errData = await response.json();
            throw new Error(errData.error || "Failed to fetch LTP");
        }
        const data = await response.json();
        
        if (data.status && data.data) {
          const ltp = data.data.ltp;
          setLivePrice(ltp);
          setError(null);
          
          setCandles(prev => {
            if (prev.length === 0) {
              return [{
                time: Math.floor(Date.now() / 1000) as UTCTimestamp,
                open: ltp,
                high: ltp,
                low: ltp,
                close: ltp
              }];
            }
            const last = prev[prev.length - 1];
            const updated: Candle = {
              ...last,
              high: Math.max(last.high, ltp),
              low: Math.min(last.low, ltp),
              close: ltp
            };
            return [...prev.slice(0, -1), updated];
          });
        }
      } catch (e: any) {
        console.error("Market Data Hook Error:", e.message);
        setError(e.message);
      }
    };

    const interval = setInterval(fetchLiveData, 2000);
    fetchLiveData();

    return () => clearInterval(interval);
  }, [symbol, token]);

  return { candles, livePrice, error };
};

export const useScanner = () => {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);

  useEffect(() => {
    const symbols = [
      { name: "SBIN-EQ", token: "3045" },
      { name: "RELIANCE-EQ", token: "2885" },
      { name: "NIFTY", token: "99926000" }
    ];
    
    const active: Opportunity[] = symbols.map((s, i) => ({
      id: (i + 1).toString(),
      symbol: s.name,
      token: s.token, // Storing for hook usage
      direction: i % 2 === 0 ? 'bullish' : 'bearish',
      confidence: 75 + Math.floor(Math.random() * 15),
      expectedRange: "Real-time sync",
      risk: i % 2 === 0 ? 'low' : 'medium',
      reasoning: ["Institutional Flow", "Breakout Zone"],
      suggestedEntry: 0,
      suggestedExit: 0,
      suggestedStopLoss: 0
    }));
    setOpportunities(active);
  }, []);

  return opportunities;
};
