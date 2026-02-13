import React, { useState } from 'react';
import { Download, Edit2, Trash2, Users, Award } from 'lucide-react';
import EditTeamModal from './EditTeamModal';

const TeamsPanel = ({ teams, setTeams }) => {
  const [editingTeam, setEditingTeam] = useState(null);
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  const deleteTeam = (teamId) => {
    if (window.confirm('Are you sure you want to delete this team?')) {
      console.log('Deleting team:', teamId);
    }
  };

  const openEditTeam = (team) => {
    setEditingTeam(team);
  };

  const getProgressColor = (filled, total) => {
    const percentage = (filled / total) * 100;
    if (percentage === 100) return 'bg-gradient-to-r from-green-500 to-emerald-600';
    if (percentage >= 50) return 'bg-gradient-to-r from-yellow-500 to-orange-600';
    return 'bg-gray-400';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold text-gray-900">Teams Management</h2>
          <span className="px-3 py-1 bg-gray-200 text-gray-700 rounded-lg font-semibold text-sm">
            {teams.length} teams
          </span>
        </div>
        
        <a 
          href={`${API_URL}/teams/download/all-teams`} 
          download 
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
        >
          <Download size={18} />
          Download All Teams
        </a>
      </div>

      {/* Teams Grid */}
      {teams.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {teams.map(team => (
            <div 
              key={team._id} 
              className={`relative bg-white rounded-2xl p-6 border-2 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 ${
                team.isOnline 
                  ? 'border-green-500 bg-gradient-to-b from-white to-green-50' 
                  : 'border-gray-300'
              }`}
            >
              {/* Online Status Indicator */}
              <div className="absolute top-4 right-4">
                {team.isOnline ? (
                  <div className="relative">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <div className="absolute top-0 left-0 w-3 h-3 bg-green-500 rounded-full animate-ping"></div>
                  </div>
                ) : (
                  <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                )}
              </div>

              {/* Team Header */}
              <div className="flex items-center gap-4 mb-6 pb-4 border-b-2 border-gray-200">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                  {team.teamName.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-bold text-gray-900 truncate">{team.teamName}</h3>
                  <p className="flex items-center gap-1 text-sm text-gray-600 truncate">
                    <Award size={14} />
                    {team.captainName}
                  </p>
                </div>
              </div>

              {/* Team Stats */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Team ID:</span>
                  <span className="font-semibold text-gray-900">{team.teamId}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Points Left:</span>
                  <span className="text-lg font-bold text-green-600">₹{team.remainingPoints} L</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Squad:</span>
                  <span className="font-semibold text-gray-900">{team.rosterSlotsFilled}/11</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Max Bid:</span>
                  <span className="font-semibold text-gray-900">₹{team.remainingPoints - ((11 - team.rosterSlotsFilled) * 5)} L</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-6">
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden mb-2">
                  <div 
                    className={`h-full ${getProgressColor(team.rosterSlotsFilled, 11)} transition-all duration-500`}
                    style={{ width: `${(team.rosterSlotsFilled / 11) * 100}%` }}
                  ></div>
                </div>
                <span className="text-xs text-gray-600">
                  {team.rosterSlotsFilled} of 11 players
                </span>
              </div>

              {/* Team Actions */}
              <div className="flex gap-2">
                <a 
                  href={`${API_URL}/teams/${team._id}/download`} 
                  download 
                  className="flex-1 flex items-center justify-center gap-2 p-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                  title="Download team"
                >
                  <Download size={16} />
                </a>
                <button 
                  onClick={() => openEditTeam(team)} 
                  className="flex-1 flex items-center justify-center gap-2 p-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors duration-200"
                  title="Edit team"
                >
                  <Edit2 size={16} />
                </button>
                {team.rosterSlotsFilled === 0 && (
                  <button 
                    onClick={() => deleteTeam(team._id)} 
                    className="flex-1 flex items-center justify-center gap-2 p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors duration-200"
                    title="Delete team"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-16 text-center">
          <Users size={64} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-xl font-bold text-gray-600 mb-2">No Teams Created</h3>
          <p className="text-gray-500">Create teams in the Settings tab to get started</p>
        </div>
      )}

      {editingTeam && (
        <EditTeamModal
          team={editingTeam}
          onClose={() => setEditingTeam(null)}
          onUpdate={(updatedTeam) => {
            console.log('Updating team:', updatedTeam);
            setEditingTeam(null);
          }}
        />
      )}
    </div>
  );
};

export default TeamsPanel;
