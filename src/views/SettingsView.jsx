import React from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import HabitForm from '../components/HabitForm.jsx';

const SettingsView = React.memo(function SettingsView({ habits, showAddHabit, setShowAddHabit, editingHabit, setEditingHabit, addHabit, updateHabit, deleteHabit }) {
  return (
    <div className="space-y-6">
      <div className="bg-slate-800/50 backdrop-blur rounded-2xl p-6 border border-slate-700">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Manage Habits</h2>
          <button
            onClick={() => setShowAddHabit(true)}
            className="flex items-center gap-2 bg-green-500 hover:bg-green-600 px-4 py-2 rounded-lg transition-all"
          >
            <Plus className="w-5 h-5" />
            Add Habit
          </button>
        </div>

        {!habits || habits.length === 0 ? (
          <div className="text-center py-8 text-slate-400">
            <p>No habits yet. Click "Add Habit" to create your first one!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {habits.map(habit => (
              <div key={habit.id} className="bg-slate-700/30 rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{habit.icon}</span>
                  <div>
                    <h3 className="font-semibold">{habit.name}</h3>
                    <p className="text-sm text-slate-400">Target: {habit.weeklyTarget} times/week</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setEditingHabit(habit)}
                    className="p-2 hover:bg-slate-600 rounded-lg transition-all"
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => deleteHabit(habit.id)}
                    className="p-2 hover:bg-red-500/20 text-red-400 rounded-lg transition-all"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {(showAddHabit || editingHabit) && (
        <HabitForm
          habit={editingHabit}
          onSave={(data) => editingHabit ? updateHabit(editingHabit.id, data) : addHabit(data)}
          onCancel={() => {
            setShowAddHabit(false);
            setEditingHabit(null);
          }}
        />
      )}
    </div>
  );
});

export default SettingsView;

