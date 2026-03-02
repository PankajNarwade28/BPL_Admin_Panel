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
  
  // Default player image from Cloudinary
  const PLACEHOLDER_IMAGE = 'https://res.cloudinary.com/dz8q0fb8m/image/upload/v1772197979/defaultPlayer_kad3xb.png'; 
  
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

  const resetAuction = () => {
    if (window.confirm('Reset current auction?\n\nThis will stop the auction and return the player to UNSOLD status.\nAll bids for this player will be cleared.')) {
      if (socket) {
        socket.emit('admin:resetAuction');
      }
    }
  };

 const startAuction = (playerId) => {
    if (socket) {
      socket.emit('admin:startAuction', { playerId });
    }
  };

  const startAutoAuction = () => {
    if (window.confirm('Start automatic auction for all available players?\n\nPlayers will be auctioned in random order.\nUnsold players will be added back to the queue.')) {
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

  // Filter for unsold AND available players only
  const unsoldPlayers = players.filter(p => 
    p.status === 'UNSOLD' && (p.availability === 'AVAILABLE' || !p.availability)
  );

  // Helper function to get player image URL
  const getPlayerImageUrl = (player) => {
    if (!player?.photo || player.photo.trim() === '' || player.photo.includes('placeholder')) {
      return PLACEHOLDER_IMAGE;
    }
    if (player.photo.startsWith('http')) {
      return player.photo;
    }
    const baseUrl = socketUrl.endsWith('/') ? socketUrl : socketUrl + '/';
    const cleanPath = player.photo.replace(/^\/+/, '');
    return `${baseUrl}${cleanPath}`;
  };

  // Helper function to get category badge color
  const getCategoryColor = (category) => {
    const colors = {
      'Batsman': 'bg-red-100 text-red-700 border-red-300',
      'Bowler': 'bg-green-100 text-green-700 border-green-300',
      'All-Rounder': 'bg-amber-100 text-amber-700 border-amber-300',
      'Wicket-Keeper': 'bg-blue-100 text-blue-700 border-blue-300'
    };
    return colors[category] || 'bg-gray-100 text-gray-700 border-gray-300';
  };

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
                  Start automatic auction for all players. Players will be auctioned in random order. Unsold players will be added back to the queue.
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

        {/* Manual Auction Panel / Quick Auction Status */}
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 border-2 border-gray-200">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-gray-300">
            <Play className="text-blue-600" size={24} />
            <h2 className="text-xl font-bold text-gray-900">Manual Auction Control</h2>
          </div>
          
          {auctionState?.isActive ? (
            <div className="space-y-4">
              {/* Auction Status with Player Info */}
              <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-xl p-5 shadow-lg border-2 border-blue-400">
                {/* Status Badge and Timer */}
                <div className="flex items-center justify-between mb-4">
                  <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg font-bold text-xs ${
                    localPaused 
                      ? 'bg-yellow-400 text-yellow-900' 
                      : 'bg-green-400 text-green-900'
                  }`}>
                    {localPaused ? (
                      <>
                        <Pause size={14} />
                        <span>PAUSED</span>
                      </>
                    ) : (
                      <>
                        <div className="w-2 h-2 bg-green-900 rounded-full animate-pulse"></div>
                        <span>LIVE</span>
                      </>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-white">
                    <Clock size={16} />
                    <span className="font-bold">{auctionState.timeRemaining || 0}s</span>
                  </div>
                </div>

                {auctionState.currentPlayer ? (
                  <div className="grid grid-cols-3 gap-4">
                    {/* Player Image */}
                    <div className="col-span-1">
                      <div className="relative w-full aspect-square rounded-xl overflow-hidden border-3 border-white shadow-lg">
                        <img 
                          src={getPlayerImageUrl(auctionState.currentPlayer)}
                          alt={auctionState.currentPlayer.name}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = PLACEHOLDER_IMAGE;
                          }}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>

                    {/* Player Details & Bid Info */}
                    <div className="col-span-2 flex flex-col justify-between">
                      <div>
                        <h3 className="text-xl font-black text-white mb-2">
                          {auctionState.currentPlayer.name}
                        </h3>
                        <div className="flex items-center gap-2 mb-3">
                          <span className={`inline-block px-2 py-1 rounded-md text-xs font-bold ${getCategoryColor(auctionState.currentPlayer.category)}`}>
                            {auctionState.currentPlayer.category}
                          </span>
                          <span className="text-xs text-white/80">Base: ₹{auctionState.currentPlayer.basePrice}L</span>
                        </div>
                      </div>

                      {/* Current Bid */}
                      <div className="bg-white/90 rounded-lg p-3">
                        <div className="text-xs text-gray-600 font-semibold mb-1">Current Bid</div>
                        <div className="text-3xl font-black text-green-600">
                          ₹{auctionState.currentHighBid?.amount || auctionState.currentPlayer.basePrice}L
                        </div>
                        {auctionState.currentHighBid?.team && (
                          <div className="text-xs text-gray-600 mt-1">
                            Leading: <span className="font-bold text-blue-600">{auctionState.currentHighBid.team.teamName}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4 text-white">
                    Loading player data...
                  </div>
                )}
              </div>

              {/* Control Buttons */}
              <div className="grid grid-cols-2 gap-3">
                {localPaused ? (
                  <button
                    onClick={resumeAuction}
                    className="col-span-2 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-bold hover:from-green-600 hover:to-green-700 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
                  >
                    <Play size={18} />
                    Resume Auction
                  </button>
                ) : (
                  <button
                    onClick={pauseAuction}
                    className="col-span-2 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-xl font-bold hover:from-yellow-600 hover:to-yellow-700 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
                  >
                    <Pause size={18} />
                    Pause Auction
                  </button>
                )}
                
                <button
                  onClick={resetAuction}
                  className="col-span-2 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-bold hover:from-red-600 hover:to-red-700 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
                >
                  <Square size={18} />
                  Stop & Reset Auction
                </button>
              </div>
            </div>
          ) : (
            <div className="h-[200px] flex items-center justify-center">
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
