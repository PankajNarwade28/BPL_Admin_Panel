import React from 'react';
import { Users, TrendingUp, TrendingDown, Wifi } from 'lucide-react';

const StatsBar = ({ stats, teams }) => {
  const onlineTeams = teams.filter(t => t.isOnline).length;
  
  const statsData = [
    {
      label: 'Total Players',
      value: stats.totalPlayers,
      icon: <Users size={20} />,
      gradient: 'from-blue-500 to-blue-600',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600'
    },
    {
      label: 'Sold',
      value: stats.soldPlayers,
      icon: <TrendingUp size={20} />,
      gradient: 'from-green-500 to-green-600',
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600'
    },
    {
      label: 'Unsold',
      value: stats.unsoldPlayers,
      icon: <TrendingDown size={20} />,
      gradient: 'from-orange-500 to-orange-600',
      iconBg: 'bg-orange-100',
      iconColor: 'text-orange-600'
    },
    {
      label: 'Online Teams',
      value: `${onlineTeams}/${teams.length}`,
      icon: <Wifi size={20} />,
      gradient: onlineTeams > 0 ? 'from-emerald-500 to-emerald-600' : 'from-red-500 to-red-600',
      iconBg: onlineTeams > 0 ? 'bg-emerald-100' : 'bg-red-100',
      iconColor: onlineTeams > 0 ? 'text-emerald-600' : 'text-red-600'
    }
  ];

  return (
    <div className="bg-gray-50 p-6 lg:p-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsData.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-xl p-4 lg:p-5 flex items-center gap-4 border-l-4 border-transparent hover:border-blue-600 hover:shadow-lg transform hover:-translate-y-1 transition-all duration-200"
          >
            <div className={`w-12 h-12 rounded-xl ${stat.iconBg} ${stat.iconColor} flex items-center justify-center flex-shrink-0`}>
              {stat.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-2xl lg:text-3xl font-bold text-gray-900 mb-1">
                {stat.value}
              </div>
              <div className="text-sm font-medium text-gray-600 truncate">
                {stat.label}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatsBar;
