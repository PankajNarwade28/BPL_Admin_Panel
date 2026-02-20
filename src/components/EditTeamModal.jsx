import React, { useState, useEffect } from 'react';
import { X, Users, User, CreditCard, Lock, AlertCircle } from 'lucide-react';

const EditTeamModal = ({ team, onClose, onUpdate }) => {
  const [form, setForm] = useState({
    teamName: '',
    captainName: '',
    teamId: '',
    pin: ''
  });
  const [showPinWarning, setShowPinWarning] = useState(false);

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

  const handlePinChange = (e) => {
    const value = e.target.value;
    setForm({...form, pin: value});
    setShowPinWarning(value.length > 0);
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
              <Users size={20} />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Edit Team</h2>
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
          {/* Team Name */}
          <div>
            <label htmlFor="teamName" className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <Users size={16} />
              Team Name
            </label>
            <input
              id="teamName"
              type="text"
              value={form.teamName}
              onChange={(e) => setForm({...form, teamName: e.target.value})}
              placeholder="Enter team name"
              required
              className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all duration-200 text-gray-900 font-medium"
            />
          </div>

          {/* Captain Name */}
          <div>
            <label htmlFor="captainName" className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <User size={16} />
              Captain Name
            </label>
            <input
              id="captainName"
              type="text"
              value={form.captainName}
              onChange={(e) => setForm({...form, captainName: e.target.value})}
              placeholder="Enter captain name"
              required
              className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all duration-200 text-gray-900 font-medium"
            />
          </div>

          {/* Team ID */}
          <div>
            <label htmlFor="teamId" className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <CreditCard size={16} />
              Team ID
            </label>
            <input
              id="teamId"
              type="text"
              value={form.teamId}
              onChange={(e) => setForm({...form, teamId: e.target.value})}
              placeholder="Enter team ID"
              required
              className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all duration-200 text-gray-900 font-mono font-bold uppercase"
            />
          </div>

          {/* PIN Section */}
          <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4">
            <label htmlFor="teamPin" className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <Lock size={16} className="text-yellow-600" />
              New PIN (Optional)
            </label>
            <input
              id="teamPin"
              type="text"
              value={form.pin}
              onChange={handlePinChange}
              placeholder="4-digit PIN"
              maxLength="4"
              pattern="[0-9]{4}"
              className="w-full px-4 py-3 bg-white border-2 border-yellow-200 rounded-xl focus:border-yellow-500 focus:ring-4 focus:ring-yellow-100 outline-none transition-all duration-200 text-gray-900 font-mono font-bold text-center text-2xl tracking-widest"
            />
            
            {showPinWarning && (
              <div className="mt-3 flex items-start gap-2 p-3 bg-yellow-100 border border-yellow-300 rounded-lg">
                <AlertCircle size={16} className="text-yellow-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-yellow-800 font-medium">
                  <strong>Warning:</strong> Changing the PIN will require the captain to use the new PIN for login. 
                  Leave blank to keep the current PIN.
                </p>
              </div>
            )}
            
            {!showPinWarning && (
              <p className="mt-2 text-xs text-gray-600 flex items-center gap-1">
                <Lock size={12} />
                Leave blank to keep current PIN unchanged
              </p>
            )}
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
              Update Team
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTeamModal;
