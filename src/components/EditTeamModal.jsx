import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const EditTeamModal = ({ team, onClose, onUpdate }) => {
  const [form, setForm] = useState({
    teamName: '',
    captainName: '',
    teamId: '',
    pin: ''
  });

  useEffect(() => {
    if (team) {
      setForm({
        teamName: team.teamName,
        captainName: team.captainName,
        teamId: team.teamId,
        pin: ''
      });
    }
  }, [team]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const updateData = { ...team, ...form };
    if (!form.pin) {
      delete updateData.pin;
    }
    onUpdate(updateData);
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
          <h2 className="text-xl font-bold text-gray-900">Edit Team</h2>
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
            <label htmlFor="teamName" className="block text-sm font-semibold text-gray-700 mb-2">
              Team Name
            </label>
            <input
              id="teamName"
              type="text"
              value={form.teamName}
              onChange={(e) => setForm({...form, teamName: e.target.value})}
              placeholder="Enter team name"
              required
              className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all duration-200"
            />
          </div>

          <div>
            <label htmlFor="captainName" className="block text-sm font-semibold text-gray-700 mb-2">
              Captain Name
            </label>
            <input
              id="captainName"
              type="text"
              value={form.captainName}
              onChange={(e) => setForm({...form, captainName: e.target.value})}
              placeholder="Enter captain name"
              required
              className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all duration-200"
            />
          </div>

          <div>
            <label htmlFor="teamId" className="block text-sm font-semibold text-gray-700 mb-2">
              Team ID
            </label>
            <input
              id="teamId"
              type="text"
              value={form.teamId}
              onChange={(e) => setForm({...form, teamId: e.target.value})}
              placeholder="Enter team ID"
              required
              className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all duration-200"
            />
          </div>

          <div>
            <label htmlFor="teamPin" className="block text-sm font-semibold text-gray-700 mb-2">
              New PIN (leave blank to keep current)
            </label>
            <input
              id="teamPin"
              type="text"
              value={form.pin}
              onChange={(e) => setForm({...form, pin: e.target.value})}
              placeholder="4-digit PIN"
              maxLength="4"
              pattern="[0-9]{4}"
              className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all duration-200"
            />
            <p className="mt-2 text-xs text-gray-500">Only enter a PIN if you want to change it</p>
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
              Update Team
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTeamModal;
