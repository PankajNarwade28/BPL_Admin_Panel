import React from 'react';
import { Play, Pause, Square, Zap, Clock, Package } from 'lucide-react';
import { useState, useEffect } from 'react';
import PlayerCard from './PlayerCard';

const AuctionControl = ({ 
  players, 
  auctionState, 
  autoAuctionStatus, 
  socket, 
  socketUrl,
  isTeamSummaryShowing
}) => { 
  // 1. Create a local state to track the pause status for instant UI feedback
  const [localPaused, setLocalPaused] = useState(auctionState?.isPaused);
  
  // Default player image from uploads folder
  const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || "http://localhost:5000/";
  const PLACEHOLDER_IMAGE = `${SOCKET_URL}uploads/defaultPlayer.png`; 
  // 2. Sync local state whenever the server-provided auctionState changes
  useEffect(() => {
    setLocalPaused(auctionState?.isPaused);
  }, [auctionState?.isPaused]);

  const pauseAuction = () => {
    if (socket) {
      setLocalPaused(true); // Instant UI update
      socket.emit('admin:pauseAuction');
    }
  };

  const resumeAuction = () => {
    if (socket) {
      setLocalPaused(false); // Instant UI update
      socket.emit('admin:resumeAuction');
    }
  };
 const startAuction = (playerId) => {
    if (socket) {
      socket.emit('admin:startAuction', { playerId });
    }
  };

  // const pauseAuction = () => {
  //   if (socket) socket.emit('admin:pauseAuction');
  // };

  // const resumeAuction = () => {
  //   if (socket) socket.emit('admin:resumeAuction');
  // };

  const startAutoAuction = () => {
    if (window.confirm('Start automatic auction for all available players?\n\nPlayers will be auctioned from highest to lowest base price.\nUnsold players will be added back to the queue.')) {
      if (socket) {
        socket.emit('admin:startAutoAuction');
      }
    }
  };

  const stopAutoAuction = () => {
    if (window.confirm('Stop automatic auction?')) {
      if (socket) {
        socket.emit('admin:stopAutoAuction');
      }
    }
  };

  const unsoldPlayers = players.filter(p => p.status === 'UNSOLD');

  return (
    <div className="space-y-8">
      {/* Team Summary Banner */}
      {isTeamSummaryShowing && (
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl p-6 shadow-lg border-2 border-blue-400">
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <div className="w-8 h-8 bg-white/30 rounded-full animate-ping"></div>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-1">📊 Team Summary Displaying</h3>
              <p className="text-blue-100">
                Please wait for the team summary to complete before starting the next auction...
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* Control Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Auto Auction Panel */}
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 border-2 border-gray-200">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-gray-300">
            <Zap className="text-blue-600" size={24} />
            <h2 className="text-xl font-bold text-gray-900">Auto Auction</h2>
          </div>
          
          {autoAuctionStatus.isActive ? (
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg font-semibold">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Auto Auction Running</span>
              </div>
              
              <div className="space-y-3">
                <div className="bg-white rounded-xl p-4 flex items-center gap-4 border-l-4 border-blue-600">
                  <Package size={20} className="text-blue-600" />
                  <div>
                    <div className="text-2xl font-bold text-gray-900">{autoAuctionStatus.queueLength}</div>
                    <div className="text-sm text-gray-600">In Queue</div>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl p-4 flex items-center gap-4 border-l-4 border-blue-600">
                  <Clock size={20} className="text-blue-600" />
                  <div>
                    <div className="text-2xl font-bold text-gray-900">{autoAuctionStatus.unsoldCount}</div>
                    <div className="text-sm text-gray-600">Will Retry</div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-4 border-l-4 border-purple-600">
                  <div className="text-2xl font-bold text-gray-900">{autoAuctionStatus.totalRemaining}</div>
                  <div className="text-sm text-gray-600">Total Remaining</div>
                </div>
              </div>

              <button
                onClick={stopAutoAuction}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
              >
                <Square size={18} />
                Stop Auto Auction
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-white rounded-xl p-4 border-l-4 border-blue-500">
                <p className="text-gray-700 text-sm leading-relaxed">
                  Start automatic auction for all players. Players will be auctioned from highest to lowest base price. Unsold players will be added back to the queue.
                </p>
              </div>
              <button
                onClick={startAutoAuction}
                disabled={isTeamSummaryShowing}
                className={`w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl font-bold text-lg hover:from-green-700 hover:to-green-800 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 ${isTeamSummaryShowing ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <Zap size={20} />
                Start Auto Auction
              </button>
            </div>
          )}
        </div>

        {/* Manual Auction Panel */}
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 border-2 border-gray-200">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-gray-300">
            <Play className="text-blue-600" size={24} />
            <h2 className="text-xl font-bold text-gray-900">Manual Auction</h2>
          </div>
          
          {auctionState?.isActive ? (
          <div className="space-y-4">
            {/* 3. Use localPaused for the Badge and Logic */}
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-semibold ${
              localPaused 
                ? 'bg-yellow-100 text-yellow-700' 
                : 'bg-green-100 text-green-700'
            }`}>
              {localPaused ? (
                <>
                  <Pause size={16} />
                  <span>Paused</span>
                </>
              ) : (
                <>
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span>Active</span>
                </>
              )}
            </div>

              <div className="bg-white rounded-xl p-5 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600">Current Player:</span>
                  <span className="text-base font-semibold text-gray-900">
                    {auctionState.currentPlayer?.name || 'None'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600">Current Bid:</span>
                  <span className="text-xl font-bold text-green-600">
                    ₹{auctionState.currentHighBid?.amount || 0} L
                  </span>
                </div>
              </div>

            {/* 4. Use localPaused for the Button Toggle */}
            {localPaused ? (
              <button
                onClick={resumeAuction}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl font-semibold"
              >
                <Play size={18} />
                Resume Auction
              </button>
            ) : (
              <button
                onClick={pauseAuction}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-yellow-600 text-white rounded-xl font-semibold"
              >
                <Pause size={18} />
                Pause Auction
              </button>
            )}
          </div>
          ) : (
            <div className="h-[300px] flex items-center justify-center">
              <div className="text-center">
                <Play size={48} className="mx-auto text-gray-300 mb-4" />
                <p className="text-base font-semibold text-gray-600 mb-1">No active auction</p>
                <span className="text-sm text-gray-500">Select a player below to start</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Player Selection */}
      <div className="mt-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 pb-4 border-b-2 border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Start Manual Auction</h2>
          <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold shadow-lg">
            {unsoldPlayers.length} Players Available
          </div>
        </div>
        
        {unsoldPlayers.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-5">
            {unsoldPlayers.map(player => (
              <PlayerCard
                key={player._id}
                player={player}
                onStart={() => startAuction(player._id)}
                disabled={autoAuctionStatus.isActive || isTeamSummaryShowing}
                socketUrl={socketUrl}
                placeholderImage={PLACEHOLDER_IMAGE}
              />
            ))}
          </div>
        ) : (
          <div className="py-16 text-center">
            <Package size={64} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-bold text-gray-600 mb-2">No Players Available</h3>
            <p className="text-gray-500">All players have been auctioned or there are no players in the system.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuctionControl;
