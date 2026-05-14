"use client";

import React, { useEffect, useRef, useState } from 'react';
import { createChart, ColorType, IChartApi, ISeriesApi, CandleData } from 'lightweight-charts';

interface ChartProps {
  data: CandleData[];
  predictions?: {
    color: string;
    data: CandleData[];
  }[];
}

export const TradingChart: React.FC<ChartProps> = ({ data, predictions }) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || !chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' },
        textColor: '#111111',
      },
      grid: {
        vertLines: { color: '#f0f0f0' },
        horzLines: { color: '#f0f0f0' },
      },
      width: chartContainerRef.current.clientWidth,
      height: 400,
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
      },
    });

    // In lightweight-charts v5.0+, the method is addSeries('Candlestick', options)
    // but the library still supports specific addCandlestickSeries if typed correctly.
    // However, for v5.0+, the recommended way if the specific method is missing is:
    // const series = chart.addSeries(CandlestickSeries, { ... });
    // Let's use the standard method which is usually addCandlestickSeries in most versions.
    // The error says it's not a function, which is strange for v5.2.0 unless the API changed.
    
    try {
      const series = chart.addCandlestickSeries({
        upColor: '#10b981',
        downColor: '#ef4444',
        borderVisible: false,
        wickUpColor: '#10b981',
        wickDownColor: '#ef4444',
      });

      series.setData(data);
      seriesRef.current = series;
    } catch (e) {
      console.error("Failed to add candlestick series:", e);
    }
    
    chartRef.current = chart;

    const handleResize = () => {
      if (chartContainerRef.current && chartRef.current) {
        chartRef.current.applyOptions({ width: chartContainerRef.current.clientWidth });
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (chartRef.current) {
        chartRef.current.remove();
        chartRef.current = null;
      }
    };
  }, [isClient, data]);

  if (!isClient) {
    return <div className="w-full h-[400px] bg-muted animate-pulse rounded-xl" />;
  }

  return (
    <div className="w-full h-full relative">
      <div ref={chartContainerRef} className="w-full h-[400px]" />
    </div>
  );
};
