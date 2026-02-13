import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

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

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b-2 border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Edit Player</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <X size={20} className="text-gray-600" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label
              htmlFor="playerName"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Player Name
            </label>
            <input
              id="playerName"
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Enter player name"
              required
              className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all duration-200"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Category
            </label>
            <div className="grid grid-cols-2 gap-2">
              {["Batsman", "Bowler", "All-Rounder", "Wicket-Keeper"].map(
                (cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setForm({ ...form, category: cat })}
                    className={`px-3 py-2 rounded-xl border-2 font-medium transition-all ${
                      form.category === cat
                        ? "border-blue-600 bg-blue-50 text-blue-600"
                        : "border-gray-100 text-gray-500 hover:border-gray-200"
                    }`}
                  >
                    {cat}
                  </button>
                ),
              )}
            </div>
          </div>

          <div>
            <label
              htmlFor="playerPrice"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Base Price (₹ Lakhs)
            </label>
            <input
              id="playerPrice"
              type="number"
              value={form.basePrice}
              onChange={(e) => setForm({ ...form, basePrice: e.target.value })}
              min="5"
              placeholder="Enter base price"
              required
              className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all duration-200"
            />
          </div>

          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-all duration-200"
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
