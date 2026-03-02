import React, { useState } from 'react';
import { Upload, Edit2, Trash2, RotateCcw, Search, Ban, CheckCircle, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import EditPlayerModal from './EditPlayerModal';

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || "http://localhost:5000/";
// Ensure URL ends with slash
const BASE_URL = SOCKET_URL.endsWith('/') ? SOCKET_URL : SOCKET_URL + '/';
const PLACEHOLDER_IMAGE = 'https://res.cloudinary.com/dz8q0fb8m/image/upload/v1772197979/defaultPlayer_kad3xb.png';

const PlayersPanel = ({ 
  players, 
  setPlayers, 
  loadData, 
  handleFileUpload, 
  deletePlayer, 
  undoSale,
  removeFromAuction,
  updatePlayer,
  togglePlayerAvailability
}) => {
  const [editingPlayer, setEditingPlayer] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [filterCategory, setFilterCategory] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handleCsvUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleUpdatePlayer = async (updatedPlayer) => {
    await updatePlayer(updatedPlayer);
    setEditingPlayer(null);
  };

  const filteredPlayers = players.filter(player => {
    const matchesSearch = player.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'ALL' || player.status === filterStatus;
    const matchesCategory = filterCategory === 'ALL' || player.category === filterCategory;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredPlayers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPlayers = filteredPlayers.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterStatus, filterCategory]);

  const getStatusBadge = (status) => {
    const badges = {
      'SOLD': <span className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-xs font-bold uppercase">Sold</span>,
      'UNSOLD': <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-lg text-xs font-bold uppercase">Unsold</span>,
      'IN_AUCTION': <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs font-bold uppercase">In Auction</span>
    };
    return badges[status] || <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs font-bold uppercase">{status}</span>;
  };

  const getAvailabilityBadge = (availability) => {
    if (availability === 'AVAILABLE') {
      return <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-lg text-xs font-bold uppercase">
        <CheckCircle size={12} />
        Available
      </span>;
    }
    return <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded-lg text-xs font-bold uppercase">
      <Ban size={12} />
      Unavailable
    </span>;
  };

  const getCategoryTag = (category) => {
    const tags = {
      'Batsman': 'bg-red-100 text-red-700',
      'Bowler': 'bg-green-100 text-green-700',
      'All-Rounder': 'bg-amber-100 text-amber-700',
      'Wicket-Keeper': 'bg-blue-100 text-blue-700'
    };
    return tags[category] || 'bg-gray-100 text-gray-700';
  };

  const getPlayerImageUrl = (player) => {
    // Return placeholder if no photo or if it's the default placeholder path
    if (!player.photo || player.photo.trim() === '' || player.photo.includes('placeholder')) {
      return PLACEHOLDER_IMAGE;
    }
    
    // If it's already a full URL (Cloudinary or other), use it as-is
    if (player.photo.startsWith('http')) {
      return player.photo;
    }
    
    // Clean up paths and construct URL for legacy images
    const cleanPhotoPath = player.photo.replace(/^\/+/, '');
    
    return `${BASE_URL}${cleanPhotoPath}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold text-gray-900">Players Management</h2>
          <span className="px-3 py-1 bg-gray-200 text-gray-700 rounded-lg font-semibold text-sm">
            {filteredPlayers.length} players
          </span>
          {totalPages > 1 && (
            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg font-semibold text-sm">
              Page {currentPage} of {totalPages}
            </span>
          )}
        </div>
        
        <div>
          <input 
            type="file" 
            accept=".csv" 
            onChange={handleCsvUpload}
            id="csvUpload"
            className="hidden"
          />
          <button 
            onClick={() => document.getElementById('csvUpload').click()} 
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
          >
            <Upload size={18} />
            Upload CSV
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-gray-50 rounded-2xl p-4 lg:p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search players..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all duration-200"
            />
          </div>

          <div className="flex gap-3">
            <select 
              value={filterStatus} 
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-3 bg-white border-2 border-gray-200 rounded-xl font-medium focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none cursor-pointer transition-all duration-200"
            >
              <option value="ALL">All Status</option>
              <option value="SOLD">Sold</option>
              <option value="UNSOLD">Unsold</option>
              <option value="IN_AUCTION">In Auction</option>
            </select>

            <select 
              value={filterCategory} 
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-3 bg-white border-2 border-gray-200 rounded-xl font-medium focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none cursor-pointer transition-all duration-200"
            >
              <option value="ALL">All Categories</option>
              <option value="Batsman">Batsman</option>
              <option value="Bowler">Bowler</option>
              <option value="All-Rounder">All-Rounder</option>
              <option value="Wicket-Keeper">Wicket-Keeper</option>
            </select>
          </div>
        </div>
      </div>

      {/* Players Table */}
      <div className="bg-white rounded-2xl border-2 border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b-2 border-gray-200">
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Player</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Category</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Base Price</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Availability</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Sold To</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Final Price</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {currentPlayers.map(player => (
                <tr key={player._id} className="hover:bg-gray-50 transition-colors duration-150">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-gray-200 shadow-sm flex-shrink-0">
                        <img 
                          src={getPlayerImageUrl(player)}
                          alt={player.name}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = PLACEHOLDER_IMAGE;
                          }}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="font-semibold text-gray-900">{player.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-block px-3 py-1 rounded-lg text-xs font-bold uppercase ${getCategoryTag(player.category)}`}>
                      {player.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-semibold text-green-600">₹{player.basePrice} L</td>
                  <td className="px-6 py-4">{getStatusBadge(player.status)}</td>
                  <td className="px-6 py-4">{getAvailabilityBadge(player.availability || 'AVAILABLE')}</td>
                  <td className="px-6 py-4 text-gray-700">{player.soldTo?.teamName || '-'}</td>
                  <td className="px-6 py-4 font-semibold text-green-600">
                    {player.soldPrice ? `₹${player.soldPrice} L` : '-'}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      {/* Availability Toggle - available for UNSOLD and SOLD players */}
                      {(player.status === 'UNSOLD' || player.status === 'SOLD') && (
                        <button 
                          onClick={() => togglePlayerAvailability(player._id, player.availability || 'AVAILABLE')} 
                          className={`p-2 rounded-lg transition-colors duration-200 ${
                            (player.availability || 'AVAILABLE') === 'AVAILABLE' 
                              ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                              : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                          }`}
                          title={(player.availability || 'AVAILABLE') === 'AVAILABLE' ? 'Mark as unavailable' : 'Mark as available'}
                        >
                          {(player.availability || 'AVAILABLE') === 'AVAILABLE' ? <Ban size={16} /> : <CheckCircle size={16} />}
                        </button>
                      )}
                      
                      {player.status === 'UNSOLD' && (
                        <>
                          <button 
                            onClick={() => setEditingPlayer(player)} 
                            className="p-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                            title="Edit player"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button 
                            onClick={() => deletePlayer(player._id)} 
                            className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors duration-200"
                            title="Delete player"
                          >
                            <Trash2 size={16} />
                          </button>
                        </>
                      )}
                      {player.status === 'SOLD' && (
                        <button 
                          onClick={() => undoSale(player._id)} 
                          className="p-2 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition-colors duration-200"
                          title="Undo sale"
                        >
                          <RotateCcw size={16} />
                        </button>
                      )}
                      {player.status === 'IN_AUCTION' && (
                        <button 
                          onClick={() => removeFromAuction(player._id)} 
                          className="p-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors duration-200"
                          title="Remove from auction"
                        >
                          <RotateCcw size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredPlayers.length === 0 && (
            <div className="py-16 text-center">
              <Search size={48} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl font-bold text-gray-600 mb-2">No players found</h3>
              <p className="text-gray-500">Try adjusting your search or filters</p>
            </div>
          )}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="px-6 py-4 bg-gray-50 border-t-2 border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Showing {startIndex + 1} to {Math.min(endIndex, filteredPlayers.length)} of {filteredPlayers.length} players
              </div>
              
              <div className="flex items-center gap-2">
                {/* First Page Button */}
                <button
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                  className={`flex items-center gap-1 px-3 py-2 rounded-lg font-semibold transition-all duration-200 ${
                    currentPage === 1 
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                      : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-blue-500 hover:bg-blue-50'
                  }`}
                  title="First page"
                >
                  <ChevronsLeft size={16} />
                  <span className="hidden sm:inline">First</span>
                </button>

                {/* Previous Page Button */}
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className={`flex items-center gap-1 px-3 py-2 rounded-lg font-semibold transition-all duration-200 ${
                    currentPage === 1 
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                      : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-blue-500 hover:bg-blue-50'
                  }`}
                  title="Previous page"
                >
                  <ChevronLeft size={16} />
                  <span className="hidden sm:inline">Previous</span>
                </button>

                <div className="flex gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => {
                    // Show first page, last page, current page, and pages around current
                    const showPage = page === 1 || 
                                    page === totalPages || 
                                    (page >= currentPage - 1 && page <= currentPage + 1);
                    
                    // Show ellipsis
                    const showEllipsisBefore = page === currentPage - 2 && currentPage > 3;
                    const showEllipsisAfter = page === currentPage + 2 && currentPage < totalPages - 2;

                    if (showEllipsisBefore || showEllipsisAfter) {
                      return (
                        <span key={page} className="px-3 py-2 text-gray-400">
                          ...
                        </span>
                      );
                    }

                    if (!showPage) return null;

                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`min-w-[40px] px-3 py-2 rounded-lg font-semibold transition-all duration-200 ${
                          currentPage === page
                            ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md'
                            : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-blue-500 hover:bg-blue-50'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                </div>

                {/* Next Page Button */}
                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className={`flex items-center gap-1 px-3 py-2 rounded-lg font-semibold transition-all duration-200 ${
                    currentPage === totalPages 
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                      : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-blue-500 hover:bg-blue-50'
                  }`}
                  title="Next page"
                >
                  <span className="hidden sm:inline">Next</span>
                  <ChevronRight size={16} />
                </button>

                {/* Last Page Button */}
                <button
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                  className={`flex items-center gap-1 px-3 py-2 rounded-lg font-semibold transition-all duration-200 ${
                    currentPage === totalPages 
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                      : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-blue-500 hover:bg-blue-50'
                  }`}
                  title="Last page"
                >
                  <span className="hidden sm:inline">Last</span>
                  <ChevronsRight size={16} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {editingPlayer && (
        <EditPlayerModal
          player={editingPlayer}
          onClose={() => setEditingPlayer(null)}
          onUpdate={handleUpdatePlayer}
        />
      )}
    </div>
  );
};

export default PlayersPanel;
