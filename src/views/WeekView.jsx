import React from 'react';
import { ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react';

const WeekView = React.memo(function WeekView({ habits, completions, currentDate, setCurrentDate, toggleHabit, getDateKey }) {
  if (!habits || habits.length === 0) {
    return (
      <div className="bg-slate-800/50 backdrop-blur rounded-2xl p-8 border border-slate-700 text-center">
        <h2 className="text-2xl font-semibold mb-4">No Habits Yet</h2>
        <p className="text-slate-300">Add some habits first to track your week!</p>
      </div>
    );
  }

  function getWeekDays(date) {
    const days = [];
    const weekStart = new Date(date);
    weekStart.setDate(date.getDate() - date.getDay());
    
    for (let i = 0; i < 7; i++) {
      const day = new Date(weekStart);
      day.setDate(weekStart.getDate() + i);
      days.push(day);
    }
    return days;
  }

  function previousWeek() {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() - 7);
    setCurrentDate(newDate);
  }

  function nextWeek() {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + 7);
    setCurrentDate(newDate);
  }

  function isToday(date) {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  }

  function isFutureDate(date) {
    return date > new Date();
  }

  function isPastDate(date) {
    const today = new Date();
    return date.toDateString() !== today.toDateString() && date < today;
  }

  function habitStartKey(habit) {
    const date = habit.createdAt ? new Date(habit.createdAt) : new Date();
    return getDateKey(date);
  }

  const weekDays = getWeekDays(currentDate);
  const weekStart = weekDays[0];
  const weekEnd = weekDays[6];

  return (
    <div className="space-y-6">
      {/* Week Navigation */}
      <div className="bg-slate-800/50 backdrop-blur rounded-2xl p-6 border border-slate-700">
        <div className="flex items-center justify-between mb-6">
          <button onClick={previousWeek} className="p-2 hover:bg-slate-700 rounded-lg transition-all">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h2 className="text-xl font-semibold">
            {weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {weekEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </h2>
          <button 
            onClick={nextWeek} 
            disabled={weekEnd >= new Date()}
            className="p-2 hover:bg-slate-700 rounded-lg transition-all disabled:opacity-50"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        {/* Week Grid */}
        <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-4 sm:mb-6">
          {weekDays.map((day, idx) => (
            <div 
              key={idx} 
              className={`text-center p-1.5 sm:p-3 rounded-lg ${
                isToday(day) ? 'bg-blue-500/20 border-2 border-blue-500' : 'bg-slate-700/30'
              }`}
            >
              <div className="text-[10px] sm:text-xs text-slate-400">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][idx]}
              </div>
              <div className="text-sm sm:text-xl font-bold mt-0.5 sm:mt-1">{day.getDate()}</div>
            </div>
          ))}
        </div>

        {/* Habits */}
        <div className="space-y-4">
          {habits.map(habit => {
            const weekCompletions = weekDays.filter(day => {
              const dateKey = getDateKey(day);
              if (habitStartKey(habit) > dateKey) return false;
              return completions[dateKey]?.[habit.id];
            }).length;

            return (
              <div key={habit.id} className="bg-slate-700/30 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{habit.icon}</span>
                    <div>
                      <h3 className="font-semibold">{habit.name}</h3>
                      <span className="text-sm text-slate-400">{weekCompletions}/{habit.weeklyTarget ?? 0} this week</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-7 gap-1">
                  {weekDays.map((day, idx) => {
                    const dateKey = getDateKey(day);
                    const isComplete = completions[dateKey]?.[habit.id];
                    const future = isFutureDate(day);
                    const today = isToday(day);
                    const beforeStart = habitStartKey(habit) > dateKey;
                    const past = isPastDate(day);

                    return (
                      <button
                        key={idx}
                        onClick={() => !future && !beforeStart && !past && toggleHabit(habit.id, day)}
                        disabled={future || beforeStart || past}
                        className={`aspect-square rounded-md sm:rounded-lg transition-all transform hover:scale-105 ${
                          future || beforeStart || past ? 'bg-slate-700 cursor-not-allowed' :
                          isComplete ? `${habit.color} shadow-lg` :
                          today ? 'bg-slate-600 ring-2 ring-blue-500' :
                          'bg-slate-600 hover:bg-slate-500'
                        }`}
                      >
                        {isComplete && <CheckCircle2 className="w-full h-full p-0.5 sm:p-1" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
});

export default WeekView;

