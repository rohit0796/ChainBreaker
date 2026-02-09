import React from 'react';

export default function NavButton({ active, onClick, icon, children }) {
  return (
    <button
      onClick={onClick}
      className={`flex shrink-0 items-center gap-2 px-4 py-2 rounded-lg transition-all ${
        active 
          ? 'bg-orange-500 text-white shadow-lg' 
          : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
      }`}
    >
      {icon}
      <span className="text-sm font-medium">{children}</span>
    </button>
  );
}

