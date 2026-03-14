import React from 'react';
import { Play, Pause, Square, Zap, Clock, Package, ChevronLeft, ChevronRight } from 'lucide-react';
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
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20; // Show 20 players per page
  
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

  const startAutoAuction = (mode) => {
    const label = mode === 'random'
      ? 'Start RANDOM auto auction?\n\nAll available players will be auctioned one by one in a completely random order regardless of their base price.'
      : 'Start SET-WISE auto auction?\n\nPlayers will be auctioned in set order: Set A (₹150L+) → Set B (₹100L+) → Set C (₹50L+) → Set D (₹20L+).';
    if (window.confirm(label)) {
      if (socket) {
        socket.emit('admin:startAutoAuction', { mode });
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

  // Pagination calculations
  const totalPages = Math.ceil(unsoldPlayers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPlayers = unsoldPlayers.slice(startIndex, endIndex);

  // Reset to page 1 when players list changes significantly
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [unsoldPlayers.length, currentPage, totalPages]);

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
              {/* Status + mode badge + current set badge */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="inline-flex items-center gap-2 px-3 py-2 bg-green-100 text-green-700 rounded-lg font-semibold text-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span>Running</span>
                </div>
                {autoAuctionStatus.mode === 'random' ? (
                  <div className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg font-bold text-sm border-2 bg-purple-100 text-purple-800 border-purple-400">
                    🎲 Random Mode
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg font-bold text-sm border-2 bg-blue-100 text-blue-800 border-blue-400">
                    📋 Set-Wise Mode
                  </div>
                )}
                {autoAuctionStatus.currentSet && (
                  <div className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg font-bold text-sm border-2 ${
                    autoAuctionStatus.currentSet === 'A' ? 'bg-amber-100 text-amber-800 border-amber-400' :
                    autoAuctionStatus.currentSet === 'B' ? 'bg-blue-100 text-blue-800 border-blue-400' :
                    autoAuctionStatus.currentSet === 'C' ? 'bg-emerald-100 text-emerald-800 border-emerald-400' :
                    'bg-slate-100 text-slate-800 border-slate-400'
                  }`}>
                    🎯 Set {autoAuctionStatus.currentSet}
                    {autoAuctionStatus.inUnsoldRound && (
                      <span className="text-xs font-normal opacity-70 ml-1">(Retry)</span>
                    )}
                  </div>
                )}
              </div>

              {/* Set intro active banner */}
              {autoAuctionStatus.setIntroActive && autoAuctionStatus.setIntroData && (
                <div className={`rounded-xl p-3 border-2 ${
                  autoAuctionStatus.setIntroData.set === 'A' ? 'bg-amber-50 border-amber-300' :
                  autoAuctionStatus.setIntroData.set === 'B' ? 'bg-blue-50 border-blue-300' :
                  autoAuctionStatus.setIntroData.set === 'C' ? 'bg-emerald-50 border-emerald-300' :
                  'bg-slate-50 border-slate-300'
                }`}>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                    <span className="text-xs font-bold uppercase tracking-wide text-gray-700">Intro Showing (30s)</span>
                  </div>
                  <p className="text-xs text-gray-600">
                    {autoAuctionStatus.setIntroData.label} &middot; Base ₹{autoAuctionStatus.setIntroData.basePrice}L &middot; {autoAuctionStatus.setIntroData.totalPlayers} players
                  </p>
                </div>
              )}

              {/* Set breakdown grid A-D */}
              {autoAuctionStatus.setBreakdown && (
                <div className="grid grid-cols-4 gap-1.5">
                  {['A','B','C','D'].map(set => {
                    const count = autoAuctionStatus.setBreakdown[set] || 0;
                    const isCurrent = autoAuctionStatus.currentSet === set;
                    const palettes = {
                      A: isCurrent ? 'bg-amber-100 border-amber-400 text-amber-900' : count > 0 ? 'bg-white border-gray-200 text-gray-700' : 'bg-gray-50 border-gray-100 text-gray-400',
                      B: isCurrent ? 'bg-blue-100 border-blue-400 text-blue-900'   : count > 0 ? 'bg-white border-gray-200 text-gray-700' : 'bg-gray-50 border-gray-100 text-gray-400',
                      C: isCurrent ? 'bg-emerald-100 border-emerald-400 text-emerald-900' : count > 0 ? 'bg-white border-gray-200 text-gray-700' : 'bg-gray-50 border-gray-100 text-gray-400',
                      D: isCurrent ? 'bg-slate-200 border-slate-400 text-slate-900' : count > 0 ? 'bg-white border-gray-200 text-gray-700' : 'bg-gray-50 border-gray-100 text-gray-400',
                    };
                    const basePrices = { A: 150, B: 100, C: 50, D: 20 };
                    return (
                      <div key={set} className={`rounded-xl border-2 p-2 text-center transition-all ${palettes[set]}`}>
                        <div className="text-lg font-black leading-none">{set}</div>
                        <div className="text-sm font-bold mt-0.5">{count}</div>
                        <div className="text-[10px] opacity-70">₹{basePrices[set]}L</div>
                        {isCurrent && <div className="w-full h-1 mt-1 rounded-full bg-current opacity-50" />}
                      </div>
                    );
                  })}
                </div>
              )}

              <div className="grid grid-cols-2 gap-2">
                <div className="bg-white rounded-xl p-3 flex items-center gap-3 border-l-4 border-blue-600">
                  <Package size={18} className="text-blue-600 flex-shrink-0" />
                  <div>
                    <div className="text-xl font-bold text-gray-900">{autoAuctionStatus.queueLength}</div>
                    <div className="text-xs text-gray-600">In Queue</div>
                  </div>
                </div>
                <div className="bg-white rounded-xl p-3 flex items-center gap-3 border-l-4 border-orange-500">
                  <Clock size={18} className="text-orange-500 flex-shrink-0" />
                  <div>
                    <div className="text-xl font-bold text-gray-900">{autoAuctionStatus.unsoldCount}</div>
                    <div className="text-xs text-gray-600">Will Retry</div>
                  </div>
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
              <p className="text-gray-600 text-sm">Choose how to run the auto auction:</p>

              {/* Set-wise option */}
              <div className="bg-white rounded-xl p-4 border-2 border-blue-200 space-y-3">
                <div className="flex items-center gap-2">
                  <Package size={16} className="text-blue-600" />
                  <span className="font-bold text-gray-800 text-sm">Set-Wise (A → B → C → D)</span>
                </div>
                <p className="text-gray-500 text-xs leading-relaxed">Players auctioned in set order by base price with a 30-second set introduction before each set.</p>
                <div className="grid grid-cols-4 gap-1.5">
                  {[{s:'A',p:150,c:'bg-amber-50 border-amber-300 text-amber-800'},{s:'B',p:100,c:'bg-blue-50 border-blue-300 text-blue-800'},{s:'C',p:50,c:'bg-emerald-50 border-emerald-300 text-emerald-800'},{s:'D',p:20,c:'bg-slate-50 border-slate-300 text-slate-700'}].map(({s,p,c}) => (
                    <div key={s} className={`rounded-lg border-2 p-2 text-center ${c}`}>
                      <div className="font-black text-sm leading-none">Set {s}</div>
                      <div className="text-[10px] font-bold opacity-80 mt-1">₹{p}L+</div>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => startAutoAuction('set')}
                  disabled={isTeamSummaryShowing}
                  className={`w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-bold hover:from-blue-700 hover:to-blue-800 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 ${isTeamSummaryShowing ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <Package size={18} />
                  Start Set-Wise Auction
                </button>
              </div>

              {/* Random option */}
              <div className="bg-white rounded-xl p-4 border-2 border-purple-200 space-y-3">
                <div className="flex items-center gap-2">
                  <Zap size={16} className="text-purple-600" />
                  <span className="font-bold text-gray-800 text-sm">Random (All Players)</span>
                </div>
                <p className="text-gray-500 text-xs leading-relaxed">All 30 available players auctioned one by one in a completely random order, ignoring their base price or set category.</p>
                <button
                  onClick={() => startAutoAuction('random')}
                  disabled={isTeamSummaryShowing}
                  className={`w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl font-bold hover:from-purple-700 hover:to-purple-800 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 ${isTeamSummaryShowing ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <Zap size={18} />
                  Start Random Auction
                </button>
              </div>
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
          <div className="flex items-center gap-3">
            {totalPages > 1 && (
              <span className="px-3 py-2 bg-blue-100 text-blue-700 rounded-lg font-semibold text-sm">
                Page {currentPage} of {totalPages}
              </span>
            )}
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold shadow-lg">
              {unsoldPlayers.length} Players Available
            </div>
          </div>
        </div>
        
        {unsoldPlayers.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-5">
              {currentPlayers.map(player => (
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
            
            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t-2 border-gray-200">
                <div className="text-sm text-gray-600">
                  Showing {startIndex + 1}-{Math.min(endIndex, unsoldPlayers.length)} of {unsoldPlayers.length} players
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    <ChevronLeft size={18} />
                    Previous
                  </button>
                  
                  <div className="flex items-center gap-1">
                    {[...Array(Math.min(5, totalPages))].map((_, idx) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = idx + 1;
                      } else if (currentPage <= 3) {
                        pageNum = idx + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + idx;
                      } else {
                        pageNum = currentPage - 2 + idx;
                      }
                      
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`w-10 h-10 rounded-lg font-semibold transition-all duration-200 ${
                            currentPage === pageNum
                              ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                              : 'bg-white border-2 border-gray-300 text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>
                  
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    Next
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            )}
          </>
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
