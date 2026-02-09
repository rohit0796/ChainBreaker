import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Calendar, Flame, Trophy, Award, Star, BarChart3, Settings } from 'lucide-react';
import NavButton from './components/NavButton.jsx';
import DashboardView from './views/DashboardView.jsx';
import WeekView from './views/WeekView.jsx';
import MonthView from './views/MonthView.jsx';
import StatsView from './views/StatsView.jsx';
import SettingsView from './views/SettingsView.jsx';

const storage = (() => {
  if (typeof window === 'undefined') {
    return null;
  }
  if (window.storage && typeof window.storage.get === 'function' && typeof window.storage.set === 'function') {
    return window.storage;
  }
  return {
    get: async (key) => ({ value: localStorage.getItem(key) }),
    set: async (key, value) => {
      localStorage.setItem(key, value);
    }
  };
})();

// Achievement definitions
const ACHIEVEMENTS = [
  { id: 'first_step', name: 'First Step', icon: '🎯', description: 'Complete your first habit', requirement: 1, type: 'total_completions' },
  { id: 'week_warrior', name: 'Week Warrior', icon: '⚔️', description: 'Complete all habits for 7 days', requirement: 7, type: 'perfect_days' },
  { id: 'streak_5', name: '5 Day Streak', icon: '🔥', description: 'Maintain a 5 day streak', requirement: 5, type: 'max_streak' },
  { id: 'streak_10', name: '10 Day Streak', icon: '🚀', description: 'Maintain a 10 day streak', requirement: 10, type: 'max_streak' },
  { id: 'streak_30', name: '30 Day Master', icon: '👑', description: 'Maintain a 30 day streak', requirement: 30, type: 'max_streak' },
  { id: 'century', name: 'Century Club', icon: '💯', description: 'Complete 100 habits total', requirement: 100, type: 'total_completions' },
  { id: 'consistency', name: 'Consistency King', icon: '💎', description: 'Maintain 80% completion rate for a month', requirement: 80, type: 'monthly_rate' },
  { id: 'early_bird', name: 'Early Bird', icon: '🌅', description: 'Complete morning walk 10 times', requirement: 10, type: 'habit_specific', habitId: 'walk' },
  { id: 'builder', name: 'Builder Badge', icon: '🔨', description: 'Complete 5 weekend builds', requirement: 5, type: 'habit_specific', habitId: 'build' },
  { id: 'no_scroll_master', name: 'Digital Detox', icon: '📵', description: 'No doomscroll for 14 days straight', requirement: 14, type: 'habit_specific', habitId: 'noScroll' },
];

