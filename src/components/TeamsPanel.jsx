import React, { useState } from 'react';
import { Download, Edit2, Trash2, Users, Award, DollarSign, TrendingUp, CheckCircle, AlertCircle } from 'lucide-react';
import EditTeamModal from './EditTeamModal';

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || "http://localhost:5000/";
// Ensure URL ends with slash
const BASE_URL = SOCKET_URL.endsWith('/') ? SOCKET_URL : SOCKET_URL + '/';
const DEFAULT_TEAM_LOGO = 'https://res.cloudinary.com/dz8q0fb8m/image/upload/v1772197980/defaultTeam_x7thxe.png';

const TeamsPanel = ({ teams, setTeams, loadData, deleteTeam, updateTeam }) => {
  const [editingTeam, setEditingTeam] = useState(null);
  
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api"; 

  const handleUpdateTeam = async (updatedTeam) => {
    await updateTeam(updatedTeam);
    setEditingTeam(null);
  };

  const openEditTeam = (team) => {
    setEditingTeam(team);
  };

  // Helper function to get team logo URL
  const getTeamLogoUrl = (team) => {
    if (!team.logo || team.logo.trim() === '') {
      return DEFAULT_TEAM_LOGO;
    }
    
    // If it's already a full URL (Cloudinary or other), use it as-is
    if (team.logo.startsWith('http')) {
      return team.logo;
    }
    
    // Otherwise, construct URL from BASE_URL (legacy local uploads)
    const cleanPath = team.logo.replace(/^\//, '');
    return `${BASE_URL}${cleanPath}`;
  };

  const getProgressColor = (filled, total) => {
    const percentage = (filled / total) * 100;
    if (percentage === 100) return 'from-green-500 to-emerald-600';
    if (percentage >= 75) return 'from-blue-500 to-blue-600';
    if (percentage >= 50) return 'from-yellow-500 to-orange-600';
    if (percentage >= 25) return 'from-orange-500 to-red-500';
    return 'from-gray-400 to-gray-500';
  };

  const getTeamStatus = (team) => {
    if (team.rosterSlotsFilled === 11) {
      return { label: 'Complete', color: 'green', icon: <CheckCircle size={16} /> };
    }
    if (team.rosterSlotsFilled >= 7) {
      return { label: 'Almost Full', color: 'blue', icon: <TrendingUp size={16} /> };
    }
    if (team.rosterSlotsFilled >= 1) {
      return { label: 'In Progress', color: 'yellow', icon: <AlertCircle size={16} /> };
    }
    return { label: 'Empty', color: 'gray', icon: <Users size={16} /> };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold text-gray-900">Teams Management</h2>
          <span className="px-3 py-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold text-sm shadow-md">
            {teams.length} teams
          </span>
        </div>
        
        <a 
          href={`${API_URL}/teams/download/all-teams`} 
          download 
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
        >
          <Download size={18} />
          Download All Teams PDF
        </a>
      </div>

      {/* Teams Grid */}
      {teams.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {teams.map(team => {
            const status = getTeamStatus(team);
            const maxBid = team.remainingPoints - ((11 - team.rosterSlotsFilled) * 5);
            
            return (
              <div 
                key={team._id} 
                className={`group relative bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 border-2 shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 ${
                  team.isOnline 
                    ? 'border-green-500 bg-gradient-to-b from-white via-green-50 to-green-100' 
                    : 'border-gray-300'
                }`}
              >
                {/* Online Status Indicator */}
                <div className="absolute top-4 right-4 flex items-center gap-2">
                  {team.isOnline ? (
                    <div className="flex items-center gap-1.5 px-2 py-1 bg-green-500 text-white rounded-full text-xs font-bold shadow-md">
                      <div className="relative">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                        <div className="absolute top-0 left-0 w-2 h-2 bg-white rounded-full animate-ping"></div>
                      </div>
                      Online
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 px-2 py-1 bg-gray-400 text-white rounded-full text-xs font-bold shadow-md">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                      Offline
                    </div>
                  )}
                </div>

                {/* Team Header */}
                <div className="flex items-center gap-4 mb-6 pb-4 border-b-2 border-gray-200">
                <div className="w-16 h-16 rounded-2xl overflow-hidden flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <img 
                      src={getTeamLogoUrl(team)}
                      alt={team.teamName}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = DEFAULT_TEAM_LOGO;
                      }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-gray-900 truncate mb-1">{team.teamName}</h3>
                    <p className="flex items-center gap-1.5 text-sm text-gray-600 truncate">
                      <Award size={14} className="text-yellow-600" />
                      {team.captainName}
                    </p>
                    <p className="text-xs text-gray-500 font-mono mt-1">ID: {team.teamId}</p>
                  </div>
                </div>

                {/* Status Badge */}
                <div className={`mb-4 flex items-center gap-2 px-3 py-2 rounded-xl bg-${status.color}-100 border border-${status.color}-300`}>
                  <div className={`text-${status.color}-600`}>{status.icon}</div>
                  <span className={`text-sm font-bold text-${status.color}-700`}>{status.label}</span>
                  <span className={`ml-auto text-xs font-semibold text-${status.color}-600`}>
                    {team.rosterSlotsFilled}/11
                  </span>
                </div>

                {/* Team Stats Grid */}
                <div className="grid grid-cols-2 gap-3 mb-5">
                  <div className="bg-white rounded-xl p-3 border border-gray-200 shadow-sm">
                    <div className="flex items-center gap-1 mb-1">
                      <DollarSign size={14} className="text-green-600" />
                      <span className="text-xs text-gray-600 font-medium">Budget Left</span>
                    </div>
                    <div className="text-xl font-bold text-green-600">₹{team.remainingPoints}L</div>
                  </div>
                  
                  <div className="bg-white rounded-xl p-3 border border-gray-200 shadow-sm">
                    <div className="flex items-center gap-1 mb-1">
                      <TrendingUp size={14} className="text-blue-600" />
                      <span className="text-xs text-gray-600 font-medium">Max Bid</span>
                    </div>
                    <div className="text-xl font-bold text-blue-600">₹{maxBid > 0 ? maxBid : 0}L</div>
                  </div>
                  
                  <div className="col-span-2 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-3 border border-purple-200">
                    <div className="flex items-center gap-1 mb-1">
                      <Users size={14} className="text-purple-600" />
                      <span className="text-xs text-gray-700 font-medium">Squad Progress</span>
                    </div>
                    <div className="text-2xl font-bold text-purple-700">{team.rosterSlotsFilled} / 11</div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-5">
                  <div className="h-3 bg-gray-200 rounded-full overflow-hidden shadow-inner">
                    <div 
                      className={`h-full bg-gradient-to-r ${getProgressColor(team.rosterSlotsFilled, 11)} transition-all duration-500 shadow-lg`}
                      style={{ width: `${(team.rosterSlotsFilled / 11) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-600 mt-1.5 block">
                    {((team.rosterSlotsFilled / 11) * 100).toFixed(0)}% Complete
                  </span>
                </div>

                {/* Team Actions */}
                <div className="flex gap-2">
                  <a 
                    href={`${API_URL}/teams/${team._id}/download`} 
                    download 
                    className="flex-1 flex items-center justify-center gap-2 p-2.5 bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 rounded-xl hover:from-green-200 hover:to-emerald-200 transition-colors duration-200 font-semibold text-sm border border-green-300 shadow-sm hover:shadow-md"
                    title="Download team PDF"
                  >
                    <Download size={16} />
                  </a>
                  <button 
                    onClick={() => openEditTeam(team)} 
                    className="flex-1 flex items-center justify-center gap-2 p-2.5 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 rounded-xl hover:from-blue-200 hover:to-purple-200 transition-colors duration-200 font-semibold text-sm border border-blue-300 shadow-sm hover:shadow-md"
                    title="Edit team"
                  >
                    <Edit2 size={16} />
                  </button>
                  {team.rosterSlotsFilled === 0 && (
                    <button 
                      onClick={() => deleteTeam(team._id)} 
                      className="flex-1 flex items-center justify-center gap-2 p-2.5 bg-gradient-to-r from-red-100 to-pink-100 text-red-700 rounded-xl hover:from-red-200 hover:to-pink-200 transition-colors duration-200 font-semibold text-sm border border-red-300 shadow-sm hover:shadow-md"
                      title="Delete team"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>

                {/* Decorative Corner */}
                <div className={`absolute -bottom-8 -right-8 w-24 h-24 bg-gradient-to-br ${getProgressColor(team.rosterSlotsFilled, 11)} rounded-full opacity-10 group-hover:opacity-20 transition-opacity duration-300`}></div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="py-20 text-center bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border-2 border-dashed border-gray-300">
          <Users size={64} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-xl font-bold text-gray-600 mb-2">No Teams Created</h3>
          <p className="text-gray-500 mb-4">Create teams in the Settings tab to get started</p>
          <a 
            href="#settings" 
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200"
          >
            Go to Settings
          </a>
        </div>
      )}

      {editingTeam && (
        <EditTeamModal
          team={editingTeam}
          onClose={() => setEditingTeam(null)}
          onUpdate={handleUpdateTeam}
        />
      )}
    </div>
  );
};

export default TeamsPanel;
