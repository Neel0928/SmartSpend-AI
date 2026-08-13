import React, { useState, useEffect } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import { Target, Plus, Car, Plane, Home, Laptop, Gift, Wallet, GraduationCap, Heart, Clock, Loader2, ArrowRight } from 'lucide-react';
import { getGoals } from '../services/goalService';
import CreateGoalModal from '../components/modals/CreateGoalModal';
import AddFundsModal from '../components/modals/AddFundsModal';
import EditGoalModal from '../components/modals/EditGoalModal';
import { useSettings } from '../context/SettingsContext';
import { MoreVertical, Edit2 } from 'lucide-react';

const ICON_MAP = {
  'wallet': Wallet,
  'car': Car,
  'plane': Plane,
  'home': Home,
  'laptop': Laptop,
  'gift': Gift,
  'graduation-cap': GraduationCap,
  'heart': Heart
};

export default function Goals() {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedGoalForFunds, setSelectedGoalForFunds] = useState(null);
  const [selectedGoalForEdit, setSelectedGoalForEdit] = useState(null);
  
  const { currencySymbol } = useSettings();

  const fetchGoals = async () => {
    try {
      setLoading(true);
      const data = await getGoals();
      setGoals(data);
    } catch (error) {
      console.error('Failed to fetch goals:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  const getDeadlineText = (deadline, status) => {
    if (!deadline) return 'No deadline set';
    if (status === 'completed') return 'Goal completed 🎉';
    
    const now = new Date();
    const targetDate = new Date(deadline);
    const diffTime = targetDate - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0 || status === 'expired') return 'Deadline passed';
    if (diffDays === 0) return 'Due today';
    if (diffDays === 1) return '1 day remaining';
    
    if (diffDays > 30) {
      const months = Math.floor(diffDays / 30);
      return `${months} month${months > 1 ? 's' : ''} remaining`;
    }
    
    return `${diffDays} days remaining`;
  };

  const activeGoals = goals.filter(g => g.status === 'active');
  const completedGoals = goals.filter(g => g.status === 'completed');
  
  const totalTarget = activeGoals.reduce((sum, g) => sum + g.targetAmount, 0);
  const totalSaved = activeGoals.reduce((sum, g) => sum + g.currentAmount, 0);
  const overallProgress = totalTarget > 0 ? Math.round((totalSaved / totalTarget) * 100) : 0;

  return (
    <DashboardLayout hideHeaderControls={true}>
      <div className="max-w-7xl mx-auto space-y-6 animate-fade-in pb-12">
        <CreateGoalModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onGoalCreated={fetchGoals}
        />
        <AddFundsModal
          isOpen={!!selectedGoalForFunds}
          onClose={() => setSelectedGoalForFunds(null)}
          goal={selectedGoalForFunds}
          onFundsAdded={fetchGoals}
        />
        <EditGoalModal
          isOpen={!!selectedGoalForEdit}
          onClose={() => setSelectedGoalForEdit(null)}
          goal={selectedGoalForEdit}
          onGoalUpdated={fetchGoals}
        />

        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Savings Goals</h1>
            <p className="text-gray-400 text-sm mt-1">Set targets and track your savings progress.</p>
          </div>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-colors shadow-[0_0_15px_rgba(16,185,129,0.3)]"
          >
            <Plus className="w-4 h-4" />
            Create Goal
          </button>
        </div>

        {/* Overview Card */}
        <div className="glass-card rounded-3xl p-8 border border-white/10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex-1 space-y-2 text-center md:text-left">
              <p className="text-gray-400 font-medium text-sm">Overall Savings Progress (Active Goals)</p>
              <div className="flex items-end justify-center md:justify-start gap-2">
                <h2 className="text-4xl font-bold text-white">{currencySymbol}{totalSaved.toLocaleString()}</h2>
                <span className="text-gray-500 font-medium mb-1">/ {currencySymbol}{totalTarget.toLocaleString()}</span>
              </div>
            </div>
            
            <div className="w-full md:w-1/2">
              <div className="flex justify-between items-end mb-2">
                <span className="text-sm font-bold text-emerald-400">{overallProgress}%</span>
                <span className="text-xs font-medium text-gray-500">Total Progress</span>
              </div>
              <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-emerald-500 rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                  style={{ width: `${Math.min(overallProgress, 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Goals Grid */}
        <div className="space-y-4">
          <h3 className="font-bold text-white text-lg">Your Goals</h3>
          
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-500 gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
              <p className="font-medium">Loading goals...</p>
            </div>
          ) : goals.length === 0 ? (
            <div className="glass-card rounded-3xl p-12 text-center border border-white/10 flex flex-col items-center justify-center space-y-4">
              <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-400 mb-2">
                <Target className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-white">No goals yet</h3>
              <p className="text-gray-400 max-w-sm mx-auto">Create your first savings goal to start tracking your progress towards what matters most.</p>
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="mt-4 px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-medium transition-colors shadow-[0_0_15px_rgba(16,185,129,0.3)]"
              >
                Create a Goal
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {goals.map((goal) => {
                const Icon = ICON_MAP[goal.icon] || Wallet;
                const isCompleted = goal.status === 'completed';
                
                return (
                  <div key={goal._id} className={`glass-card rounded-3xl p-6 border ${isCompleted ? 'border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.1)]' : 'border-white/10'} flex flex-col relative overflow-hidden transition-all hover:-translate-y-1 hover:border-white/20`}>
                    
                    {/* Background decorative blob */}
                    <div className={`absolute -top-12 -right-12 w-32 h-32 rounded-full blur-2xl opacity-10 ${goal.color.replace('bg-', 'bg-')}`}></div>
                    
                    <div className="flex justify-between items-start mb-6 relative z-10">
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${goal.color.replace('bg-', 'bg-')}/20 shadow-sm border border-white/5`}>
                          <Icon className={`w-6 h-6 ${goal.color.replace('bg-', 'text-')}`} />
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {isCompleted ? (
                          <div className="px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded-full text-xs font-bold border border-emerald-500/20 flex items-center gap-1">
                            <span>🎉</span> Completed
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 text-xs font-medium text-gray-400 bg-white/5 px-3 py-1 rounded-full border border-white/10">
                            <Clock className="w-3 h-3" />
                            {getDeadlineText(goal.deadline, goal.status)}
                          </div>
                        )}
                        
                        <div className="relative group">
                          <button 
                            onClick={() => setSelectedGoalForEdit(goal)}
                            className="p-1.5 text-gray-500 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
                            title="Edit or Delete Goal"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mb-6 flex-1 relative z-10">
                      <h3 className="text-xl font-bold text-white mb-1">{goal.title}</h3>
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold text-white">{currencySymbol}{goal.currentAmount.toLocaleString()}</span>
                        <span className="text-sm font-medium text-gray-500">/ {currencySymbol}{goal.targetAmount.toLocaleString()}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-4 relative z-10">
                      <div>
                        <div className="flex justify-between items-end mb-2">
                          <span className={`text-sm font-bold ${isCompleted ? 'text-emerald-400' : goal.color.replace('bg-', 'text-')}`}>
                            {goal.progress}%
                          </span>
                          <span className="text-xs font-medium text-gray-500">
                            {currencySymbol}{goal.remaining.toLocaleString()} left
                          </span>
                        </div>
                        <div className="w-full h-2.5 bg-white/10 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all duration-1000 ease-out ${isCompleted ? 'bg-emerald-500' : goal.color.replace('bg-', 'bg-')}`}
                            style={{ width: `${goal.progress}%` }}
                          />
                        </div>
                      </div>
                      
                      {!isCompleted && (
                        <button 
                          onClick={() => setSelectedGoalForFunds(goal)}
                          className="w-full py-2.5 rounded-xl border border-white/10 bg-white/5 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all flex items-center justify-center gap-2"
                        >
                          <Plus className="w-4 h-4" />
                          Add Funds
                        </button>
                      )}
                      
                      {isCompleted && (
                        <button 
                          disabled
                          className="w-full py-2.5 rounded-xl bg-emerald-500/10 text-sm font-medium text-emerald-400 cursor-default flex items-center justify-center gap-2 border border-emerald-500/20"
                        >
                          Target Reached!
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