const QUOTES = [
  "You will never always feel motivated, so learn to be disciplined.",
  "Your future is hidden in your daily routine.",
  "The pain of discipline weighs ounces; the pain of regret weighs tons.",
  "Small consistent steps build unstoppable momentum.",
  "Become the person who can handle the life you want.",
  "Growth begins where comfort ends.",
  "You don’t find your limits — you create them.",
  "Hard choices, easy life. Easy choices, hard life.",
  "If you avoid the struggle, you avoid becoming.",
  "Master boredom, and you will master your life.",
  "Your mind is either your prison or your palace — you decide.",
  "Confidence is built by keeping promises to yourself.",
  "Stop negotiating with excuses.",
  "The strongest people are forged by unseen battles.",
  "What you tolerate becomes your standard.",
  "Self-respect is the root of discipline.",
  "You become what you repeatedly do.",
  "Don’t believe every thought you think.",
  "Starve your distractions, feed your focus.",
  "When you control your mind, you control your direction.",
  "One day or day one — the choice is yours.",
  "Time will pass anyway; decide who you become while it does.",
  "Don’t trade long-term respect for short-term comfort.",
  "Where you are in five years is decided by what you do today.",
  "You are not behind; you are either preparing or procrastinating.",
  "The cost of inaction is far greater than the cost of failure.",
  "Most people overestimate a year and underestimate a decade.",
  "Protect your time — it is your life in fragments.",
  "A focused hour beats a distracted day.",
  "Live deliberately, not accidentally.",
  "Fear shrinks when confronted.",
  "Action cures anxiety.",
  "You don’t need more motivation; you need more action.",
  "Courage is doing it before you feel ready.",
  "If you wait for perfect conditions, you will wait forever.",
  "Start before you’re confident — confidence comes from starting.",
  "Risk is the tuition for growth.",
  "Dreams demand execution.",
  "You miss 100% of the lives you’re afraid to live.",
  "The door opens for the one who knocks.",
  "Failure is feedback, not a verdict.",
  "Rock bottom is a foundation if you decide to build on it.",
  "Fall seven times, stand up eight.",
  "Every setback carries the seed of a stronger version of you.",
  "Scars prove you survived what tried to break you.",
  "Resilience is quiet persistence.",
  "The comeback is always stronger than the setback.",
  "Storms don’t last, but strong people do.",
  "Your struggles are training, not punishment.",
  "Broken crayons still color.",
  "Don’t chase success — become someone it follows.",
  "Your habits are votes for the person you are becoming.",
  "Reinvent yourself as many times as necessary.",
  "Be stubborn about your goals, flexible about your methods.",
  "Character is built when no one is watching.",
  "Stop asking if it’s possible — ask if you’re committed.",
  "Who you become matters more than what you achieve.",
  "Act like the person you want to be.",
  "Self-transformation is the highest form of rebellion.",
  "Upgrade your identity, and your life upgrades automatically.",
  "Great things grow slowly.",
  "The oak tree doesn’t apologize for growing at its own pace.",
  "Consistency turns average into excellence.",
  "Trust the process, even when it’s boring.",
  "Momentum is invisible until it isn’t.",
  "Delayed gratification is self-respect in action.",
  "Focus on trajectory, not speed.",
  "What compounds quietly today dominates loudly tomorrow.",
  "Endure the seed stage.",
  "Stay patient — mastery is under construction.",
  "No one is coming to save you.",
  "Your life reflects what you’re willing to tolerate.",
  "Comfort is expensive — it costs you your potential.",
  "Excuses sound best to the person making them.",
  "Discipline is remembering what you want.",
  "If it matters, you’ll make time; if not, you’ll make excuses.",
  "You can have results or reasons — not both.",
  "The mirror is your most honest mentor.",
  "Talk less about goals; show more results.",
  "Average is a choice.",
  "Comparison steals joy and replaces it with insecurity.",
  "Gratitude turns what you have into enough.",
  "Energy flows where attention goes.",
  "Your environment shapes your ambition.",
  "Protect your peace like it’s priceless — because it is.",
  "Not everything deserves your reaction.",
  "Silence is sometimes the loudest strength.",
  "Let go of what no longer grows you.",
  "Inner peace is the ultimate success.",
  "Choose progress over perfection.",
  "Live so that your past is proud and your future is grateful.",
  "Make your life a story worth telling.",
  "Don’t die with your music still inside you.",
  "Be the ancestor your descendants thank.",
  "Leave footprints worth following.",
  "The goal is not to exist, but to matter.",
  "Greatness is built in ordinary moments.",
  "Your life is your message — make it powerful.",
  "Meaning is found in contribution.",
  "Become unforgettable through the way you live."
];

const DEFAULT_HABITS = [
  { id: 'walk', name: '30-min Morning Walk', icon: '🚶', streak: 0, weeklyTarget: 7, color: 'bg-green-500', category: 'health' },
  { id: 'noScroll', name: 'No Doomscroll After Work', icon: '🚫', streak: 0, weeklyTarget: 7, color: 'bg-blue-500', category: 'productivity' },
  { id: 'build', name: 'Weekend Build', icon: '🔨', streak: 0, weeklyTarget: 1, color: 'bg-purple-500', category: 'creativity' }
];

