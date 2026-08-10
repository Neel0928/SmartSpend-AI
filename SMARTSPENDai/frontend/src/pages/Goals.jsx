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
            <h1 className="text-2xl font-bold text-gray-900">Savings Goals</h1>
            <p className="text-gray-500 text-sm mt-1">Set targets and track your savings progress.</p>
          </div>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-colors shadow-sm shadow-blue-600/20"
          >
            <Plus className="w-4 h-4" />
            Create Goal
          </button>
        </div>

        {/* Overview Card */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex-1 space-y-2 text-center md:text-left">
              <p className="text-gray-500 font-medium text-sm">Overall Savings Progress (Active Goals)</p>
              <div className="flex items-end justify-center md:justify-start gap-2">
                <h2 className="text-4xl font-bold text-gray-900">{currencySymbol}{totalSaved.toLocaleString()}</h2>
                <span className="text-gray-400 font-medium mb-1">/ {currencySymbol}{totalTarget.toLocaleString()}</span>
              </div>
            </div>
            
            <div className="w-full md:w-1/2">
              <div className="flex justify-between items-end mb-2">
                <span className="text-sm font-bold text-blue-600">{overallProgress}%</span>
                <span className="text-xs font-medium text-gray-400">Total Progress</span>
              </div>
              <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${Math.min(overallProgress, 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Goals Grid */}
        <div className="space-y-4">
          <h3 className="font-bold text-gray-900 text-lg">Your Goals</h3>
          
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400 gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
              <p className="font-medium">Loading goals...</p>
            </div>
          ) : goals.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center shadow-sm border border-gray-100 flex flex-col items-center justify-center space-y-4">
              <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-500 mb-2">
                <Target className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">No goals yet</h3>
              <p className="text-gray-500 max-w-sm mx-auto">Create your first savings goal to start tracking your progress towards what matters most.</p>
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="mt-4 px-6 py-2.5 bg-gray-900 hover:bg-gray-800 text-white rounded-xl font-medium transition-colors shadow-lg"
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
                  <div key={goal._id} className={`bg-white rounded-3xl p-6 shadow-sm border ${isCompleted ? 'border-green-100' : 'border-gray-100'} flex flex-col relative overflow-hidden transition-all hover:shadow-md hover:-translate-y-1`}>
                    
                    {/* Background decorative blob */}
                    <div className={`absolute -top-12 -right-12 w-32 h-32 rounded-full blur-2xl opacity-10 ${goal.color}`}></div>
                    
                    <div className="flex justify-between items-start mb-6 relative z-10">
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${goal.color} bg-opacity-10 shadow-sm`}>
                          <Icon className={`w-6 h-6 ${goal.color.replace('bg-', 'text-')}`} />
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {isCompleted ? (
                          <div className="px-3 py-1 bg-green-50 text-green-600 rounded-full text-xs font-bold border border-green-100 flex items-center gap-1">
                            <span>🎉</span> Completed
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 text-xs font-medium text-gray-500 bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
                            <Clock className="w-3 h-3" />
                            {getDeadlineText(goal.deadline, goal.status)}
                          </div>
                        )}
                        
                        <div className="relative group">
                          <button 
                            onClick={() => setSelectedGoalForEdit(goal)}
                            className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                            title="Edit or Delete Goal"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mb-6 flex-1 relative z-10">
                      <h3 className="text-xl font-bold text-gray-900 mb-1">{goal.title}</h3>
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold text-gray-900">{currencySymbol}{goal.currentAmount.toLocaleString()}</span>
                        <span className="text-sm font-medium text-gray-400">/ {currencySymbol}{goal.targetAmount.toLocaleString()}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-4 relative z-10">
                      <div>
                        <div className="flex justify-between items-end mb-2">
                          <span className={`text-sm font-bold ${isCompleted ? 'text-green-600' : goal.color.replace('bg-', 'text-')}`}>
                            {goal.progress}%
                          </span>
                          <span className="text-xs font-medium text-gray-400">
                            {currencySymbol}{goal.remaining.toLocaleString()} left
                          </span>
                        </div>
                        <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all duration-1000 ease-out ${isCompleted ? 'bg-green-500' : goal.color}`}
                            style={{ width: `${goal.progress}%` }}
                          />
                        </div>
                      </div>
                      
                      {!isCompleted && (
                        <button 
                          onClick={() => setSelectedGoalForFunds(goal)}
                          className="w-full py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all flex items-center justify-center gap-2"
                        >
                          <Plus className="w-4 h-4" />
                          Add Funds
                        </button>
                      )}
                      
                      {isCompleted && (
                        <button 
                          disabled
                          className="w-full py-2.5 rounded-xl bg-green-50 text-sm font-medium text-green-700 opacity-80 cursor-default flex items-center justify-center gap-2 border border-green-100"
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
