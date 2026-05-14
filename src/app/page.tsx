"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TradingChart } from "@/components/TradingChart";
import { OpportunityCard } from "@/components/OpportunityCard";
import { Opportunity, PredictionEngine, Position } from "@/types";
import { EntryPanel } from "@/components/EntryPanel";
import { ValidationScreen } from "@/components/ValidationScreen";
import { useMarketData, useScanner } from "@/hooks/useMarketData";
import { 
  Search, 
  Brain, 
  LineChart, 
  Zap, 
  ChevronRight, 
  ArrowUpRight,
  Shield,
  Activity,
  Clock,
  ArrowDownRight,
  TrendingUp as TrendingUpIcon,
  Timer
} from "lucide-react";

// Mock data constants moved outside or handled in useEffect to avoid hydration mismatch
const INITIAL_MOCK_OPPORTUNITIES: Opportunity[] = [
  {
    id: "1",
    symbol: "NIFTY 23600 CE",
    direction: "bullish",
    confidence: 82,
    expectedRange: "₹142 → ₹158",
    risk: "medium",
    reasoning: ["Strong momentum", "Volume spike", "Sector strength"],
    suggestedEntry: 145,
    suggestedExit: 158,
    suggestedStopLoss: 136
  },
  {
    id: "2",
    symbol: "RELIANCE",
    direction: "bullish",
    confidence: 76,
    expectedRange: "₹2840 → ₹2895",
    risk: "low",
    reasoning: ["VWAP support", "Trend continuation"],
    suggestedEntry: 2845,
    suggestedExit: 2890,
    suggestedStopLoss: 2820
  }
];

const ENGINES: PredictionEngine[] = [
  { id: "1", name: "Momentum Engine", confidence: 74, color: "#10b981", expectedRange: { min: 148, max: 155 }, description: "EMA slopes & VWAP" },
  { id: "2", name: "Volatility Engine", confidence: 61, color: "#3b82f6", expectedRange: { min: 146, max: 159 }, description: "ATR & Expansion" },
  { id: "3", name: "ML Engine", confidence: 68, color: "#8b5cf6", expectedRange: { min: 147, max: 154 }, description: "XGBoost Patterns" }
];

