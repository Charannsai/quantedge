import { UTCTimestamp } from 'lightweight-charts';

export interface Candle {
  time: UTCTimestamp;
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number;
}

export interface PredictionEngine {
  id: string;
  name: string;
  confidence: number;
  color: string;
  expectedRange: {
    min: number;
    max: number;
  };
  description: string;
}

export interface Opportunity {
  id: string;
  symbol: string;
  direction: 'bullish' | 'bearish';
  confidence: number;
  expectedRange: string;
  risk: 'low' | 'medium' | 'high';
  reasoning: string[];
  suggestedEntry: number;
  suggestedExit: number;
  suggestedStopLoss: number;
}

export interface Position {
  symbol: string;
  entryPrice: number;
  quantity: number;
  currentPrice: number;
  pnl: number;
  pnlPercent: number;
}
