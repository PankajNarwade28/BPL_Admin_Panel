import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import axios from "axios";
import "./App.css";
import AdminPanel from "./components/AdminPanel";

const SOCKET_URL = "http://localhost:5000/";
const API_URL = "http://localhost:5000/api";

// Default placeholder image (SVG data URL)
const PLACEHOLDER_IMAGE = `${SOCKET_URL}/uploads/wwplaceholder.jpg`;

function App() {
  const [socket, setSocket] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");

  // Auction state
  const [players, setPlayers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [auctionState, setAuctionState] = useState(null);

  // Auto auction state
  const [autoAuctionStatus, setAutoAuctionStatus] = useState({
    isActive: false,
    queueLength: 0,
    unsoldCount: 0,
    totalRemaining: 0,
  });

  // Stats
  const [stats, setStats] = useState({
    totalPlayers: 0,
    soldPlayers: 0,
    unsoldPlayers: 0,
  });

  // Create captain form
  const [captainForm, setCaptainForm] = useState({
    teamName: "",
    captainName: "",
    teamId: "",
    pin: "",
  });

  // Edit modals
  const [editingPlayer, setEditingPlayer] = useState(null);
  const [editingTeam, setEditingTeam] = useState(null);
  const [playerForm, setPlayerForm] = useState({});
  const [teamForm, setTeamForm] = useState({});

  useEffect(() => {
    const newSocket = io(SOCKET_URL, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 10,
    });
    setSocket(newSocket);

    // Check for saved admin session
    const savedAdminAuth = localStorage.getItem("admin_authenticated");
    const savedPassword = localStorage.getItem("admin_password");

    if (savedAdminAuth === "true" && savedPassword) {
      setPassword(savedPassword);
      // Auto-login with saved credentials
      newSocket.emit("admin:login", { password: savedPassword });
    }

    // Handle connection events
    newSocket.on("connect", () => {
      console.log("Admin panel connected");
      if (savedAdminAuth === "true" && savedPassword) {
        newSocket.emit("admin:login", { password: savedPassword });
      }
    });

    newSocket.on("disconnect", () => {
      console.log("Admin panel disconnected");
    });

    newSocket.on("reconnect", () => {
      console.log("Admin panel reconnected");
      if (savedAdminAuth === "true" && savedPassword) {
        newSocket.emit("admin:login", { password: savedPassword });
      }
      loadData(); // Reload data on reconnection
    });

    newSocket.on("auth:success", () => {
      setIsAuthenticated(true);
      loadData();
    });

    newSocket.on("auth:error", (data) => {
      alert(data.message);
      // Clear invalid session
      localStorage.removeItem("admin_authenticated");
      localStorage.removeItem("admin_password");
    });

    newSocket.on("auction:state", (data) => {
      setAuctionState(data.state);
    });

    newSocket.on("teams:status", (data) => {
      setTeams(data.teams);
    });

    // Listen for player sold to update player list and stats
    newSocket.on("player:sold", (data) => {
      // Reload data to get updated player statuses and team info
      loadData();
    });

    // Listen for auction started to update player status
    newSocket.on("auction:started", (data) => {
      // Update the specific player's status
      setPlayers((prev) =>
        prev.map((p) =>
          p._id === data.player._id ? { ...p, status: "IN_AUCTION" } : p,
        ),
      );
    });

    // Listen for bid updates (optional - for real-time bid display)
    newSocket.on("bid:new", (data) => {
      setAuctionState((prev) =>
        prev
          ? {
              ...prev,
              currentHighBid: {
                amount: data.amount,
                team: { teamName: data.teamName },
              },
            }
          : prev,
      );
    });

    // Auto auction events
    newSocket.on("autoAuction:started", (data) => {
      setAutoAuctionStatus((prev) => ({
        ...prev,
        isActive: true,
        queueLength: data.queueLength,
        totalRemaining: data.totalPlayers,
      }));
    });

    newSocket.on("autoAuction:queueUpdate", (data) => {
      setAutoAuctionStatus((prev) => ({
        ...prev,
        queueLength: data.queueLength,
        unsoldCount: data.unsoldCount,
        totalRemaining: data.totalRemaining,
      }));
    });

    newSocket.on("autoAuction:playerUnsold", (data) => {
      setAutoAuctionStatus((prev) => ({
        ...prev,
        unsoldCount: data.unsoldCount,
      }));
    });

    newSocket.on("autoAuction:unsoldRound", (data) => {
      alert(data.message + " (" + data.count + " players)");
    });

    newSocket.on("autoAuction:completed", (data) => {
      alert(data.message);
      setAutoAuctionStatus({
        isActive: false,
        queueLength: 0,
        unsoldCount: 0,
        totalRemaining: 0,
      });
      loadData();
    });

    newSocket.on("autoAuction:stopped", (data) => {
      setAutoAuctionStatus({
        isActive: false,
        queueLength: data.remainingInQueue,
        unsoldCount: data.unsoldCount,
        totalRemaining: data.remainingInQueue + data.unsoldCount,
      });
    });

    newSocket.on("autoAuction:status", (data) => {
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

  const handleLogin = (e) => {
    e.preventDefault();
    if (socket) {
      socket.emit("admin:login", { password });
      // Save credentials on successful manual login
      socket.once("auth:success", () => {
        localStorage.setItem("admin_authenticated", "true");
        localStorage.setItem("admin_password", password);
      });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_authenticated");
    localStorage.removeItem("admin_password");
    window.location.reload();
  };

  // const handleClearAllData = async () => {
  //   const confirmMessage = 'Are you sure you want to clear ALL data?\n\nThis will delete:\n- All players\n- All teams\n- All bids\n- Auction state\n\nThis action CANNOT be undone!';

  //   if (!window.confirm(confirmMessage)) {
  //     return;
  //   }

  //   // Double confirmation for safety
  //   const secondConfirm = window.confirm('FINAL WARNING: This will permanently delete everything. Continue?');
  //   if (!secondConfirm) {
  //     return;
  //   }

  //   try {
  //     const response = await axios.post(`${API_URL}/admin/clear-all-data`);
  //     if (response.data.success) {
  //       alert('All data cleared successfully!');
  //       // Reload data
  //       loadData();
  //     }
  //   } catch (error) {
  //     console.error('Clear data error:', error);
  //     alert('Failed to clear data: ' + (error.response?.data?.message || error.message));
  //   }
  // };

  // const startAuction = (playerId) => {
  //   if (socket) {
  //     socket.emit('admin:startAuction', { playerId });
  //   }
  // };

  // const pauseAuction = () => {
  //   if (socket) socket.emit('admin:pauseAuction');
  // };

  // const resumeAuction = () => {
  //   if (socket) socket.emit('admin:resumeAuction');
  // };

  // const undoSale = (playerId) => {
  //   if (window.confirm('Are you sure you want to undo this sale?')) {
  //     if (socket) socket.emit('admin:undoSale', { playerId });
  //   }
  // };

  // const startAutoAuction = () => {
  //   if (window.confirm('Start automatic auction for all available players?\n\nPlayers will be auctioned from highest to lowest base price.\nUnsold players will be added back to the queue.')) {
  //     if (socket) {
  //       socket.emit('admin:startAutoAuction');
  //     }
  //   }
  // };

  // const stopAutoAuction = () => {
  //   if (window.confirm('Stop automatic auction?')) {
  //     if (socket) {
  //       socket.emit('admin:stopAutoAuction');
  //     }
  //   }
  // };

  

  // const openEditPlayer = (player) => {
  //   setEditingPlayer(player);
  //   setPlayerForm({
  //     name: player.name,
  //     category: player.category,
  //     basePrice: player.basePrice
  //   });
  // };

  // const updatePlayer = async (e) => {
  //   e.preventDefault();
  //   try {
  //     await axios.put(`${API_URL}/players/${editingPlayer._id}`, playerForm);
  //     alert('Player updated successfully!');
  //     setEditingPlayer(null);
  //     loadData();
  //   } catch (error) {
  //     alert('Error updating player: ' + (error.response?.data?.message || error.message));
  //   }
  // };

  // const deletePlayer = async (playerId) => {
  //   if (window.confirm('Are you sure you want to delete this player?')) {
  //     try {
  //       await axios.delete(`${API_URL}/players/${playerId}`);
  //       alert('Player deleted successfully!');
  //       loadData();
  //     } catch (error) {
  //       alert('Error deleting player: ' + (error.response?.data?.message || error.message));
  //     }
  //   }
  // };

  // const openEditTeam = (team) => {
  //   setEditingTeam(team);
  //   setTeamForm({
  //     teamName: team.teamName,
  //     captainName: team.captainName,
  //     teamId: team.teamId,
  //     pin: ''
  //   });
  // };

  // const updateTeam = async (e) => {
  //   e.preventDefault();
  //   try {
  //     await axios.put(`${API_URL}/teams/${editingTeam._id}`, teamForm);
  //     alert('Team updated successfully!');
  //     setEditingTeam(null);
  //     loadData();
  //   } catch (error) {
  //     alert('Error updating team: ' + (error.response?.data?.message || error.message));
  //   }
  // };

  // const deleteTeam = async (teamId) => {
  //   if (window.confirm('Are you sure you want to delete this team?')) {
  //     try {
  //       await axios.delete(`${API_URL}/teams/${teamId}`);
  //       alert('Team deleted successfully!');
  //       loadData();
  //     } catch (error) {
  //       alert('Error deleting team: ' + (error.response?.data?.message || error.message));
  //     }
  //   }
  // };

  // const handleFileUpload = async (e) => {
  //   const file = e.target.files[0];
  //   if (!file) return;

  //   const formData = new FormData();
  //   formData.append('csvFile', file);

  //   try {
  //     const response = await axios.post(`${API_URL}/players/bulk-upload`, formData);
  //     alert(response.data.message);
  //     loadData();
  //   } catch (error) {
  //     alert('Upload error: ' + error.message);
  //   }
  // };

  if (!isAuthenticated) {
    return (
      <div className="app">
        <div className="admin-login">
          <div className="login-card">
            <h1>🔐 Admin Panel</h1>
            <form onSubmit={handleLogin}>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Admin Password"
                required
              />
              <button type="submit">Login</button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <AdminPanel />
    </>
  );
}

export default App;
