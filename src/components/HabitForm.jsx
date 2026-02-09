import React, { useState } from 'react';
import { X } from 'lucide-react';

export default function HabitForm({ habit, onSave, onCancel }) {
  const [name, setName] = useState(habit?.name || '');
  const [icon, setIcon] = useState(habit?.icon || '📝');
  const [weeklyTarget, setWeeklyTarget] = useState(habit?.weeklyTarget || 7);
  const [color, setColor] = useState(habit?.color || 'bg-blue-500');

  const colors = [
    'bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500',
    'bg-blue-500', 'bg-indigo-500', 'bg-purple-500', 'bg-pink-500',
    'bg-cyan-500', 'bg-teal-500', 'bg-lime-500', 'bg-rose-500'
  ];

  const commonIcons = ['💪', '🏃', '📚', '🧘', '🎨', '💻', '🎵', '🌱', '🔨', '✍️', '🧠', '❤️', '⚡', '🎯', '🔥', '🚀'];

  function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim()) {
      alert('Please enter a habit name');
      return;
    }
    
    onSave({
      name: name.trim(),
      icon,
      weeklyTarget: parseInt(weeklyTarget),
      color,
      category: 'custom'
    });
    
    // Reset form
    setName('');
    setIcon('📝');
    setWeeklyTarget(7);
    setColor('bg-blue-500');
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-2xl p-6 max-w-md w-full border border-slate-700 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold">{habit ? 'Edit Habit' : 'Add New Habit'}</h3>
          <button onClick={onCancel} className="p-2 hover:bg-slate-700 rounded-lg transition-all">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Habit Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Morning Meditation"
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Icon</label>
            <div className="grid grid-cols-6 sm:grid-cols-8 gap-2 mb-2">
              {commonIcons.map(emoji => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => setIcon(emoji)}
                  className={`text-2xl p-2 rounded-lg transition-all ${
                    icon === emoji ? 'bg-blue-500 scale-110 ring-2 ring-blue-400' : 'bg-slate-700 hover:bg-slate-600'
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
            <input
              type="text"
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
              placeholder="Or enter custom emoji"
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              maxLength={4}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Weekly Target: {weeklyTarget} {weeklyTarget === 1 ? 'day' : 'days'}/week
            </label>
            <input
              type="range"
              value={weeklyTarget}
              onChange={(e) => setWeeklyTarget(parseInt(e.target.value))}
              min="1"
              max="7"
              className="w-full"
            />
            <div className="flex justify-between text-xs text-slate-400 mt-1">
              <span>1 day</span>
              <span>7 days</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Color</label>
            <div className="grid grid-cols-6 gap-2">
              {colors.map(c => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`h-12 rounded-lg ${c} transition-all ${
                    color === c ? 'ring-4 ring-white scale-110 shadow-lg' : 'hover:scale-105'
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 bg-slate-700 hover:bg-slate-600 px-4 py-3 rounded-lg transition-all font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 px-4 py-3 rounded-lg transition-all font-medium shadow-lg"
            >
              {habit ? 'Update Habit' : 'Add Habit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

