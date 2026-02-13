import React, { useState } from 'react';
import { LogOut, Trash2 } from 'lucide-react'; 
import StatsBar from './StatsBar';
import AuctionControl from './AuctionControl';
import PlayersPanel from './PlayersPanel';
import TeamsPanel from './TeamsPanel';
import SettingsPanel from './SettingsPanel';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('auction');
  const [stats, setStats] = useState({
    totalPlayers: 0,
    soldPlayers: 0,
    unsoldPlayers: 0
  });
  const [teams, setTeams] = useState([]);
  const [players, setPlayers] = useState([]);
  const [auctionState, setAuctionState] = useState(null);
  const [autoAuctionStatus, setAutoAuctionStatus] = useState({
    isActive: false,
    queueLength: 0,
    unsoldCount: 0,
    totalRemaining: 0
  });

  const handleClearAllData = () => {
    if (window.confirm('⚠️ Are you sure you want to clear all data? This action cannot be undone!')) {
      console.log('Clearing all data...');
    }
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      console.log('Logging out...');
    }
  };

  const tabs = [
    { id: 'auction', label: 'Auction Control', icon: '🎯' },
    { id: 'players', label: 'Players', icon: '👥' },
    { id: 'teams', label: 'Teams', icon: '🏏' },
    { id: 'settings', label: 'Settings', icon: '⚙️' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 p-4 lg:p-6">
      <div className="max-w-[1600px] mx-auto">
        {/* Header */}
        <header className="bg-white rounded-2xl shadow-xl mb-6 overflow-hidden">
          <div className="border-b border-gray-200">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between p-6 lg:p-8 gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center text-3xl lg:text-4xl shadow-lg">
                  🏏
                </div>
                <div>
                  <h1 className="text-2xl lg:text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    IPL Auction
                  </h1>
                  <p className="text-sm lg:text-base text-gray-600 font-medium">Admin Control Center</p>
                </div>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={handleClearAllData}
                  className="flex items-center gap-2 px-4 py-2 bg-white text-red-600 border-2 border-red-600 rounded-lg font-semibold hover:bg-red-50 transition-all duration-200"
                >
                  <Trash2 size={18} />
                  <span className="hidden sm:inline">Clear Data</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 shadow-md hover:shadow-lg transition-all duration-200"
                >
                  <LogOut size={18} />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            </div>
          </div>

          <StatsBar stats={stats} teams={teams} />
        </header>

        {/* Navigation Tabs */}
        <nav className="bg-white rounded-2xl shadow-lg mb-6 p-3">
  {/* Uses grid-cols-2 for mobile and flex for desktop */}
  <div className="grid grid-cols-2 md:flex gap-2">
    {tabs.map(tab => (
      <button
        key={tab.id}
        onClick={() => setActiveTab(tab.id)}
        className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold transition-all duration-200 ${
          activeTab === tab.id
            ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg md:scale-100'
            : 'text-gray-600 hover:bg-gray-100'
        } ${
          // Makes the button take full width in its grid cell
          'w-full'
        }`}
      >
        <span className="text-xl">{tab.icon}</span>
        <span className="text-sm lg:text-base">{tab.label}</span>
      </button>
    ))}
  </div>
</nav>

        {/* Main Content */}
        <main className="bg-white rounded-2xl shadow-xl p-6 lg:p-8 min-h-[600px]">
          {activeTab === 'auction' && (
            <AuctionControl
              players={players}
              auctionState={auctionState}
              autoAuctionStatus={autoAuctionStatus}
              setAuctionState={setAuctionState}
              setAutoAuctionStatus={setAutoAuctionStatus}
            />
          )}

          {activeTab === 'players' && (
            <PlayersPanel
              players={players}
              setPlayers={setPlayers}
            />
          )}

          {activeTab === 'teams' && (
            <TeamsPanel
              teams={teams}
              setTeams={setTeams}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsPanel />
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminPanel;
