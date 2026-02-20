import React, { useState, useEffect } from "react";
import { X, User, DollarSign, Tag } from "lucide-react";

const EditPlayerModal = ({ player, onClose, onUpdate }) => {
  const [form, setForm] = useState({
    name: "",
    category: "",
    basePrice: "",
  });

  useEffect(() => {
    if (player) {
      setForm({
        name: player.name,
        category: player.category,
        basePrice: player.basePrice,
      });
    }
  }, [player]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate({ ...player, ...form });
  };

  const categoryData = {
    'Batsman': { icon: '🏏', color: 'red', gradient: 'from-red-500 to-red-600' },
    'Bowler': { icon: '⚡', color: 'green', gradient: 'from-green-500 to-green-600' },
    'All-Rounder': { icon: '🌟', color: 'orange', gradient: 'from-orange-500 to-orange-600' },
    'Wicket-Keeper': { icon: '🧤', color: 'blue', gradient: 'from-blue-500 to-blue-600' }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto animate-slideUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b-2 border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white">
              <User size={20} />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Edit Player</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white rounded-xl transition-colors duration-200 group"
          >
            <X size={20} className="text-gray-600 group-hover:text-red-600 transition-colors" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Player Name */}
          <div>
            <label
              htmlFor="playerName"
              className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2"
            >
              <User size={16} />
              Player Name
            </label>
            <input
              id="playerName"
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Enter player name"
              required
              className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all duration-200 text-gray-900 font-medium"
            />
          </div>

          {/* Category */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
              <Tag size={16} />
              Player Category
            </label>
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(categoryData).map(([cat, data]) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setForm({ ...form, category: cat })}
                  className={`relative px-4 py-3 rounded-xl border-2 font-semibold transition-all duration-200 overflow-hidden group ${
                    form.category === cat
                      ? `border-${data.color}-600 bg-gradient-to-r ${data.gradient} text-white shadow-lg scale-105`
                      : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:shadow-md'
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-xl">{data.icon}</span>
                    <span className="text-sm">{cat.split('-')[0]}</span>
                  </div>
                  {form.category === cat && (
                    <div className="absolute top-1 right-1 w-2 h-2 bg-white rounded-full"></div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Base Price */}
          <div>
            <label
              htmlFor="playerPrice"
              className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2"
            >
              <DollarSign size={16} />
              Base Price (₹ Lakhs)
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-lg">₹</span>
              <input
                id="playerPrice"
                type="number"
                value={form.basePrice}
                onChange={(e) => setForm({ ...form, basePrice: e.target.value })}
                min="5"
                placeholder="Enter base price"
                required
                className="w-full pl-10 pr-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all duration-200 text-gray-900 font-bold text-lg"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">Lakhs</span>
            </div>
            <p className="mt-2 text-xs text-gray-500">Minimum: ₹5 Lakhs</p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t-2 border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
            >
              Update Player
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPlayerModal;
