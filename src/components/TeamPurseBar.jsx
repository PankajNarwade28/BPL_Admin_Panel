import React from 'react';
import { DollarSign, Wallet } from 'lucide-react';

const TeamPurseBar = ({ teams }) => {
  if (!teams || teams.length === 0) {
    return null;
  }

  // Sort teams by remaining points (lowest first to highlight teams running low)
  const sortedTeams = [...teams].sort((a, b) => a.remainingPoints - b.remainingPoints);

  const getColorClass = (remainingPoints) => {
    if (remainingPoints <= 10) return 'from-red-500 to-red-600 border-red-400';
    if (remainingPoints <= 30) return 'from-orange-500 to-orange-600 border-orange-400';
    if (remainingPoints <= 60) return 'from-yellow-500 to-yellow-600 border-yellow-400';
    return 'from-green-500 to-green-600 border-green-400';
  };

  const getTextColorClass = (remainingPoints) => {
    if (remainingPoints <= 10) return 'text-red-700';
    if (remainingPoints <= 30) return 'text-orange-700';
    if (remainingPoints <= 60) return 'text-yellow-700';
    return 'text-green-700';
  };

  const getIconBgClass = (remainingPoints) => {
    if (remainingPoints <= 10) return 'bg-red-100';
    if (remainingPoints <= 30) return 'bg-orange-100';
    if (remainingPoints <= 60) return 'bg-yellow-100';
    return 'bg-green-100';
  };

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 px-6 lg:px-8 py-4 border-t border-gray-200">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
          <Wallet size={20} className="text-purple-600" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-gray-900">Team Budgets</h3>
          <p className="text-xs text-gray-500">Real-time purse tracking</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-3">
        {sortedTeams.map((team) => {
          const pursePercentage = (team.remainingPoints / 110) * 100; // Assuming 110 is total budget
          
          return (
            <div
              key={team._id}
              className={`group relative bg-white rounded-xl p-3 border-2 ${getColorClass(team.remainingPoints).split(' ')[2] || 'border-gray-200'} hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 overflow-hidden`}
            >
              {/* Progress bar background */}
              <div className="absolute inset-0 bg-gradient-to-r opacity-5" 
                   style={{ 
                     background: `linear-gradient(90deg, ${
                       team.remainingPoints <= 10 ? '#ef4444' :
                       team.remainingPoints <= 30 ? '#f97316' :
                       team.remainingPoints <= 60 ? '#eab308' :
                       '#22c55e'
                     } ${pursePercentage}%, transparent ${pursePercentage}%)` 
                   }}
              ></div>
              
              <div className="relative z-10 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  {/* Team Logo */}
                  {team.logo && (
                    <img 
                      src={team.logo.startsWith('http') ? team.logo : `${process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000/'}${team.logo.replace(/^\/+/, '').startsWith('uploads') ? team.logo.replace(/^\/+/, '') : 'uploads/' + team.logo.replace(/^\/+/, '')}`}
                      alt={team.teamName}
                      className="w-8 h-8 rounded-full object-cover border border-gray-200 flex-shrink-0"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  )}
                  
                  {/* Team Name */}
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-bold text-gray-900 truncate" title={team.teamName}>
                      {team.teamName}
                    </div>
                    <div className="text-xs text-gray-500">
                      {team.rosterSlotsFilled || 0}/11 players
                    </div>
                  </div>
                </div>
                
                {/* Purse Amount */}
                <div className="flex-shrink-0 text-right">
                  <div className={`text-lg font-black ${getTextColorClass(team.remainingPoints)} leading-none flex items-center gap-1`}>
                    <DollarSign size={14} className="opacity-70" />
                    {team.remainingPoints}
                  </div>
                  <div className="text-xs text-gray-400 font-medium">
                    {pursePercentage.toFixed(0)}%
                  </div>
                </div>
              </div>

              {/* Online Status Indicator */}
              {team.isOnline && (
                <div className="absolute top-2 right-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TeamPurseBar;
