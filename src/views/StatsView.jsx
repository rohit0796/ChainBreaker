import React from 'react';
import { Trophy, Flame, CheckCircle2, Star, Target } from 'lucide-react';
import StatCard from '../components/StatCard.jsx';

const StatsView = React.memo(function StatsView({ achievements, stats, level, xp, allAchievements }) {
  const unlockedAchievements = allAchievements.filter(a => achievements.includes(a.id));
  const lockedAchievements = allAchievements.filter(a => !achievements.includes(a.id));

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard 
          icon={<Trophy className="w-6 h-6 text-yellow-400" />}
          label="Achievements"
          value={`${unlockedAchievements.length}/${allAchievements.length}`}
          color="from-yellow-500 to-orange-500"
        />
        <StatCard 
          icon={<Flame className="w-6 h-6 text-orange-400" />}
          label="Best Streak"
          value={stats.maxStreak}
          subtitle="days"
          color="from-orange-500 to-red-500"
        />
        <StatCard 
          icon={<CheckCircle2 className="w-6 h-6 text-green-400" />}
          label="Perfect Days"
          value={stats.perfectDays}
          color="from-green-500 to-emerald-500"
        />
        <StatCard 
          icon={<Star className="w-6 h-6 text-purple-400" />}
          label="Level"
          value={level}
          subtitle={`${xp} XP`}
          color="from-purple-500 to-pink-500"
        />
      </div>

      {/* Shame Stats - Show total misses */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-slate-800/50 backdrop-blur rounded-2xl p-6 border border-slate-700">
          <div className="text-center">
            <div className="text-4xl mb-2">✅</div>
            <div className="text-3xl font-bold text-green-400">{stats.totalCompletions}</div>
            <div className="text-sm text-slate-400 mt-1">Total Completions</div>
          </div>
        </div>
        <div className="bg-red-900/20 backdrop-blur rounded-2xl p-6 border border-red-700">
          <div className="text-center">
            <div className="text-4xl mb-2">❌</div>
            <div className="text-3xl font-bold text-red-400">{stats.totalMisses}</div>
            <div className="text-sm text-slate-400 mt-1">Missed Targets</div>
            {stats.currentMissStreak > 0 && (
              <div className="text-xs text-red-400 mt-2 font-bold">
                {stats.currentMissStreak} week miss streak!
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Unlocked Achievements */}
      <div className="bg-slate-800/50 backdrop-blur rounded-2xl p-6 border border-slate-700">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Trophy className="w-6 h-6 text-yellow-400" />
          Unlocked Achievements
        </h2>
        {unlockedAchievements.length === 0 ? (
          <p className="text-slate-400 text-center py-8">Complete your first habit to unlock your first achievement!</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {unlockedAchievements.map(achievement => (
              <div key={achievement.id} className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/50 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <span className="text-4xl">{achievement.icon}</span>
                  <div>
                    <h3 className="font-semibold text-lg">{achievement.name}</h3>
                    <p className="text-sm text-slate-300">{achievement.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Locked Achievements */}
      <div className="bg-slate-800/50 backdrop-blur rounded-2xl p-6 border border-slate-700">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Target className="w-6 h-6 text-slate-400" />
          Locked Achievements
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {lockedAchievements.map(achievement => (
            <div key={achievement.id} className="bg-slate-700/30 border border-slate-600 rounded-xl p-4 opacity-60">
              <div className="flex items-start gap-3">
                <span className="text-4xl grayscale">{achievement.icon}</span>
                <div>
                  <h3 className="font-semibold text-lg text-slate-300">{achievement.name}</h3>
                  <p className="text-sm text-slate-400">{achievement.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

export default StatsView;

