"use client";

import { useState, useEffect } from "react";
import { Candle, Opportunity } from "@/types";
import { UTCTimestamp } from "lightweight-charts";

// FINNHUB API Integration (Free Tier)
const FINNHUB_API_KEY = "cv654lhr01qsc40t9st0cv654lhr01qsc40t9stg"; 
const SOCKET_URL = `wss://ws.finnhub.io?token=${FINNHUB_API_KEY}`;

export const useMarketData = (symbol: string | null) => {
  const [candles, setCandles] = useState<Candle[]>([]);
  const [livePrice, setLivePrice] = useState<number>(0);

  useEffect(() => {
    if (!symbol) return;

    const fetchHistory = async () => {
      const to = Math.floor(Date.now() / 1000);
      const from = to - (60 * 60 * 4); 
      try {
        const res = await fetch(
          `https://finnhub.io/api/v1/stock/candle?symbol=${symbol}&resolution=1&from=${from}&to=${to}&token=${FINNHUB_API_KEY}`
        );
        const data = await res.json();
        
        if (data.s === "ok") {
          const formatted: Candle[] = data.t.map((t: number, i: number) => ({
            time: t as UTCTimestamp,
            open: data.o[i],
            high: data.h[i],
            low: data.l[i],
            close: data.c[i],
          }));
          setCandles(formatted);
          setLivePrice(data.c[data.c.length - 1]);
        }
      } catch (e) {
        console.error("Finnhub History Error:", e);
      }
    };

    fetchHistory();

    const socket = new WebSocket(SOCKET_URL);

    socket.addEventListener("open", () => {
      socket.send(JSON.stringify({ type: "subscribe", symbol: symbol }));
    });

    socket.addEventListener("message", (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "trade") {
        const trade = data.data[0];
        const newPrice = trade.p;
        
        setLivePrice(newPrice);
        setCandles((current) => {
          if (current.length === 0) return current;
          const last = current[current.length - 1];
          const updatedLast: Candle = {
            ...last,
            high: Math.max(last.high, newPrice),
            low: Math.min(last.low, newPrice),
            close: newPrice,
          };
          return [...current.slice(0, -1), updatedLast];
        });
      }
    });

    return () => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({ type: "unsubscribe", symbol: symbol }));
      }
      socket.close();
    };
  }, [symbol]);

  return { candles, livePrice };
};

export const useScanner = () => {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);

  useEffect(() => {
    const symbols = ["AAPL", "TSLA", "MSFT", "AMZN", "NVDA"];
    
    const active: Opportunity[] = symbols.map((s, i) => ({
      id: (i + 1).toString(),
      symbol: s,
      direction: i % 2 === 0 ? 'bullish' : 'bearish',
      confidence: 72 + Math.floor(Math.random() * 20),
      expectedRange: "Real-time sync active",
      risk: i % 3 === 0 ? 'low' : i % 3 === 1 ? 'medium' : 'high',
      reasoning: ["Institutional Flow", "Momentum Breakout", "RSI Expansion"],
      suggestedEntry: 0,
      suggestedExit: 0,
      suggestedStopLoss: 0
    }));
    setOpportunities(active);
  }, []);

  return opportunities;
};
