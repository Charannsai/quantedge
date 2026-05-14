"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { X, Wallet, Hash, IndianRupee } from "lucide-react";
import { Opportunity } from "@/types";

interface EntryPanelProps {
  opportunity: Opportunity;
  onClose: () => void;
  onSubmit: (data: { price: number; quantity: number; investment: number }) => void;
}

export const EntryPanel: React.FC<EntryPanelProps> = ({ opportunity, onClose, onSubmit }) => {
  const [price, setPrice] = useState(opportunity.suggestedEntry.toString());
  const [lots, setLots] = useState("1");
  const lotSize = 75; // Example for NIFTY

  const investment = parseFloat(price) * parseInt(lots) * lotSize;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-card rounded-3xl p-8 shadow-2xl border-2 border-black/5 max-w-md w-full"
    >
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-black tracking-tight">Manual Entry</h2>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{opportunity.symbol}</p>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-muted rounded-full transition-colors">
          <X size={20} />
        </button>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
            <IndianRupee size={12} /> Entry Price
          </label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full bg-muted border-none rounded-xl p-4 font-black text-xl focus:ring-2 focus:ring-black outline-none transition-all"
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
            <Hash size={12} /> Lots (Size: {lotSize})
          </label>
          <input
            type="number"
            value={lots}
            onChange={(e) => setLots(e.target.value)}
            className="w-full bg-muted border-none rounded-xl p-4 font-black text-xl focus:ring-2 focus:ring-black outline-none transition-all"
          />
        </div>

        <div className="p-6 bg-black rounded-2xl text-white space-y-1">
          <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">Total Investment</div>
          <div className="text-3xl font-black">₹{investment.toLocaleString()}</div>
        </div>

        <button
          onClick={() => onSubmit({ price: parseFloat(price), quantity: parseInt(lots) * lotSize, investment })}
          className="w-full py-4 bg-black text-white rounded-2xl font-black hover:bg-black/90 transition-all shadow-lg active:scale-[0.98]"
        >
          ACTIVATE INTELLIGENCE
        </button>
      </div>
    </motion.div>
  );
};
