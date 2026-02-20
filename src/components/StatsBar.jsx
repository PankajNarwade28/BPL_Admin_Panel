import React from 'react';
import { Users, TrendingUp, TrendingDown, Wifi, Activity } from 'lucide-react';

const StatsBar = ({ stats, teams }) => {
  const onlineTeams = teams.filter(t => t.isOnline).length;
  const completionRate = stats.totalPlayers > 0 ? ((stats.soldPlayers / stats.totalPlayers) * 100).toFixed(1) : 0;
  
  const statsData = [
    {
      label: 'Total Players',
      value: stats.totalPlayers,
      icon: <Users size={22} />,
      gradient: 'from-blue-500 to-blue-600',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      badge: null,
      pulse: false
    },
    {
      label: 'Sold Players',
      value: stats.soldPlayers,
      icon: <TrendingUp size={22} />,
      gradient: 'from-green-500 to-green-600',
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
      badge: `${completionRate}%`,
      pulse: stats.soldPlayers > 0
    },
    {
      label: 'Unsold Players',
      value: stats.unsoldPlayers,
      icon: <TrendingDown size={22} />,
      gradient: 'from-orange-500 to-orange-600',
      iconBg: 'bg-orange-100',
      iconColor: 'text-orange-600',
      badge: null,
      pulse: false
    },
    {
      label: 'Online Teams',
      value: `${onlineTeams}/${teams.length}`,
      icon: <Wifi size={22} />,
      gradient: onlineTeams > 0 ? 'from-emerald-500 to-emerald-600' : 'from-gray-400 to-gray-500',
      iconBg: onlineTeams > 0 ? 'bg-emerald-100' : 'bg-gray-100',
      iconColor: onlineTeams > 0 ? 'text-emerald-600' : 'text-gray-500',
      badge: onlineTeams > 0 ? 'Live' : 'Offline',
      pulse: onlineTeams > 0
    }
  ];

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 lg:p-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {statsData.map((stat, index) => (
          <div
            key={index}
            className="group relative bg-white rounded-2xl p-5 lg:p-6 flex items-start gap-4 border-2 border-gray-200 hover:border-blue-500 hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 overflow-hidden"
          >
            {/* Background Gradient Overlay on Hover */}
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
            
            {/* Icon Container */}
            <div className={`relative w-14 h-14 rounded-2xl ${stat.iconBg} ${stat.iconColor} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-md`}>
              {stat.icon}
              {stat.pulse && (
                <div className={`absolute inset-0 rounded-2xl ${stat.iconBg} animate-ping opacity-75`}></div>
              )}
            </div>
            
            {/* Stats Content */}
            <div className="flex-1 min-w-0 relative z-10">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="text-3xl lg:text-4xl font-extrabold text-gray-900 leading-none">
                  {stat.value}
                </div>
                {stat.badge && (
                  <span className={`px-2 py-1 rounded-lg text-xs font-bold ${
                    stat.pulse 
                      ? `bg-gradient-to-r ${stat.gradient} text-white` 
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {stat.badge}
                  </span>
                )}
              </div>
              <div className="text-sm font-semibold text-gray-600 truncate">
                {stat.label}
              </div>
            </div>

            {/* Decorative Corner */}
            <div className={`absolute -bottom-6 -right-6 w-20 h-20 bg-gradient-to-br ${stat.gradient} rounded-full opacity-10 group-hover:opacity-20 transition-opacity duration-300`}></div>
          </div>
        ))}
      </div>

      {/* Additional Stats Row */}
      {stats.totalPlayers > 0 && (
        <div className="mt-6 pt-6 border-t-2 border-gray-200">
          <div className="flex items-center justify-center gap-2 text-gray-600">
            <Activity size={18} className="text-blue-600" />
            <span className="text-sm font-medium">
              Auction Progress: 
              <span className="ml-2 font-bold text-blue-600">{completionRate}% Complete</span>
              <span className="mx-2">•</span>
              <span className="font-bold text-green-600">{stats.soldPlayers} Sold</span>
              <span className="mx-2">•</span>
              <span className="font-bold text-orange-600">{stats.unsoldPlayers} Remaining</span>
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default StatsBar;
