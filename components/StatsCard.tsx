
import React from 'react';
import { motion } from 'framer-motion';
import { ChevronUp, ChevronDown } from 'lucide-react';

interface StatsCardProps {
  label: string;
  value: string | number;
  trend?: string;
  icon: React.ReactNode;
  color: string;
  alert?: boolean;
}

const StatsCard: React.FC<StatsCardProps> = ({ label, value, trend, icon, color, alert }) => {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="bg-white p-6 rounded-[1.5rem] border border-slate-200 shadow-sm transition-all"
    >
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-xl ${color}`}>
          {icon}
        </div>
        {alert && (
          <div className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
          </div>
        )}
      </div>
      
      <div>
        <p className="text-slate-400 text-sm font-medium mb-1">{label}</p>
        <h4 className="text-2xl font-bold text-[#102A43] mb-2">{value}</h4>
        
        {trend && (
          <div className="flex items-center gap-1">
            {trend.includes('+') ? (
              <ChevronUp size={14} className="text-[#00897B]" />
            ) : trend.includes('Requires') ? null : (
              <ChevronDown size={14} className="text-[#FF6B6B]" />
            )}
            <span className={`text-xs font-bold ${
              trend.includes('+') ? 'text-[#00897B]' : 
              trend.includes('Requires') ? 'text-[#FF6B6B]' : 'text-blue-600'
            }`}>
              {trend}
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default StatsCard;
