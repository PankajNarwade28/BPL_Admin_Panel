import React, { useState } from 'react';
import { UserPlus, Users, RotateCcw, RefreshCw, Info } from 'lucide-react';

const SettingsPanel = () => {
  const [captainForm, setCaptainForm] = useState({
    teamName: '',
    captainName: '',
    teamId: '',
    pin: ''
  });

  const createCaptain = (e) => {
    e.preventDefault();
    console.log('Creating captain:', captainForm);
    setCaptainForm({ teamName: '', captainName: '', teamId: '', pin: '' });
  };

  const generateTeams = () => {
    if (window.confirm('Generate 20 teams with random credentials?')) {
      console.log('Generating 20 teams...');
    }
  };

  const resetAuction = () => {
    if (window.confirm('⚠️ This will reset all auction data. Are you sure?')) {
      console.log('Resetting auction...');
    }
  };

  return (
    <div className="space-y-8">
      {/* Create Individual Captain */}
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 lg:p-8 border-2 border-gray-200">
        <div className="flex items-start gap-4 mb-6 pb-4 border-b-2 border-gray-300">
          <UserPlus size={24} className="text-blue-600 flex-shrink-0 mt-1" />
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-1">Create Individual Captain</h3>
            <p className="text-sm text-gray-600">Add a single team captain with custom details</p>
          </div>
        </div>

        <form onSubmit={createCaptain} className="space-y-5">
          <div>
            <label htmlFor="teamName" className="block text-sm font-semibold text-gray-700 mb-2">
              Team Name
            </label>
            <input
              id="teamName"
              type="text"
              value={captainForm.teamName}
              onChange={(e) => setCaptainForm({...captainForm, teamName: e.target.value})}
              placeholder="e.g., Mumbai Warriors"
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
              value={captainForm.captainName}
              onChange={(e) => setCaptainForm({...captainForm, captainName: e.target.value})}
              placeholder="e.g., Rohit Sharma"
              required
              className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all duration-200"
            />
          </div>

          <div>
            <label htmlFor="teamId" className="block text-sm font-semibold text-gray-700 mb-2">
              Team ID (unique)
            </label>
            <input
              id="teamId"
              type="text"
              value={captainForm.teamId}
              onChange={(e) => setCaptainForm({...captainForm, teamId: e.target.value})}
              placeholder="e.g., MW01"
              required
              className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all duration-200"
            />
          </div>

          <div>
            <label htmlFor="pin" className="block text-sm font-semibold text-gray-700 mb-2">
              4-Digit PIN
            </label>
            <input
              id="pin"
              type="text"
              value={captainForm.pin}
              onChange={(e) => setCaptainForm({...captainForm, pin: e.target.value})}
              placeholder="e.g., 1234"
              pattern="[0-9]{4}"
              maxLength="4"
              required
              className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all duration-200"
            />
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
          >
            <UserPlus size={18} />
            Create Captain
          </button>
        </form>
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 lg:p-8 border-2 border-gray-200">
        <div className="flex items-start gap-4 mb-6 pb-4 border-b-2 border-gray-300">
          <Users size={24} className="text-blue-600 flex-shrink-0 mt-1" />
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-1">Quick Actions</h3>
            <p className="text-sm text-gray-600">Bulk operations and system controls</p>
          </div>
        </div>

        <div className="space-y-4">
          <button
            onClick={generateTeams}
            className="w-full flex items-start gap-4 bg-white p-5 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
          >
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
              <Users size={20} />
            </div>
            <div className="flex-1 text-left">
              <div className="font-semibold text-gray-900 mb-1">Generate 20 Teams</div>
              <div className="text-sm text-gray-600">Create bulk teams with random IDs</div>
            </div>
          </button>

          <button
            onClick={resetAuction}
            className="w-full flex items-start gap-4 bg-white p-5 border-2 border-yellow-200 rounded-xl hover:border-yellow-500 hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
          >
            <div className="w-12 h-12 bg-yellow-100 text-yellow-600 rounded-xl flex items-center justify-center flex-shrink-0">
              <RotateCcw size={20} />
            </div>
            <div className="flex-1 text-left">
              <div className="font-semibold text-gray-900 mb-1">Reset Auction</div>
              <div className="text-sm text-gray-600">Clear all auction progress</div>
            </div>
          </button>

          <button
            onClick={() => window.location.reload()}
            className="w-full flex items-start gap-4 bg-white p-5 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
          >
            <div className="w-12 h-12 bg-gray-100 text-gray-600 rounded-xl flex items-center justify-center flex-shrink-0">
              <RefreshCw size={20} />
            </div>
            <div className="flex-1 text-left">
              <div className="font-semibold text-gray-900 mb-1">Refresh Data</div>
              <div className="text-sm text-gray-600">Reload all data from server</div>
            </div>
          </button>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 lg:p-8 border-2 border-blue-200">
        <div className="flex items-start gap-4 mb-6 pb-4 border-b-2 border-blue-200">
          <Info size={24} className="text-blue-600 flex-shrink-0 mt-1" />
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-1">Setup Instructions</h3>
            <p className="text-sm text-gray-600">Follow these steps to set up your auction</p>
          </div>
        </div>

        <ol className="space-y-5">
          <li className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 text-white flex items-center justify-center font-bold flex-shrink-0">
              1
            </div>
            <div className="flex-1 pt-1">
              <div className="font-semibold text-gray-900 mb-1">Create Teams</div>
              <p className="text-sm text-gray-700 leading-relaxed">
                Use the form above to create individual captains OR generate 20 teams in bulk
              </p>
            </div>
          </li>

          <li className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 text-white flex items-center justify-center font-bold flex-shrink-0">
              2
            </div>
            <div className="flex-1 pt-1">
              <div className="font-semibold text-gray-900 mb-1">Upload Players</div>
              <p className="text-sm text-gray-700 leading-relaxed">
                Go to Players tab and upload CSV with columns: name, category, basePrice, photo
              </p>
            </div>
          </li>

          <li className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 text-white flex items-center justify-center font-bold flex-shrink-0">
              3
            </div>
            <div className="flex-1 pt-1">
              <div className="font-semibold text-gray-900 mb-1">Start Auction</div>
              <p className="text-sm text-gray-700 leading-relaxed">
                Navigate to Auction Control and select a player or start auto-auction
              </p>
            </div>
          </li>

          <li className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 text-white flex items-center justify-center font-bold flex-shrink-0">
              4
            </div>
            <div className="flex-1 pt-1">
              <div className="font-semibold text-gray-900 mb-1">Monitor & Control</div>
              <p className="text-sm text-gray-700 leading-relaxed">
                Track team connections, manage bids, and use pause/resume controls
              </p>
            </div>
          </li>

          <li className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 text-white flex items-center justify-center font-bold flex-shrink-0">
              5
            </div>
            <div className="flex-1 pt-1">
              <div className="font-semibold text-gray-900 mb-1">Manage Results</div>
              <p className="text-sm text-gray-700 leading-relaxed">
                View team rosters and undo sales if necessary from the Teams tab
              </p>
            </div>
          </li>
        </ol>
      </div>
    </div>
  );
};

export default SettingsPanel;
