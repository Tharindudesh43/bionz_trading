"use client";

import React from 'react';
import Image from 'next/image'; // For optimized image loading
import AnalyzePopUP from './analyze_popup';
import { RadialBarChart, RadialBar, ResponsiveContainer, PolarAngleAxis } from 'recharts';

// --- Component Definition ---

type Signal = {
  profitPercentage: string;
  type: 'SELL' | 'BUY' | string;
  date: string;
  timeAgo: string;
  symbol: string;
  status: string;
  leverage: string | number;
  entryPrice: string | number;
  exitPrice: string | number;
  stopLoss: string | number;
  winCount: number;
  lossCount: number;
};

type SignalCardProps = {
  signal: Signal;
};

const data = [
  { name: 'Profit', value: 70, fill: '#ff0000' }, // The value should be your profit/loss percentage (0-100)
];

const SignalCard: React.FC<SignalCardProps> = ({ signal }) => {

  const [isOpenLossOrProfit, setisOpenLossOrProfit] = React.useState<boolean>(false);
  // Determine text color based on profit
  const profitColor = signal.profitPercentage.startsWith('-') ? 'text-red-600' : 'text-green-600';
  const arrowColor = signal.type === 'SELL' ? 'text-red-600' : 'text-green-600';
  
  const toggleOpenLossOrProfit = async () => {
    setisOpenLossOrProfit(!isOpenLossOrProfit);
    console.log("Toggled description modal:", !isOpenLossOrProfit);
  }
  // Convert percentage to a display string (e.g., -70% or +70%)
    const profitDisplay = `${signal.profitPercentage}%`;
    
    // Helper for the gauge (visual approximation)
    const getGaugeStyle = (percentage: string) => {
      // Basic logic to determine the pointer position class.
      // In a real app, you might use a more complex library or dynamic calculation.
      const numericPercentage = Math.abs(parseInt(percentage));
      if (numericPercentage < 25) return 'bg-yellow-400';
      if (numericPercentage < 50) return 'bg-orange-400';
      if (numericPercentage >= 50) return 'bg-red-600';
      return 'bg-gray-400';
    };
  
    const normalizedValue = Math.abs(Number(signal.profitPercentage)) || 0; // Ensure it's a positive number for gauge calculation
    const indicatorColor = signal.profitPercentage.startsWith('-') ? '#ff0000' : '#4ade80'; // Red for loss, Green for profit
  
  const gaugeData = [
    { value: 100, fill: '#f0f0f0' }, // Background track (optional)
    { value: normalizedValue, fill: indicatorColor }, // The actual needle position
  ];

  return (
    <>
    <div className="
    cursor-pointer
        w-full max-w-4xl mx-auto p-4 md:p-8 
        bg-white 
        rounded-2xl shadow-xl 
        flex items-center justify-between 
        relative
        "
        onClick={()=>{}}
        style={{ background: 'linear-gradient(90deg, #fef4f4, #fffce5, #f4f6fe)' }} // Approximating the light, gradient background
    >
      
      {/* Date in the top right corner */}
      <div className="absolute top-3 right-4 text-xs text-black-400 font-bold">
        {signal.date}
      </div>

      {/* --- LEFT SECTION: SELL Signal & Arrow --- */}
      <div className="flex flex-col items-center mr-6">
        {/* The Arrow (Simulated using a down arrow SVG/Icon for demonstration) */}
        <div className="text-9xl text-red-600">
             {/* Using a simple Unicode character for the downward arrow visual */}
             🔻
        </div>
        
        <div className="mt-2 text-3xl font-bold text-red-600">
          {signal.type}
        </div>
        
        <p className="text-xs text-gray-500 mt-1">
          {signal.timeAgo}
        </p>
      </div>

      {/* --- MIDDLE SECTION: Trading Details --- */}
      <div className="flex-grow p-4 border-l border-r border-gray-100">
        {/* Spot and Symbol Header */}
        <div className="flex items-center mb-4">
          <span className="text-orange-500 font-semibold mr-4">Spot</span>
          <h2 className="text-3xl font-extrabold text-gray-800 mr-4">
            {signal.symbol}
          </h2>
          <span className="text-red-500 font-bold text-lg">
            {signal.status}
          </span>
        </div>
        
        {/* Detail Rows */}
        <div className="grid grid-cols-2 gap-y-1 gap-x-4 text-sm">
          {['Leverage', 'Entry Price Zone', 'Exit Price Zone', 'Stop Loss Zone'].map((label, index) => (
            <React.Fragment key={label}>
              <div className="text-gray-600 font-medium">
                {label} -
              </div>
              <div className="font-bold text-gray-800">
                {
                  index === 0 ? signal.leverage :
                  index === 1 ? signal.entryPrice :
                  index === 2 ? signal.exitPrice :
                  signal.stopLoss
                }
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* --- RIGHT SECTION: Profit/Loss Gauge --- */}
      <div className="flex flex-col items-center ml-8">
        {/* Gauge Placeholder (Visual Approximation) */}
          <ResponsiveContainer width="100%" height={150}>
      <RadialBarChart 
        cx="50%" 
        cy="70%" // Moves the center down for the half-circle
        innerRadius="50%" 
        outerRadius="100%" 
        barSize={10} 
        data={gaugeData} 
        startAngle={180} // Starts at the left side
        endAngle={0} // Ends at the right side (creating a semi-circle)
      >
        {/* Adds the colored arc background */}
        <RadialBar 
          dataKey="value" 
          background={{ fill: '#eee', strokeWidth: 0 }} 
          cornerRadius={5} 
          fill="url(#gradientColor)"
        />
        
        {/* The actual value indicator (needle approximation) */}
        <RadialBar 
          dataKey="value" 
          cornerRadius={5} 
          fill={indicatorColor}
        />
        
        {/* Note: This is a simplification. For a true needle/pointer, 
             you might need custom SVG within the chart or a library like react-d3-speedometer. 
             Recharts excels at the colored arc representation.
        */}
      </RadialBarChart>
    </ResponsiveContainer>

        <div className="text-orange-500 font-bold text-sm mt-3 uppercase">
          Loss / Profit
        </div>
        
        <div className={`text-5xl font-extrabold mt-1 ${profitColor}`}>
          {profitDisplay}
        </div>
        
        <div className="flex space-x-2 mt-3 text-white font-bold text-lg">
          {/* Win Button */}
          <div className="flex flex-col items-center">
            <span className="text-sm text-gray-700">{signal.winCount}</span>
            <div className="px-4 py-0.5 rounded-lg bg-green-600 text-sm">Win</div>
          </div>
          
          {/* Loss Button */}
          <div className="flex flex-col items-center">
            <span className="text-sm text-gray-700">{signal.lossCount}</span>
            <div className="px-4 py-0.5 rounded-lg bg-red-600 text-sm">Loss</div>
          </div>
        </div>
      </div>
    </div>
       <AnalyzePopUP isOpen={isOpenLossOrProfit} onClose={toggleOpenLossOrProfit} title="Description">
            {"DSDSDSDSD"}
          </AnalyzePopUP>
    </>
  );
};

export default SignalCard;