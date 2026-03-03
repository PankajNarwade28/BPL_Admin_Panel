import React from 'react';
import { Play, DollarSign, Tag } from 'lucide-react';

const PlayerCard = ({ player, onStart, disabled, socketUrl, placeholderImage }) => {
  const getCategoryStyle = (category) => {
    const styles = {
      'Batsman': 'bg-red-500 text-white',
      'Bowler': 'bg-green-500 text-white',
      'All-Rounder': 'bg-amber-500 text-white',
      'Wicket-Keeper': 'bg-blue-500 text-white'
    };
    return styles[category] || 'bg-gray-500 text-white';
  };

  const getImageUrl = () => {
    if (!player.photo || player.photo.trim() === '' || player.photo.includes('placeholder')) {
      return placeholderImage;
    }
    if (player.photo.startsWith('http')) return player.photo;
    
    const normalizedBase = socketUrl.endsWith('/') ? socketUrl : socketUrl + '/';
    const cleanPhotoPath = player.photo.replace(/^\/+/, '');
    
    return `${normalizedBase}${cleanPhotoPath}`;
  };

  return (
    <div className="bg-white rounded-2xl overflow-hidden border-2 border-gray-200 cursor-pointer /* Hover Effects */
  transition-all duration-300 
  hover:scale-105 
  hover:shadow-2xl 
  hover:z-10">
      {/* Player Image */}
      <div className="relative h-56 bg-gradient-to-br from-indigo-500  via-purple-500 to-pink-500 overflow-hidden">
        <img 
          src={getImageUrl()} 
          alt={player.name}
          loading="lazy"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = placeholderImage;
          }}
          className="w-full h-full object-cover object-center"
        />
        
        {/* Category Badge */}
        <div className={`absolute top-3 right-3 px-3 py-1.5 rounded-lg text-xs font-bold uppercase backdrop-blur-sm shadow-lg ${getCategoryStyle(player.category)}`}>
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
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed shadow-md transition-all duration-200"
        >
          <Play size={16} />
          Start Auction
        </button>
      </div>
    </div>
  );
};

export default PlayerCard;