export default function Dashboard() {
  const [selectedTrade, setSelectedTrade] = useState<Opportunity | null>(null);
  const [activePosition, setActivePosition] = useState<Position | null>(null);
  const [isEntryOpen, setIsEntryOpen] = useState(false);
  const [marketPhase, setMarketPhase] = useState<'active' | 'post'>('active');
  
  const opportunities = useScanner();
  const { candles, livePrice } = useMarketData(selectedTrade?.symbol || null);

  // Set initial trade
  useEffect(() => {
    if (opportunities.length > 0 && !selectedTrade) {
      setSelectedTrade(opportunities[0]);
    }
  }, [opportunities, selectedTrade]);

  const handleTradeSelection = (opp: Opportunity) => {
    setSelectedTrade(opp);
    setIsEntryOpen(false);
  };

  const handleEntrySubmit = (data: { price: number; quantity: number; investment: number }) => {
    if (!selectedTrade) return;
    
    setActivePosition({
      symbol: selectedTrade.symbol,
      entryPrice: data.price,
      quantity: data.quantity,
      currentPrice: livePrice,
      pnl: 0,
      pnlPercent: 0
    });
    setIsEntryOpen(false);
  };

  // Live P&L calculation
  useEffect(() => {
    if (activePosition) {
      const pnl = (livePrice - activePosition.entryPrice) * activePosition.quantity;
      const pnlPercent = ((livePrice - activePosition.entryPrice) / activePosition.entryPrice) * 100;
      setActivePosition(prev => prev ? { ...prev, currentPrice: livePrice, pnl, pnlPercent } : null);
    }
  }, [livePrice]);

  if (marketPhase === 'post') {
    return (
      <div className="min-h-screen bg-white">
        <nav className="border-b border-border bg-white/80 backdrop-blur-md sticky top-0 z-50">
          <div className="max-w-[1600px] mx-auto px-8 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                <div className="w-4 h-4 bg-white rotate-45" />
              </div>
              <span className="font-black text-xl tracking-tighter uppercase">QuantEdge</span>
            </div>
            <button 
              onClick={() => setMarketPhase('active')}
              className="text-sm font-bold bg-muted px-4 py-2 rounded-lg hover:bg-black hover:text-white transition-all"
            >
              Back to Dashboard
            </button>
          </div>
        </nav>
        <ValidationScreen />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Header */}
      <nav className="border-b border-border bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-[1600px] mx-auto px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                <div className="w-4 h-4 bg-white rotate-45" />
              </div>
              <span className="font-black text-xl tracking-tighter uppercase">QuantEdge</span>
            </div>
            <div className="h-4 w-[1px] bg-border" />
            <div className="flex items-center gap-6 text-sm font-medium text-gray-500">
              <span className="text-black">Dashboard</span>
              <button onClick={() => setMarketPhase('post')} className="hover:text-black cursor-pointer transition-colors">Accuracy Validation</button>
              <span className="hover:text-black cursor-pointer transition-colors">Intelligence</span>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-gray-400">
              <div className="flex items-center gap-2">
                <Clock size={14} />
                <span>Market Open: 09:15 AM</span>
              </div>
              <div className="flex items-center gap-2">
                <Activity size={14} />
                <span className="text-success">Live Stream Active</span>
              </div>
            </div>
            <button className="bg-black text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-black/90 transition-all flex items-center gap-2">
              <Zap size={16} fill="currentColor" />
              Intelligence Mode
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-[1600px] mx-auto p-8 grid grid-cols-12 gap-8">
        {/* Left Column: Scanner & Insights */}
        <div className="col-span-4 space-y-8">
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-sm font-black uppercase tracking-[0.2em] text-gray-400 flex items-center gap-2">
                <Search size={16} />
                Live Market Scanner
              </h2>
              <span className="text-[10px] font-bold bg-success-muted text-success px-2 py-1 rounded">Scanning Top 50</span>
            </div>
            <div className="space-y-4">
              {opportunities.map((opp) => (
                <OpportunityCard 
                  key={opp.id} 
                  opportunity={opp} 
                  onClick={() => handleTradeSelection(opp)}
                />
              ))}
            </div>
          </section>

          <section className="glass-card rounded-2xl p-6">
            <h2 className="text-sm font-black uppercase tracking-[0.2em] text-gray-400 flex items-center gap-2 mb-6">
              <Brain size={16} />
              Prediction Engines
            </h2>
            <div className="space-y-6">
              {ENGINES.map((engine) => (
                <div key={engine.id} className="space-y-2">
                  <div className="flex justify-between items-end">
                    <div>
                      <div className="text-sm font-bold">{engine.name}</div>
                      <div className="text-[10px] text-gray-400 font-medium uppercase">{engine.description}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-black">{engine.confidence}%</div>
                    </div>
                  </div>
                  <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${engine.confidence}%` }}
                      transition={{ duration: 1, ease: "circOut" }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: engine.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Column: Chart & Position Intelligence */}
        <div className="col-span-8 space-y-8 relative">
          {isEntryOpen && selectedTrade && (
            <div className="absolute inset-0 z-[60] flex items-start justify-center pt-12 bg-white/60 backdrop-blur-sm rounded-3xl">
              <EntryPanel 
                opportunity={selectedTrade} 
                onClose={() => setIsEntryOpen(false)}
                onSubmit={handleEntrySubmit}
              />
            </div>
          )}
          
          <section className="glass-card rounded-3xl overflow-hidden border border-border">
            <div className="p-6 border-b border-border flex items-center justify-between bg-muted/30">
              <div className="flex items-center gap-4">
                <div>
                  <h1 className="text-2xl font-black tracking-tighter">
                    {selectedTrade ? selectedTrade.symbol : "Select an instrument"}
                  </h1>
                  {selectedTrade && (
                    <div className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase">
                      <span className={selectedTrade.direction === 'bullish' ? 'text-success' : 'text-error'}>
                        {selectedTrade.direction} Trend
                      </span>
                      <span>•</span>
                      <span>Vol: 1.2M</span>
                      <span>•</span>
                      <span>ATR: 4.2</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                {activePosition ? (
                   <div className="flex items-center gap-6">
                     <div className="text-right">
                        <div className="text-[10px] font-black uppercase text-gray-400">Live P&L</div>
                        <div className={`text-xl font-black ${activePosition.pnl >= 0 ? 'text-success' : 'text-error'}`}>
                          ₹{activePosition.pnl.toLocaleString()}
                        </div>
                     </div>
                     <button 
                        onClick={() => setActivePosition(null)}
                        className="bg-error text-white text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-lg"
                      >
                        Exit Position
                      </button>
                   </div>
                ) : (
                  <button 
                    onClick={() => setIsEntryOpen(true)}
                    disabled={!selectedTrade}
                    className="bg-black text-white px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest hover:scale-105 transition-all disabled:opacity-20"
                  >
                    Enter Position
                  </button>
                )}
              </div>
            </div>
            <div className="p-4 h-[450px]">
              <TradingChart data={candles} />
            </div>
            
            {/* Projection Overlay (Bottom of chart) */}
            <div className="p-6 grid grid-cols-3 gap-6 bg-muted/20 border-t border-border">
              <div className="space-y-1">
                <div className="text-[10px] font-black uppercase text-gray-400 tracking-widest">1-Minute Range</div>
                <div className="text-xl font-black text-accent">₹148 – ₹151</div>
                <div className="text-[11px] font-bold text-success flex items-center gap-1">
                  <ArrowUpRight size={12} /> 74% Probable
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-[10px] font-black uppercase text-gray-400 tracking-widest">5-Minute Range</div>
                <div className="text-xl font-black text-accent">₹149 – ₹156</div>
                <div className="text-[11px] font-bold text-success flex items-center gap-1">
                  <ArrowUpRight size={12} /> 68% Probable
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-[10px] font-black uppercase text-gray-400 tracking-widest">10-Minute Range</div>
                <div className="text-xl font-black text-accent">₹145 – ₹160</div>
                <div className="text-[11px] font-bold text-error flex items-center gap-1">
                  <Activity size={12} /> High Reversal Risk
                </div>
              </div>
            </div>
          </section>

          {/* Action Panel */}
          <section className="grid grid-cols-2 gap-8">
            <div className="glass-card rounded-2xl p-6 space-y-4">
              <h2 className="text-sm font-black uppercase tracking-[0.2em] text-gray-400 flex items-center gap-2">
                <Shield size={16} />
                Entry Guidance
              </h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-border">
                  <span className="text-sm font-medium text-gray-500">Target Entry</span>
                  <span className="text-lg font-black">₹145.00</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-border">
                  <span className="text-sm font-medium text-gray-500">Stop Loss</span>
                  <span className="text-lg font-black text-error">₹136.00</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm font-medium text-gray-500">Risk/Reward</span>
                  <span className="text-lg font-black text-success">1:2.4</span>
                </div>
              </div>
            </div>

            <div className="glass-card rounded-2xl p-6 bg-black text-white space-y-6">
              <div className="flex justify-between items-start">
                <h2 className="text-sm font-black uppercase tracking-[0.2em] text-gray-400">Exit Intelligence</h2>
                <div className="px-2 py-1 bg-white/10 rounded text-[10px] font-black uppercase">Active Monitoring</div>
              </div>
              <div className="space-y-2">
                <div className="text-2xl font-black">HOLD POSITION</div>
                <p className="text-xs text-gray-400 font-medium leading-relaxed">
                  Momentum engine suggests 12% further expansion before first exhaustion zone. Volume remains above 20-period average.
                </p>
              </div>
              <button className="w-full py-3 bg-white text-black rounded-xl font-black text-sm hover:bg-gray-100 transition-all flex items-center justify-center gap-2">
                Partial Exit Suggested <ChevronRight size={16} />
              </button>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
