import React from 'react';

export default function StatCard({ icon, label, value, subtitle, color }) {
  return (
    <div className={`bg-gradient-to-br ${color} rounded-xl p-4 shadow-lg`}>
      <div className="flex items-center gap-3 mb-2">
        {icon}
        <div className="text-sm opacity-90">{label}</div>
      </div>
      <div className="text-3xl font-bold">{value}</div>
      {subtitle && <div className="text-sm opacity-75 mt-1">{subtitle}</div>}
    </div>
  );
}