export default function ChainBreaker() {
  function normalizeHabits(list, completionData = {}) {
    const todayIso = new Date().toISOString();
    return (list || []).map(habit => {
      if (habit.createdAt) {
        return habit;
      }
      const firstDateKey = Object.keys(completionData)
        .filter(dateKey => completionData[dateKey]?.[habit.id])
        .sort()[0];
      const createdAt = firstDateKey ? new Date(firstDateKey).toISOString() : todayIso;
      return { ...habit, createdAt };
    });
  }

  const [habits, setHabits] = useState(() => normalizeHabits(DEFAULT_HABITS, {}));
  const [completions, setCompletions] = useState({});
  const [view, setView] = useState('dashboard'); // dashboard, week, month, stats, settings
  const [currentDate, setCurrentDate] = useState(new Date());
  const [achievements, setAchievements] = useState([]);
  const [level, setLevel] = useState(1);
  const [xp, setXp] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [newAchievement, setNewAchievement] = useState(null);
  const [showAddHabit, setShowAddHabit] = useState(false);
  const [editingHabit, setEditingHabit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadTimedOut, setLoadTimedOut] = useState(false);
  const [error, setError] = useState(null);
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [quoteDayKey, setQuoteDayKey] = useState('');
  const saveTimeoutRef = useRef(null);

  const stats = useMemo(() => calculateStats(), [completions, habits]);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (loading) {
      return;
    }
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    saveTimeoutRef.current = setTimeout(() => {
      saveData();
    }, 300);
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [completions, habits, achievements, level, xp, loading]);

  useEffect(() => {
    if (loading) {
      return;
    }
    checkAchievements(stats, completions);
  }, [stats, completions, achievements, loading]);

  useEffect(() => {
    const nextLevel = Math.floor(xp / 100) + 1;
    if (nextLevel !== level) {
      setLevel(nextLevel);
    }
  }, [xp, level]);

  async function loadData() {
    let timeoutId;
    try {
      setLoading(true);
      setLoadTimedOut(false);
      timeoutId = setTimeout(() => {
        setLoadTimedOut(true);
        setLoading(false);
      }, 2000);
      if (!storage) {
        return;
      }
      const result = await storage.get('chainbreaker-data');
      if (result && result.value) {
        const data = JSON.parse(result.value);
        setCompletions(data.completions || {});
        setHabits(normalizeHabits(data.habits || DEFAULT_HABITS, data.completions || {}));
        setAchievements(data.achievements || []);
        setLevel(data.level || 1);
        setXp(data.xp || 0);
        if (typeof data.quoteIndex === 'number') {
          setQuoteIndex(data.quoteIndex);
        } else {
          setQuoteIndex(Math.floor(Math.random() * QUOTES.length));
        }
        if (typeof data.quoteDayKey === 'string') {
          setQuoteDayKey(data.quoteDayKey);
        }
        updateStreaks(data.completions || {}, data.habits || DEFAULT_HABITS);
      }
    } catch (error) {
      console.log('Could not load data, using defaults:', error);
    } finally {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      setLoading(false);
    }
  }

  async function saveData() {
    try {
      if (!storage) {
        return;
      }
      await storage.set('chainbreaker-data', JSON.stringify({
        completions,
        habits,
        achievements,
        level,
        xp,
        quoteIndex,
        quoteDayKey,
        lastUpdated: new Date().toISOString()
      }));
    } catch (error) {
      console.log('Could not save data:', error);
      // Don't block the UI if save fails
    }
  }

  function getDateKey(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  useEffect(() => {
    if (!loading) {
      const todayKey = getDateKey(new Date());
      if (quoteDayKey !== todayKey) {
        const nextIndex = Math.floor(Math.random() * QUOTES.length);
        setQuoteIndex(nextIndex);
        setQuoteDayKey(todayKey);
      }
    }
  }, [loading, quoteDayKey]);

  function startOfWeek(date) {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - d.getDay());
    return d;
  }

  function addDays(date, days) {
    const d = new Date(date);
    d.setDate(d.getDate() + days);
    return d;
  }

  function updateStreaks(completionData, habitList) {
    if (!habitList || habitList.length === 0) {
      return;
    }

    const today = new Date();
    const updatedHabits = habitList.map(habit => {
      let streak = 0;
      let checkDate = new Date(today);
      
      while (true) {
        const dateKey = getDateKey(checkDate);
        if (completionData[dateKey]?.[habit.id]) {
          streak++;
          checkDate.setDate(checkDate.getDate() - 1);
        } else {
          break;
        }
      }
      
      return { ...habit, streak };
    });
    
    setHabits(updatedHabits);
  }

  function toggleHabit(habitId, date = new Date()) {
    const dateKey = getDateKey(date);
    const todayKey = getDateKey(new Date());
    if (dateKey !== todayKey) {
      return;
    }
    const newCompletions = { ...completions };
    
    if (!newCompletions[dateKey]) {
      newCompletions[dateKey] = {};
    }
    
    const wasCompleted = newCompletions[dateKey][habitId];
    newCompletions[dateKey][habitId] = !wasCompleted;
    
    setCompletions(newCompletions);
    updateStreaks(newCompletions, habits);
    
    // Handle XP changes
    if (newCompletions[dateKey][habitId]) {
      // Marking as complete - ADD XP
      const newXp = xp + 10;
      setXp(newXp);
      
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
    } else {
      // Unmarking - SUBTRACT XP
      const newXp = Math.max(0, xp - 10); // Don't go below 0
      setXp(newXp);
      
      // Also recalculate level if needed
      const newLevel = Math.floor(newXp / 100) + 1;
      setLevel(newLevel);
    }
  }

  function checkAchievements(currentStats, completionData) {
    if (!habits || habits.length === 0 || !completionData) {
      return;
    }

    const newUnlocked = [];

    ACHIEVEMENTS.forEach(achievement => {
      if (achievements.includes(achievement.id)) return;

      let unlocked = false;

      switch (achievement.type) {
        case 'total_completions':
          unlocked = currentStats.totalCompletions >= achievement.requirement;
          break;
        case 'max_streak':
          unlocked = currentStats.maxStreak >= achievement.requirement;
          break;
        case 'perfect_days':
          unlocked = currentStats.perfectDays >= achievement.requirement;
          break;
        case 'habit_specific':
          const habitCompletions = Object.keys(completionData).filter(
            dateKey => completionData[dateKey][achievement.habitId]
          ).length;
          unlocked = habitCompletions >= achievement.requirement;
          break;
        case 'monthly_rate':
          unlocked = currentStats.currentMonthRate >= achievement.requirement;
          break;
      }

      if (unlocked) {
        newUnlocked.push(achievement.id);
        setNewAchievement(achievement);
        setTimeout(() => setNewAchievement(null), 4000);
      }
    });

    if (newUnlocked.length > 0) {
      setAchievements([...achievements, ...newUnlocked]);
    }
  }


  function calculateStats() {
    if (!habits || habits.length === 0) {
      return {
        totalCompletions: 0,
        perfectDays: 0,
        maxStreak: 0,
        currentStreak: 0,
        currentMonthRate: 0,
        totalMisses: 0,
        currentMissStreak: 0
      };
    }

    const allDates = Object.keys(completions);
    const habitStartKey = (habit) => {
      const date = habit.createdAt ? new Date(habit.createdAt) : new Date();
      return getDateKey(date);
    };
    let totalCompletions = 0;
    let perfectDays = 0;
    let maxStreak = 0;
    let currentStreak = 0;
    let totalMisses = 0;
    let currentMissStreak = 0;

    allDates.forEach(dateKey => {
      const activeHabits = habits.filter(h => habitStartKey(h) <= dateKey);
      if (activeHabits.length === 0) {
        return;
      }
      const dayCompletions = activeHabits.filter(h => completions[dateKey]?.[h.id]).length;
      totalCompletions += dayCompletions;
      
      if (dayCompletions === activeHabits.length) {
        perfectDays++;
      }
    });

    // Calculate current streak
    const today = new Date();
    let checkDate = new Date(today);
    currentStreak = 0;

    while (true) {
      const dateKey = getDateKey(checkDate);
      const dayCompletions = completions[dateKey] ? Object.values(completions[dateKey]).filter(Boolean).length : 0;
      
      if (dayCompletions > 0) {
        currentStreak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }

    // Weekly miss tracking based on habit.weeklyTarget
    const weeklyCounts = {};
    allDates.forEach(dateKey => {
      const date = new Date(dateKey);
      const weekKey = getDateKey(startOfWeek(date));
      if (!weeklyCounts[weekKey]) {
        weeklyCounts[weekKey] = {};
      }
      const dayData = completions[dateKey] || {};
      Object.keys(dayData).forEach(habitId => {
        if (!dayData[habitId]) return;
        weeklyCounts[weekKey][habitId] = (weeklyCounts[weekKey][habitId] || 0) + 1;
      });
    });

    const thisWeekStart = startOfWeek(new Date());
    const lastFullWeekStart = addDays(thisWeekStart, -7);

    let earliestDate = new Date();
    const habitDates = habits.map(h => new Date(h.createdAt || new Date()));
    const completionDates = allDates.map(d => new Date(d));
    if (habitDates.length > 0 || completionDates.length > 0) {
      earliestDate = new Date(Math.min(...habitDates.map(d => d.getTime()), ...completionDates.map(d => d.getTime())));
    } else {
      earliestDate = lastFullWeekStart;
    }
    const earliestWeekStart = startOfWeek(earliestDate);

    for (let w = new Date(earliestWeekStart); w <= lastFullWeekStart; w = addDays(w, 7)) {
      const weekKey = getDateKey(w);
      const weekEndKey = getDateKey(addDays(w, 6));
      const activeHabits = habits.filter(h => habitStartKey(h) <= weekEndKey);
      if (activeHabits.length === 0) {
        continue;
      }
      let missingThisWeek = 0;
      activeHabits.forEach(habit => {
        const required = habit.weeklyTarget || 0;
        const actual = weeklyCounts[weekKey]?.[habit.id] || 0;
        if (actual < required) {
          missingThisWeek += (required - actual);
        }
      });
      totalMisses += missingThisWeek;
    }

    currentMissStreak = 0;
    for (let w = new Date(lastFullWeekStart); w >= earliestWeekStart; w = addDays(w, -7)) {
      const weekKey = getDateKey(w);
      const weekEndKey = getDateKey(addDays(w, 6));
      const activeHabits = habits.filter(h => habitStartKey(h) <= weekEndKey);
      if (activeHabits.length === 0) {
        break;
      }
      let missingThisWeek = 0;
      activeHabits.forEach(habit => {
        const required = habit.weeklyTarget || 0;
        const actual = weeklyCounts[weekKey]?.[habit.id] || 0;
        if (actual < required) {
          missingThisWeek += (required - actual);
        }
      });
      if (missingThisWeek > 0) {
        currentMissStreak += 1;
      } else {
        break;
      }
    }

    maxStreak = Math.max(...habits.map(h => h.streak), currentStreak);

    // Current month completion rate
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    let monthCompletions = 0;
    let possibleCompletions = 0;

    for (let i = 0; i < daysInMonth; i++) {
      const checkDate = new Date(monthStart);
      checkDate.setDate(i + 1);
      if (checkDate > now) break;
      
      const dateKey = getDateKey(checkDate);
      const activeHabits = habits.filter(h => habitStartKey(h) <= dateKey);
      if (activeHabits.length === 0) {
        continue;
      }
      possibleCompletions += activeHabits.length;
      monthCompletions += activeHabits.filter(h => completions[dateKey]?.[h.id]).length;
    }

    const currentMonthRate = possibleCompletions > 0 ? (monthCompletions / possibleCompletions) * 100 : 0;

    return {
      totalCompletions,
      perfectDays,
      maxStreak,
      currentStreak,
      currentMonthRate: Math.round(currentMonthRate),
      totalMisses,
      currentMissStreak
    };
  }

  function addHabit(habitData) {
    const newHabit = {
      id: Date.now().toString(),
      ...habitData,
      streak: 0,
      createdAt: new Date().toISOString()
    };
    setHabits([...habits, newHabit]);
    setShowAddHabit(false);
  }

  function updateHabit(habitId, habitData) {
    setHabits(habits.map(h => h.id === habitId ? { ...h, ...habitData } : h));
    setEditingHabit(null);
  }

  function deleteHabit(habitId) {
    if (confirm('Delete this habit? This will remove all completion data for it.')) {
      setHabits(habits.filter(h => h.id !== habitId));
      // Clean up completions
      const newCompletions = { ...completions };
      Object.keys(newCompletions).forEach(dateKey => {
        delete newCompletions[dateKey][habitId];
      });
      setCompletions(newCompletions);
    }
  }

  async function resetData() {
    try {
      await storage.set('chainbreaker-data', '');
    } catch (error) {
      console.log('Could not clear data:', error);
    }
    setCompletions({});
    setHabits(DEFAULT_HABITS);
    setAchievements([]);
    setLevel(1);
    setXp(0);
    setShowAddHabit(false);
    setEditingHabit(null);
  }

  const xpToNextLevel = ((level) * 100) - xp;
  const xpProgress = (xp % 100);

  // Loading screen
  if (loading && !loadTimedOut) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center mb-4 mx-auto animate-pulse">
            <Flame className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Loading ChainBreaker...</h2>
          <p className="text-slate-400">Getting your data ready</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Header */}
      <div className="bg-slate-800/50 backdrop-blur border-b border-slate-700 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                <Flame className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
                  ChainBreaker
                </h1>
                <p className="text-xs text-slate-400">Breaking patterns, building momentum</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Level Badge */}
              <div className="bg-purple-500/20 border border-purple-500/50 rounded-lg px-4 py-2">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-purple-400" />
                  <div>
                    <div className="text-xs text-slate-400">Level</div>
                    <div className="text-lg font-bold">{level}</div>
                  </div>
                </div>
                <div className="mt-1 w-24 bg-slate-700 rounded-full h-1.5">
                  <div 
                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-full rounded-full transition-all"
                    style={{ width: `${xpProgress}%` }}
                  />
                </div>
                <div className="text-xs text-slate-400 mt-1">{xpToNextLevel} XP to next level</div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex gap-2 mt-4 overflow-x-auto pb-2 -mb-2 whitespace-nowrap">
            <NavButton active={view === 'dashboard'} onClick={() => setView('dashboard')} icon={<BarChart3 className="w-4 h-4" />}>
              Dashboard
            </NavButton>
            <NavButton active={view === 'week'} onClick={() => setView('week')} icon={<Calendar className="w-4 h-4" />}>
              Week
            </NavButton>
            <NavButton active={view === 'month'} onClick={() => setView('month')} icon={<Calendar className="w-4 h-4" />}>
              Month
            </NavButton>
            <NavButton active={view === 'stats'} onClick={() => setView('stats')} icon={<Trophy className="w-4 h-4" />}>
              Achievements
            </NavButton>
            <NavButton active={view === 'settings'} onClick={() => setView('settings')} icon={<Settings className="w-4 h-4" />}>
              Habits
            </NavButton>
          </div>
        </div>
      </div>

      {/* Success Toast */}
      {showSuccess && (
        <div className="fixed top-24 right-8 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg animate-bounce z-50">
          ✨ +10 XP! Keep going!
        </div>
      )}

      {/* New Achievement Toast */}
      {newAchievement && (
        <div className="fixed top-24 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-8 py-4 rounded-lg shadow-2xl animate-bounce z-50">
          <div className="flex items-center gap-3">
            <Award className="w-8 h-8" />
            <div>
              <div className="font-bold text-lg">Achievement Unlocked!</div>
              <div className="text-sm opacity-90">{newAchievement.icon} {newAchievement.name}</div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        {loadTimedOut && (
          <div className="mb-6 bg-red-900/30 border border-red-700 text-red-200 rounded-xl p-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="font-semibold">Loading took too long.</div>
                <div className="text-sm text-red-300">Showing defaults. Your saved data might be large or corrupted.</div>
              </div>
              <button
                onClick={resetData}
                className="bg-red-600 hover:bg-red-700 px-3 py-2 rounded-lg text-sm font-medium"
              >
                Reset Local Data
              </button>
            </div>
          </div>
        )}
        {view === 'dashboard' && <DashboardView habits={habits} completions={completions} stats={stats} toggleHabit={toggleHabit} getDateKey={getDateKey} quote={QUOTES[quoteIndex]} />}
        {view === 'week' && <WeekView habits={habits} completions={completions} currentDate={currentDate} setCurrentDate={setCurrentDate} toggleHabit={toggleHabit} getDateKey={getDateKey} />}
        {view === 'month' && <MonthView habits={habits} completions={completions} currentDate={currentDate} setCurrentDate={setCurrentDate} toggleHabit={toggleHabit} getDateKey={getDateKey} />}
        {view === 'stats' && <StatsView achievements={achievements} stats={stats} level={level} xp={xp} allAchievements={ACHIEVEMENTS} />}
        {view === 'settings' && (
          <SettingsView 
            habits={habits} 
            showAddHabit={showAddHabit}
            setShowAddHabit={setShowAddHabit}
            editingHabit={editingHabit}
            setEditingHabit={setEditingHabit}
            addHabit={addHabit}
            updateHabit={updateHabit}
            deleteHabit={deleteHabit}
          />
        )}
      </div>
    </div>
  );
}

