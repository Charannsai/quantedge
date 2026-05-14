"use client";

import { motion } from "framer-motion";
import { Opportunity } from "@/types";
import { TrendingUp, TrendingDown } from "lucide-react";

interface CardProps {
  opportunity: Opportunity;
  onClick?: () => void;
}

export const OpportunityCard: React.FC<CardProps> = ({ opportunity, onClick }) => {
  return (
    <motion.div
      whileHover={{ y: -2, borderColor: '#000' }}
      onClick={onClick}
      className="glass-card p-6 rounded-2xl cursor-pointer transition-all border border-border group"
    >
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-2xl font-black tracking-tighter group-hover:text-black">{opportunity.symbol}</h3>
          <span className={`inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-widest ${
            opportunity.direction === 'bullish' ? 'text-success' : 'text-error'
          }`}>
            {opportunity.direction === 'bullish' ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {opportunity.direction}
          </span>
        </div>
        <div className="text-right">
          <div className="text-3xl font-black leading-none">{opportunity.confidence}%</div>
          <div className="text-[9px] uppercase tracking-[0.2em] text-slate-400 font-bold mt-1">Confidence</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="p-3 bg-muted rounded-xl">
          <div className="text-[9px] uppercase tracking-widest text-slate-400 font-bold mb-1">Outlook</div>
          <div className="text-xs font-black">{opportunity.expectedRange}</div>
        </div>
        <div className="p-3 bg-muted rounded-xl">
          <div className="text-[9px] uppercase tracking-widest text-slate-400 font-bold mb-1">Risk</div>
          <div className={`text-xs font-black uppercase tracking-tighter ${
            opportunity.risk === 'low' ? 'text-success' : opportunity.risk === 'medium' ? 'text-amber-600' : 'text-error'
          }`}>{opportunity.risk}</div>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {opportunity.reasoning.map((reason, i) => (
          <span key={i} className="text-[9px] px-2 py-1 bg-slate-50 border border-slate-100 rounded-md text-slate-500 font-bold uppercase tracking-tighter">
            {reason}
          </span>
        ))}
      </div>
    </motion.div>
  );
};
