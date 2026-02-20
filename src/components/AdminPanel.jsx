import React, { useState , useEffect} from "react";
import { LogOut, Trash2 } from "lucide-react";
import io from 'socket.io-client';
import StatsBar from "./StatsBar";
import TeamPurseBar from "./TeamPurseBar";
import AuctionControl from "./AuctionControl";
import axios from "axios";
import PlayersPanel from "./PlayersPanel";
import TeamsPanel from "./TeamsPanel";
import SettingsPanel from "./SettingsPanel";
import RegistrationPanel from "./RegistrationPanel";
import LoadingAnimation from "./LoadingAnimation";

// const SOCKET_URL = "http://localhost:5000/";
// const API_URL = "http://localhost:5000/api";
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";
const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || "http://localhost:5000/";

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState("auction");
  const [socket, setSocket] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [stats, setStats] = useState({
    totalPlayers: 0,
    soldPlayers: 0,
    unsoldPlayers: 0,
  });
  const [teams, setTeams] = useState([]);
  const [players, setPlayers] = useState([]);
  const [auctionState, setAuctionState] = useState(null);
  const [autoAuctionStatus, setAutoAuctionStatus] = useState({
    isActive: false,
    queueLength: 0,
    unsoldCount: 0,
    totalRemaining: 0,
  });
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isTeamSummaryShowing, setIsTeamSummaryShowing] = useState(false);

  
  useEffect(() => {
    const newSocket = io(SOCKET_URL, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 10
    });
    setSocket(newSocket);

    // Check for saved admin session
    const savedAdminAuth = localStorage.getItem('admin_authenticated');
    const savedPassword = localStorage.getItem('admin_password');
    
    if (savedAdminAuth === 'true' && savedPassword) {
      // Auto-login with saved credentials
      newSocket.emit('admin:login', { password: savedPassword });
    }

    // Handle connection events
    newSocket.on('connect', () => {
      console.log('Admin panel connected');
      if (savedAdminAuth === 'true' && savedPassword) {
        newSocket.emit('admin:login', { password: savedPassword });
      }
    });

    newSocket.on('disconnect', () => {
      console.log('Admin panel disconnected');
    });

    newSocket.on('reconnect', () => {
      console.log('Admin panel reconnected');
      if (savedAdminAuth === 'true' && savedPassword) {
        newSocket.emit('admin:login', { password: savedPassword });
      }
      loadData(); // Reload data on reconnection
    });

    newSocket.on('auth:success', () => {
      setIsAuthenticated(true);
      loadData();
    });

    newSocket.on('auth:error', (data) => {
      alert(data.message);
      // Clear invalid session
      localStorage.removeItem('admin_authenticated');
      localStorage.removeItem('admin_password');
    });

    newSocket.on('auction:state', (data) => {
      setAuctionState(data.state);
    });

    newSocket.on('teams:status', (data) => {
      setTeams(data.teams);
    });

    // Listen for player sold to update player list and stats
    newSocket.on('player:sold', (data) => {
      // Reload data to get updated player statuses and team info
      loadData();
    });

    // Listen for auction started to update player status
    newSocket.on('auction:started', (data) => {
      // Update the specific player's status
      setPlayers(prev => prev.map(p => 
        p._id === data.player._id ? { ...p, status: 'IN_AUCTION' } : p
      ));
    });

    // Listen for bid updates (optional - for real-time bid display)
    newSocket.on('bid:new', (data) => {
      setAuctionState(prev => prev ? {
        ...prev,
        currentHighBid: {
          amount: data.amount,
          team: { teamName: data.teamName }
        }
      } : prev);
    });

    // Auto auction events
    newSocket.on('autoAuction:started', (data) => {
      setAutoAuctionStatus(prev => ({
        ...prev,
        isActive: true,
        queueLength: data.queueLength,
        totalRemaining: data.totalPlayers
      }));
    });

    newSocket.on('autoAuction:queueUpdate', (data) => {
      setAutoAuctionStatus(prev => ({
        ...prev,
        queueLength: data.queueLength,
        unsoldCount: data.unsoldCount,
        totalRemaining: data.totalRemaining
      }));
    });

    newSocket.on('autoAuction:playerUnsold', (data) => {
      setAutoAuctionStatus(prev => ({
        ...prev,
        unsoldCount: data.unsoldCount
      }));
    });

    newSocket.on('autoAuction:unsoldRound', (data) => {
      alert(data.message + ' (' + data.count + ' players)');
    });

    newSocket.on('autoAuction:completed', (data) => {
      alert(data.message);
      setAutoAuctionStatus({
        isActive: false,
        queueLength: 0,
        unsoldCount: 0,
        totalRemaining: 0
      });
      loadData();
    });

    newSocket.on('autoAuction:stopped', (data) => {
      setAutoAuctionStatus({
        isActive: false,
        queueLength: data.remainingInQueue,
        unsoldCount: data.unsoldCount,
        totalRemaining: data.remainingInQueue + data.unsoldCount
      });
    });

    // Team summary status
    newSocket.on('teamSummary:showing', (data) => {
      setIsTeamSummaryShowing(data.isShowing);
    });

    newSocket.on('autoAuction:status', (data) => {
      setAutoAuctionStatus(data);
    });

    // Set up periodic data refresh every 10 seconds
    const refreshInterval = setInterval(() => {
      if (isAuthenticated) {
        loadData();
      }
    }, 10000);

    return () => {
      clearInterval(refreshInterval);
      newSocket.close();
    };
  }, [isAuthenticated]);

  const loadData = async () => {
    try {
      const [playersRes, teamsRes, statsRes] = await Promise.all([
        axios.get(`${API_URL}/players`),
        axios.get(`${API_URL}/teams`),
        axios.get(`${API_URL}/auction/stats`),
      ]);

      setPlayers(playersRes.data.players || []);
      setTeams(teamsRes.data.teams || []);
      setStats(statsRes.data.stats || {});
    } catch (error) {
      console.error("Load error:", error);
    }
  };
 
  const handleLogout = () => {
    localStorage.removeItem("admin_authenticated");
    localStorage.removeItem("admin_password");
    window.location.reload();
  };

  const handleClearAllData = async () => {
    const confirmMessage =
      "Are you sure you want to clear ALL data?\n\nThis will delete:\n- All players\n- All teams\n- All bids\n- Auction state\n\nThis action CANNOT be undone!";

    if (!window.confirm(confirmMessage)) {
      return;
    }

    // Double confirmation for safety
    const secondConfirm = window.confirm(
      "FINAL WARNING: This will permanently delete everything. Continue?",
    );
    if (!secondConfirm) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(`${API_URL}/admin/clear-all-data`);
      if (response.data.success) {
        alert("All data cleared successfully!");
        // Reload data
        loadData();
      }
    } catch (error) {
      console.error("Clear data error:", error);
      alert(
        "Failed to clear data: " +
          (error.response?.data?.message || error.message),
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Player management functions
  const handleFileUpload = async (file) => {
    if (!file) return;

    const formData = new FormData();
    formData.append('csvFile', file);

    setIsUploading(true);
    try {
      const response = await axios.post(`${API_URL}/players/bulk-upload`, formData);
      alert(response.data.message);
      loadData();
    } catch (error) {
      alert('Upload error: ' + (error.response?.data?.message || error.message));
    } finally {
      setIsUploading(false);
    }
  };

  const deletePlayer = async (playerId) => {
    if (window.confirm('Are you sure you want to delete this player?')) {
      try {
        await axios.delete(`${API_URL}/players/${playerId}`);
        alert('Player deleted successfully!');
        loadData();
      } catch (error) {
        alert('Error deleting player: ' + (error.response?.data?.message || error.message));
      }
    }
  };

  const undoSale = (playerId) => {
    if (window.confirm('Are you sure you want to undo this sale?')) {
      if (socket) {
        socket.emit('admin:undoSale', { playerId });
        // Reload data after a brief delay to allow server to process
        setTimeout(() => loadData(), 500);
      }
    }
  };

  const updatePlayer = async (updatedPlayer) => {
    try {
      await axios.put(`${API_URL}/players/${updatedPlayer._id}`, {
        name: updatedPlayer.name,
        category: updatedPlayer.category,
        basePrice: updatedPlayer.basePrice
      });
      alert('Player updated successfully!');
      loadData();
    } catch (error) {
      alert('Error updating player: ' + (error.response?.data?.message || error.message));
    }
  };

  // Team management functions
  const deleteTeam = async (teamId) => {
    if (window.confirm('Are you sure you want to delete this team?')) {
      try {
        await axios.delete(`${API_URL}/teams/${teamId}`);
        alert('Team deleted successfully!');
        loadData();
      } catch (error) {
        alert('Error deleting team: ' + (error.response?.data?.message || error.message));
      }
    }
  };

  const updateTeam = async (updatedTeam) => {
    try {
      const updateData = {
        teamName: updatedTeam.teamName,
        captainName: updatedTeam.captainName,
        teamId: updatedTeam.teamId
      };
      if (updatedTeam.pin) {
        updateData.pin = updatedTeam.pin;
      }
      await axios.put(`${API_URL}/teams/${updatedTeam._id}`, updateData);
      alert('Team updated successfully!');
      loadData();
    } catch (error) {
      alert('Error updating team: ' + (error.response?.data?.message || error.message));
    }
  };

  const tabs = [
    { id: "auction", label: "Auction Control", icon: "🎯" },
    { id: "registration", label: "Registration", icon: "📝" },
    { id: "players", label: "Players", icon: "👥" },
    { id: "teams", label: "Teams", icon: "🏏" },
    { id: "settings", label: "Settings", icon: "⚙️" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 p-4 lg:p-6">
      {/* Global Loading Animations */}
      {isUploading && <LoadingAnimation message="Uploading Players..." />}
      {isLoading && <LoadingAnimation message="Processing..." />}
      
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
                  <p className="text-sm lg:text-base text-gray-600 font-medium">
                    Admin Control Center
                  </p>
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
          <TeamPurseBar teams={teams} />
        </header>

        {/* Navigation Tabs */}
        <nav className="bg-white rounded-2xl shadow-lg mb-6 p-3">
          {/* Uses grid-cols-2 for mobile and flex for desktop */}
          <div className="grid grid-cols-2 md:flex gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold transition-all duration-200 ${
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg md:scale-100"
                    : "text-gray-600 hover:bg-gray-100"
                } ${
                  // Makes the button take full width in its grid cell
                  "w-full"
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
          {activeTab === "auction" && (
            <AuctionControl
              players={players}
              auctionState={auctionState}
              autoAuctionStatus={autoAuctionStatus}
              socket={socket}
              socketUrl={SOCKET_URL}
              isTeamSummaryShowing={isTeamSummaryShowing}
            />
          )}

          {activeTab === "registration" && (
            <RegistrationPanel 
              loadData={loadData}
            />
          )}

          {activeTab === "players" && (
            <PlayersPanel 
              players={players} 
              setPlayers={setPlayers}
              loadData={loadData}
              handleFileUpload={handleFileUpload}
              deletePlayer={deletePlayer}
              undoSale={undoSale}
              updatePlayer={updatePlayer}
            />
          )}

          {activeTab === "teams" && (
            <TeamsPanel 
              teams={teams} 
              setTeams={setTeams}
              loadData={loadData}
              deleteTeam={deleteTeam}
              updateTeam={updateTeam}
            />
          )}

          {activeTab === "settings" && (
            <SettingsPanel 
              loadData={loadData}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminPanel;
