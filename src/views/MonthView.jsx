import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const MonthView = React.memo(function MonthView({ habits, completions, currentDate, setCurrentDate, toggleHabit, getDateKey }) {
  if (!habits || habits.length === 0) {
    return (
      <div className="bg-slate-800/50 backdrop-blur rounded-2xl p-8 border border-slate-700 text-center">
        <h2 className="text-2xl font-semibold mb-4">No Habits Yet</h2>
        <p className="text-slate-300">Add some habits first to track your month!</p>
      </div>
    );
  }

  function getDaysInMonth(date) {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add all days in month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    
    return days;
  }

  function previousMonth() {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() - 1);
    setCurrentDate(newDate);
  }

  function nextMonth() {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + 1);
    setCurrentDate(newDate);
  }

  function isToday(date) {
    if (!date) return false;
    const today = new Date();
    return date.toDateString() === today.toDateString();
  }

  function habitStartKey(habit) {
    const date = habit.createdAt ? new Date(habit.createdAt) : new Date();
    return getDateKey(date);
  }

  function isFutureDate(date) {
    if (!date) return false;
    return date > new Date();
  }

  function isPastDate(date) {
    if (!date) return false;
    const today = new Date();
    return date.toDateString() !== today.toDateString() && date < today;
  }

  const days = getDaysInMonth(currentDate);
  const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const dailyHabits = habits.filter(h => (h.weeklyTarget ?? 0) >= 7);
  const nonDailyHabits = habits.filter(h => (h.weeklyTarget ?? 0) < 7);
  const weekRows = Math.ceil(days.length / 7);

  function getWeekStartFromIndex(weekIndex) {
    const firstIndex = weekIndex * 7;
    const day = days[firstIndex];
    if (day) return day;
    for (let i = firstIndex; i < firstIndex + 7; i++) {
      if (days[i]) return days[i];
    }
    return null;
  }

  function getWeekRangeLabel(weekStart) {
    if (!weekStart) return '';
    const start = new Date(weekStart);
    const end = new Date(weekStart);
    end.setDate(start.getDate() + 6);
    return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
  }

  function getWeekSummary(weekStart) {
    if (!weekStart || nonDailyHabits.length === 0) return '';
    const start = new Date(weekStart);
    const end = new Date(weekStart);
    end.setDate(start.getDate() + 6);

    return nonDailyHabits.map(habit => {
      const required = habit.weeklyTarget ?? 0;
      const habitStart = habitStartKey(habit);
      const startKey = getDateKey(start);
      const endKey = getDateKey(end);
      if (habitStart > endKey) {
        return `${habit.icon} 0/${required}`;
      }
      let count = 0;
      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        const dateKey = getDateKey(d);
        if (dateKey < habitStart) continue;
        if (completions[dateKey]?.[habit.id]) count += 1;
      }
      return `${habit.icon} ${count}/${required}`;
    }).join(' • ');
  }

  // Calculate month stats
  const monthCompletions = days.filter(day => {
    if (!day || isFutureDate(day)) return false;
    const dateKey = getDateKey(day);
    const activeHabits = dailyHabits.filter(h => habitStartKey(h) <= dateKey);
    if (activeHabits.length === 0) return false;
    const completedCount = activeHabits.filter(h => completions[dateKey]?.[h.id]).length;
    return completedCount === activeHabits.length;
  }).length;

  const possibleDays = days.filter(day => {
    if (!day || isFutureDate(day)) return false;
    const dateKey = getDateKey(day);
    const activeHabits = dailyHabits.filter(h => habitStartKey(h) <= dateKey);
    return activeHabits.length > 0;
  }).length;
  const completionRate = possibleDays > 0 ? Math.round((monthCompletions / possibleDays) * 100) : 0;

  return (
    <div className="space-y-6">
      <div className="bg-slate-800/50 backdrop-blur rounded-2xl p-6 border border-slate-700">
        <div className="flex items-center justify-between mb-6">
          <button onClick={previousMonth} className="p-2 hover:bg-slate-700 rounded-lg transition-all">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div className="text-center">
            <h2 className="text-2xl font-semibold">{monthName}</h2>
            <p className="text-sm text-slate-400 mt-1">{completionRate}% completion rate • {monthCompletions} perfect days</p>
          </div>
          <button 
            onClick={nextMonth}
            disabled={currentDate.getMonth() >= new Date().getMonth() && currentDate.getFullYear() >= new Date().getFullYear()}
            className="p-2 hover:bg-slate-700 rounded-lg transition-all disabled:opacity-50"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        {/* Day headers */}
        <div className="grid gap-2 mb-2 grid-cols-7 sm:grid-cols-[repeat(7,minmax(0,1fr))_minmax(140px,1fr)]">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center text-xs text-slate-400 font-medium py-2">
              {day}
            </div>
          ))}
          {nonDailyHabits.length > 0 && (
            <div className="hidden sm:block text-left text-xs text-slate-400 font-medium py-2">
              Weekly Summary
            </div>
          )}
        </div>

        {/* Calendar grid */}
        <div className="grid gap-2 grid-cols-7 sm:grid-cols-[repeat(7,minmax(0,1fr))_minmax(140px,1fr)]">
          {Array.from({ length: weekRows }).map((_, rowIndex) => {
            const rowStart = rowIndex * 7;
            const rowDays = days.slice(rowStart, rowStart + 7);
            const weekStart = getWeekStartFromIndex(rowIndex);
            const weekLabel = getWeekRangeLabel(weekStart);
            const weekSummary = getWeekSummary(weekStart);

            return (
              <React.Fragment key={rowIndex}>
                {rowDays.map((day, idx) => {
                  if (!day) {
                    return <div key={`${rowIndex}-${idx}`} className="aspect-square" />;
                  }

                  const dateKey = getDateKey(day);
                  const activeHabits = dailyHabits.filter(h => habitStartKey(h) <= dateKey);
                  const completedCount = activeHabits.filter(h => completions[dateKey]?.[h.id]).length;
                  const totalHabits = activeHabits.length;
                  const isPerfect = completedCount === totalHabits && totalHabits > 0;
                  const hasCompletions = completedCount > 0;
                  const future = isFutureDate(day);
                  const today = isToday(day);
                  const isMissed = !future && !today && completedCount < totalHabits && totalHabits > 0;

                  return (
                    <div
                      key={`${rowIndex}-${idx}`}
                      className={`aspect-square rounded-md sm:rounded-lg p-1.5 sm:p-2 flex flex-col items-center justify-center transition-all ${
                        future ? 'bg-slate-700/30 cursor-not-allowed' :
                        isPerfect ? 'bg-green-500 shadow-lg cursor-pointer hover:scale-105' :
                        hasCompletions ? 'bg-yellow-500/50 cursor-pointer hover:scale-105' :
                        isMissed ? 'bg-red-900 border-2 border-red-600 cursor-pointer hover:scale-105' :
                        today ? 'bg-slate-700 ring-2 ring-blue-500' :
                        'bg-slate-700/50 hover:bg-slate-700'
                      }`}
                    >
                      <div className={`text-[10px] sm:text-sm font-semibold ${
                        isPerfect ? 'text-white' :
                        hasCompletions ? 'text-white' :
                        isMissed ? 'text-red-300' :
                        today ? 'text-blue-400' :
                        'text-slate-300'
                      }`}>
                        {day.getDate()}
                      </div>
                      {!future && totalHabits > 0 && (
                        <div className={`text-[10px] sm:text-xs mt-0.5 sm:mt-1 ${
                          isMissed ? 'text-red-400 font-bold' : 'text-slate-300'
                        }`}>
                          {completedCount}/{totalHabits}
                        </div>
                      )}
                      {isMissed && (
                        <div className="text-[10px] text-red-400">❌</div>
                      )}
                    </div>
                  );
                })}
                {nonDailyHabits.length > 0 && (
                  <div className="col-span-7 sm:col-span-1 mt-2 sm:mt-0 rounded-lg bg-slate-800/40 border border-slate-700 p-3 text-xs text-slate-300 flex flex-col justify-center">
                    <div className="text-[10px] text-slate-400 mb-1">{weekLabel}</div>
                    <div className="leading-relaxed">
                      {weekSummary || "No weekly habits"}
                    </div>
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
        {/* Legend */}
        <div className="flex items-center justify-center gap-6 mt-6 text-sm flex-wrap">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded" />
            <span className="text-slate-300">Perfect Day</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-500/50 rounded" />
            <span className="text-slate-300">Partial</span>
          </div>
          {dailyHabits.length > 0 && (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-900 border-2 border-red-600 rounded" />
              <span className="text-slate-300">Missed Day</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-slate-700 rounded" />
            <span className="text-slate-300">Not Started</span>
          </div>
        </div>
      </div>

      {/* Habit breakdown for selected month */}
      <div className="bg-slate-800/50 backdrop-blur rounded-2xl p-6 border border-slate-700">
        <h3 className="text-lg font-semibold mb-4">Habit Breakdown</h3>
        <div className="space-y-3">
          {habits.map(habit => {
            const habitDays = days.filter(day => {
              if (!day || isFutureDate(day)) return false;
              const dateKey = getDateKey(day);
              return habitStartKey(habit) <= dateKey;
            });
            const habitCompletions = habitDays.filter(day => {
              const dateKey = getDateKey(day);
              return completions[dateKey]?.[habit.id];
            }).length;

            const habitPossibleDays = habitDays.length;
            const percentage = habitPossibleDays > 0 ? Math.round((habitCompletions / habitPossibleDays) * 100) : 0;

            return (
              <div key={habit.id} className="bg-slate-700/30 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{habit.icon}</span>
                    <span className="font-medium">{habit.name}</span>
                  </div>
                  <span className="text-slate-300">{habitCompletions}/{habitPossibleDays} days</span>
                </div>
                <div className="w-full bg-slate-600 rounded-full h-2">
                  <div 
                    className={`h-full ${habit.color} rounded-full transition-all`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <div className="text-xs text-slate-400 mt-1 text-right">{percentage}%</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
});

export default MonthView;

