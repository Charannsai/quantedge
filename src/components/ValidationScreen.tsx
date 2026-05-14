"use client";

import { motion } from "framer-motion";
import { CheckCircle2, TrendingUp, Target, Timer } from "lucide-react";

const MOCK_VALIDATION = [
  { engine: "Momentum Engine", predicted: "₹148 → ₹155", actual: "₹149 → ₹154", accuracy: 91, status: "Superior" },
  { engine: "Volatility Engine", predicted: "₹146 → ₹159", actual: "₹147 → ₹152", accuracy: 64, status: "Deviation" },
  { engine: "ML Engine", predicted: "₹147 → ₹154", actual: "₹149 → ₹154", accuracy: 88, status: "High" }
];

export const ValidationScreen = () => {
  return (
    <div className="max-w-4xl mx-auto py-12 px-6 space-y-12">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-black text-white rounded-full text-[10px] font-black uppercase tracking-widest">
          <Timer size={12} /> Market Session Closed
        </div>
        <h1 className="text-5xl font-black tracking-tight">Daily Forecast Accuracy</h1>
        <p className="text-gray-500 font-medium max-w-lg mx-auto">
          Post-market analysis comparing predicted ranges against actual session behavior for engine calibration.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="glass-card rounded-2xl p-6 text-center">
          <div className="text-3xl font-black mb-1">81%</div>
          <div className="text-[10px] font-bold uppercase text-gray-400 tracking-widest">Avg Accuracy</div>
        </div>
        <div className="glass-card rounded-2xl p-6 text-center">
          <div className="text-3xl font-black mb-1 text-success">74%</div>
          <div className="text-[10px] font-bold uppercase text-gray-400 tracking-widest">Directional Hit</div>
        </div>
        <div className="glass-card rounded-2xl p-6 text-center">
          <div className="text-3xl font-black mb-1 text-accent">14</div>
          <div className="text-[10px] font-bold uppercase text-gray-400 tracking-widest">Forecasts Run</div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-sm font-black uppercase tracking-widest text-gray-400">Engine Performance</h2>
        {MOCK_VALIDATION.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card rounded-2xl p-6 flex items-center justify-between"
          >
            <div className="flex items-center gap-6">
              <div className="w-12 h-12 bg-muted rounded-xl flex items-center justify-center">
                <CheckCircle2 className={item.accuracy > 80 ? "text-success" : "text-accent"} />
              </div>
              <div>
                <div className="font-black text-lg">{item.engine}</div>
                <div className="text-xs font-bold text-gray-400 uppercase tracking-tighter">
                  Pred: {item.predicted} • Actual: {item.actual}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-black">{item.accuracy}%</div>
              <div className={`text-[10px] font-black uppercase ${item.accuracy > 80 ? 'text-success' : 'text-accent'}`}>
                {item.status} Calibration
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="p-8 bg-muted rounded-3xl space-y-4">
        <h3 className="font-black text-xl">Adaptive Insights</h3>
        <p className="text-gray-600 leading-relaxed font-medium">
          The <span className="text-black font-bold">Momentum Engine</span> performed strongest during today&apos;s trending session. 
          The <span className="text-black font-bold">Volatility Engine</span> showed significant deviation during the 11:30 AM expansion, 
          suggesting ATR sensitivity needs recalibration for tomorrow&apos;s session.
        </p>
      </div>
    </div>
  );
};
