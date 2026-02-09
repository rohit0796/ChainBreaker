import React from 'react';
import { Target, Flame, Zap, CheckCircle2, Circle, TrendingUp } from 'lucide-react';
import StatCard from '../components/StatCard.jsx';

const DashboardView = React.memo(function DashboardView({ habits, completions, stats, toggleHabit, getDateKey, quote }) {
  function startOfWeek(date) {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - d.getDay()); // Sunday start
    return d;
  }

  const todayKey = getDateKey(new Date());
  const todayCompletions = completions[todayKey] || {};

  const dailyHabits = (habits || []).filter(h => (h.weeklyTarget ?? 0) >= 7);
  const weeklyHabits = (habits || []).filter(h => (h.weeklyTarget ?? 0) < 7);

  const completedDailyToday = dailyHabits.filter(h => !!todayCompletions[h.id]).length;
  const totalDailyToday = dailyHabits.length;
  const progressPercent = totalDailyToday > 0 ? (completedDailyToday / totalDailyToday) * 100 : 0;

  const bestDaily = dailyHabits.reduce((best, h) => (!best || (h.streak ?? 0) > (best.streak ?? 0) ? h : best), null);

  const weekStart = startOfWeek(new Date());
  const weeklyCounts = Object.fromEntries(weeklyHabits.map(h => [h.id, 0]));
  for (let d = new Date(weekStart); getDateKey(d) <= todayKey; d.setDate(d.getDate() + 1)) {
    const k = getDateKey(d);
    weeklyHabits.forEach(h => {
      if (completions[k]?.[h.id]) weeklyCounts[h.id] += 1;
    });
  }

  if (!habits || habits.length === 0) {
    return (
      <div className="space-y-6">
        <div className="bg-slate-800/50 backdrop-blur rounded-2xl p-8 border border-slate-700 text-center">
          <h2 className="text-2xl font-semibold mb-4">Welcome to ChainBreaker!</h2>
          <p className="text-slate-300 mb-6">You don't have any habits yet. Let's get started!</p>
          <p className="text-slate-400">Click on the "Habits" tab to add your first habit.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Miss Streak Warning - Only show if there's an active miss streak */}
      {stats.currentMissStreak > 0 && (
        <div className="bg-gradient-to-r from-red-900 to-red-800 border-2 border-red-500 rounded-2xl p-6 animate-pulse">
          <div className="flex items-center gap-4">
            <div className="text-6xl">💀</div>
            <div>
              <h3 className="text-2xl font-bold text-red-200">MISS STREAK: {stats.currentMissStreak} WEEKS</h3>
              <p className="text-red-300 mt-1">
                You've been slipping for {stats.currentMissStreak} {stats.currentMissStreak === 1 ? 'week' : 'weeks'}. 
                This is exactly how you stay stuck. Break the pattern THIS WEEK.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Today's Progress */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard 
          icon={<Target className="w-8 h-8 text-green-400" />}
          label="Daily Progress"
          value={`${completedDailyToday}/${totalDailyToday}`}
          subtitle={`${Math.round(progressPercent)}% complete`}
          color="from-green-500 to-emerald-500"
        />
        <StatCard 
          icon={<Flame className="w-8 h-8 text-orange-400" />}
          label="Best Streak"
          value={bestDaily?.streak ?? 0}
          subtitle={bestDaily ? bestDaily.name : 'daily habits'}
          color="from-orange-500 to-red-500"
        />
        <StatCard 
          icon={<Zap className="w-8 h-8 text-yellow-400" />}
          label="Total Completions"
          value={stats.totalCompletions}
          subtitle={`${stats.totalMisses} missed targets`}
          color="from-yellow-500 to-orange-500"
        />
      </div>

      {/* Quick Actions - Today's Habits */}
      <div className="bg-slate-800/50 backdrop-blur rounded-2xl p-6 border border-slate-700">
        <h2 className="text-xl font-semibold mb-4">Daily Habits (Today)</h2>
        <div className="space-y-3">
          {dailyHabits.map(habit => {
            const isComplete = todayCompletions[habit.id];
            return (
              <div key={habit.id} className="bg-slate-700/30 rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{habit.icon}</span>
                  <div>
                    <h3 className="font-semibold">{habit.name}</h3>
                    <div className="flex items-center gap-2 text-sm text-slate-400">
                      <Flame className="w-4 h-4 text-orange-400" />
                      <span>{habit.streak} day streak</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => toggleHabit(habit.id)}
                  className={`p-3 rounded-full transition-all transform hover:scale-110 ${
                    isComplete 
                      ? 'bg-green-500 shadow-lg shadow-green-500/50' 
                      : 'bg-slate-600 hover:bg-slate-500'
                  }`}
                >
                  {isComplete ? <CheckCircle2 className="w-6 h-6" /> : <Circle className="w-6 h-6" />}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Weekly Habits */}
      {weeklyHabits.length > 0 && (
        <div className="bg-slate-800/50 backdrop-blur rounded-2xl p-6 border border-slate-700">
          <h2 className="text-xl font-semibold mb-4">This Week</h2>
          <div className="space-y-3">
            {weeklyHabits.map(habit => {
              const required = habit.weeklyTarget ?? 0;
              const count = weeklyCounts[habit.id] ?? 0;
              const doneForWeek = required > 0 && count >= required;
              const isCompleteToday = !!todayCompletions[habit.id];
              const remaining = Math.max(0, required - count);

              // If target is 1/week, hide after it's done for the week.
              if (required === 1 && doneForWeek) {
                return null;
              }

              return (
                <div key={habit.id} className="bg-slate-700/30 rounded-xl p-4 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-3xl">{habit.icon}</span>
                    <div className="min-w-0">
                      <h3 className="font-semibold truncate">{habit.name}</h3>
                      <div className="text-sm text-slate-400">
                        {count}/{required} this week{required > 0 ? ` • ${remaining} left` : ''}
                      </div>
                    </div>
                  </div>
                  <div className="shrink-0">
                    {doneForWeek ? (
                      <div className="text-sm text-green-400 font-medium">Done</div>
                    ) : (
                      <button
                        onClick={() => toggleHabit(habit.id)}
                        className={`p-3 rounded-full transition-all transform hover:scale-110 ${
                          isCompleteToday ? `${habit.color} shadow-lg` : 'bg-slate-600 hover:bg-slate-500'
                        }`}
                        aria-label="Mark weekly habit done today"
                      >
                        {isCompleteToday ? <CheckCircle2 className="w-6 h-6" /> : <Circle className="w-6 h-6" />}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Motivation */}
      <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-2xl p-6 border border-purple-500/30">
        <div className="flex items-start gap-3">
          <TrendingUp className="w-6 h-6 text-purple-400 mt-1" />
          <div>
            <h3 className="font-semibold text-lg mb-2">
              {completedDailyToday === totalDailyToday ? "Perfect! 🎉" : 
               completedDailyToday > 0 ? "Keep going! 💪" : 
               stats.currentMissStreak > 0 ? "Time to turn this around! 🔥" :
               "Ready to start your day?"}
            </h3>
            <p className="text-slate-300 leading-relaxed">
              {completedDailyToday === totalDailyToday 
                ? "You crushed it today! This is how you build the life you want - one day at a time."
                : completedDailyToday > 0
                ? "Great progress! Finish strong and keep that momentum going."
                : stats.currentMissStreak > 0
                ? "You've been stuck in the doom loop. But today can be different. Check off ONE habit right now."
                : "Every journey starts with a single step. Check off your first habit and watch the magic happen."}
            </p>
            {quote && (
              <p className="text-slate-200 mt-4 italic border-l-2 border-purple-400/60 pl-4">
                {quote}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

export default DashboardView;

