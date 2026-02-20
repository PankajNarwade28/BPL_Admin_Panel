import React, { useState } from 'react';
import { Play, DollarSign, User, Tag } from 'lucide-react';

const PlayerCard = ({ player, onStart, disabled, socketUrl, placeholderImage }) => {
  const [showInfo, setShowInfo] = useState(false);

  const getCategoryStyle = (category) => {
    const styles = {
      'Batsman': 'bg-red-500 text-white',
      'Bowler': 'bg-green-500 text-white',
      'All-Rounder': 'bg-amber-500 text-white',
      'Wicket-Keeper': 'bg-blue-500 text-white'
    };
    return styles[category] || 'bg-gray-500 text-white';
  };

  const getCategoryIcon = (category) => {
    const icons = {
      'Batsman': '🏏',
      'Bowler': '⚡',
      'All-Rounder': '🌟',
      'Wicket-Keeper': '🧤'
    };
    return icons[category] || '🎯';
  };

  // Fix image URL construction - remove leading slashes and ensure proper URL
  const getImageUrl = () => {
    // Return placeholder if no photo or if it's the default placeholder path
    if (!player.photo || player.photo.trim() === '' || player.photo.includes('placeholder')) {
      return placeholderImage;
    }
    
    // If it's already a full URL, use it directly
    if (player.photo.startsWith('http')) {
      return player.photo;
    }
    
    // Remove leading slashes from photo path
    const cleanPhotoPath = player.photo.replace(/^\/+/, '');
    
    // Ensure socketUrl ends without slash and photo path starts without slash
    const cleanSocketUrl = socketUrl.replace(/\/+$/, '');
    
    return `${cleanSocketUrl}/${cleanPhotoPath}`;
  };

  const imageUrl = getImageUrl();

  return (
    <div 
      className="group bg-white rounded-2xl overflow-hidden border-2 border-gray-200 hover:border-blue-500 hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300"
      onMouseEnter={() => setShowInfo(true)}
      onMouseLeave={() => setShowInfo(false)}
    >
      {/* Player Image */}
      <div className="relative h-56 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 overflow-hidden">
        <img 
          src={imageUrl} 
          alt={player.name}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = placeholderImage;
          }}
          className="w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-110"
        />
        
        {/* Hover Overlay with Player Info */}
        <div className={`absolute inset-0 bg-gradient-to-t from-black/95 via-black/70 to-transparent transition-opacity duration-300 ${
          showInfo ? 'opacity-100' : 'opacity-0'
        }`}>
          <div className="absolute bottom-0 left-0 right-0 p-4 text-white space-y-2">
            <div className="flex items-center gap-2">
              <User size={16} />
              <span className="text-sm font-semibold">Player Details</span>
            </div>
            
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-300">Name:</span>
                <span className="text-sm font-bold">{player.name}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-300">Category:</span>
                <div className="flex items-center gap-1">
                  <span className="text-sm">{getCategoryIcon(player.category)}</span>
                  <span className="text-sm font-semibold">{player.category}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-300">Base Price:</span>
                <span className="text-sm font-bold text-green-400">₹{player.basePrice} L</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-300">Status:</span>
                <span className="text-sm font-semibold text-yellow-400">{player.status}</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Category Badge */}
        <div className={`absolute top-3 right-3 px-3 py-1.5 rounded-lg text-xs font-bold uppercase backdrop-blur-sm shadow-lg ${getCategoryStyle(player.category)} transition-transform duration-300 ${
          showInfo ? 'scale-0' : 'scale-100'
        }`}>
          {player.category}
        </div>
      </div>
      
      {/* Player Info */}
      <div className="p-5">
        <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-1" title={player.name}>
          {player.name}
        </h3>
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-green-600 font-semibold">
            <DollarSign size={16} />
            <span>₹{player.basePrice} L</span>
          </div>
          <div className="flex items-center gap-1 text-gray-600 text-sm">
            <Tag size={14} />
            <span className="text-xs font-medium">{player.category}</span>
          </div>
        </div>
        
        <button 
          onClick={onStart} 
          disabled={disabled}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
        >
          <Play size={16} />
          Start Auction
        </button>
      </div>
    </div>
  );
};

export default PlayerCard;
