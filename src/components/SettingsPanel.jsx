import React, { useState } from 'react';
import axios from 'axios';
import { UserPlus, Users, RotateCcw, RefreshCw, Info, AlertTriangle, CheckCircle, Zap, Upload, X } from 'lucide-react';
import LoadingAnimation from './LoadingAnimation';

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api"; 
const SettingsPanel = ({ loadData }) => {
  const [captainForm, setCaptainForm] = useState({
    teamName: '',
    captainName: '',
    teamId: '',
    pin: ''
  });
  const [teamLogo, setTeamLogo] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [isCreating, setIsCreating] = useState(false);

  const generateTeams = async () => {
    if (!window.confirm('Generate 20 teams with random credentials?\n\nThis will create:\n- 20 teams with auto-generated IDs\n- Random 4-digit PINs\n- ₹1000L budget each\n\nPINs will be shown only once!')) {
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/admin/generate-teams`, {
        count: 20,
      });
      
      // Create downloadable PINs file
      const pins = response.data.teams
        .map((t) => `Team ID: ${t.teamId} | Team Name: ${t.teamName} | Captain: ${t.captainName} | PIN: ${t.pin}`)
        .join("\n");
      
      // Download as text file
      const blob = new Blob([pins], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'team-credentials.txt';
      a.click();
      
      alert(`✅ ${response.data.teams.length} teams created successfully!\n\n🔐 Team credentials have been downloaded.\n\nAlso logged to console for backup.`);
      console.log("Team Credentials:\n", pins);

      loadData();
    } catch (error) {
      alert("❌ Error generating teams: " + (error.response?.data?.message || error.message));
    }
  };

  const resetAuction = async () => {
    if (!window.confirm("⚠️ RESET ENTIRE AUCTION?\n\nThis will:\n- Clear ALL bids\n- Reset team rosters to empty\n- Reset team budgets to initial\n- Keep players and teams\n\n⚠️ This action CANNOT be undone!")) {
      return;
    }

    // Double confirmation
    if (!window.confirm("⚠️ FINAL WARNING!\n\nAre you absolutely sure you want to reset the auction?\n\nClick OK to proceed.")) {
      return;
    }

    try {
      await axios.post(`${API_URL}/admin/reset`);
      alert("✅ Auction reset successfully!\n\nAll bids cleared and rosters reset.");
      loadData();
    } catch (error) {
      alert("❌ Error resetting auction: " + (error.response?.data?.message || error.message));
    }
  };

  const createCaptain = async (e) => {
    e.preventDefault();
    setIsCreating(true);
    
    try {
      // Use FormData for file upload
      const formData = new FormData();
      formData.append('teamName', captainForm.teamName);
      formData.append('captainName', captainForm.captainName);
      formData.append('teamId', captainForm.teamId);
      formData.append('pin', captainForm.pin);
      if (teamLogo) {
        formData.append('logo', teamLogo);
      }
      
      const response = await axios.post(
        `${API_URL}/admin/create-captain`,
        formData
        // Don't set Content-Type manually - axios will set it with boundary for FormData
      );
      
      const { team } = response.data;
      
      // Show success with credentials
      alert(
        `✅ Captain created successfully!\n\n` +
        `🏏 Team: ${team.teamName}\n` +
        `👤 Captain: ${team.captainName}\n` +
        `🆔 Team ID: ${team.teamId}\n` +
        `🔐 PIN: ${team.pin}\n\n` +
        `⚠️ SAVE THIS PIN - It won't be shown again!`
      );

      // Reset form
      setCaptainForm({ teamName: "", captainName: "", teamId: "", pin: "" });
      setTeamLogo(null);
      setLogoPreview(null);
      loadData();
    } catch (error) {
      alert(
        "❌ Error creating captain:\n" +
        (error.response?.data?.message || error.message)
      );
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Loading Animation */}
      {isCreating && <LoadingAnimation message="Creating Team..." />}
      
      {/* Create Individual Captain */}
      <div className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 rounded-2xl p-6 lg:p-8 border-2 border-blue-200 shadow-lg">
        <div className="flex items-start gap-4 mb-6 pb-4 border-b-2 border-blue-200">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white shadow-lg">
            <UserPlus size={24} />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">Create Individual Captain</h3>
            <p className="text-sm text-gray-600">Add a single team captain with custom details</p>
          </div>
        </div>

        <form onSubmit={createCaptain} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label htmlFor="teamName" className="block text-sm font-semibold text-gray-700 mb-2">
                Team Name <span className="text-red-500">*</span>
              </label>
              <input
                id="teamName"
                type="text"
                value={captainForm.teamName}
                onChange={(e) => setCaptainForm({...captainForm, teamName: e.target.value})}
                placeholder="e.g., Mumbai Warriors"
                required
                className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all duration-200 font-medium"
              />
            </div>

            <div>
              <label htmlFor="captainName" className="block text-sm font-semibold text-gray-700 mb-2">
                Captain Name <span className="text-red-500">*</span>
              </label>
              <input
                id="captainName"
                type="text"
                value={captainForm.captainName}
                onChange={(e) => setCaptainForm({...captainForm, captainName: e.target.value})}
                placeholder="e.g., Rohit Sharma"
                required
                className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all duration-200 font-medium"
              />
            </div>

            <div>
              <label htmlFor="teamId" className="block text-sm font-semibold text-gray-700 mb-2">
                Team ID (unique) <span className="text-red-500">*</span>
              </label>
              <input
                id="teamId"
                type="text"
                value={captainForm.teamId}
                onChange={(e) => setCaptainForm({...captainForm, teamId: e.target.value.toUpperCase()})}
                placeholder="e.g., MW01"
                required
                className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all duration-200 font-mono font-bold uppercase"
              />
            </div>

            <div>
              <label htmlFor="pin" className="block text-sm font-semibold text-gray-700 mb-2">
                4-Digit PIN <span className="text-red-500">*</span>
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
                className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all duration-200 font-mono font-bold text-center text-2xl tracking-widest"
              />
            </div>
          </div>

          {/* Team Logo Upload */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-gray-700">
              Team Logo <span className="text-gray-500">(Optional)</span>
            </label>
            
            {logoPreview ? (
              <div className="relative">
                <div className="w-full h-40 rounded-xl overflow-hidden border-4 border-blue-500 bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
                  <img 
                    src={logoPreview} 
                    alt="Team Logo Preview" 
                    className="max-h-full max-w-full object-contain p-2"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setTeamLogo(null);
                    setLogoPreview(null);
                  }}
                  className="absolute -top-3 -right-3 w-10 h-10 bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-red-700 transition-all duration-200 hover:scale-110"
                >
                  <X size={20} />
                </button>
              </div>
            ) : (
              <div
                onClick={() => document.getElementById('team-logo-input').click()}
                className="w-full h-40 rounded-xl border-4 border-dashed border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 flex flex-col items-center justify-center cursor-pointer group"
              >
                <Upload size={40} className="text-gray-400 group-hover:text-blue-600 mb-3 transition-colors" />
                <p className="text-gray-700 font-semibold group-hover:text-blue-700">Upload Team Logo</p>
                <p className="text-sm text-gray-500 mt-1">Click to browse • Max 2MB • PNG, JPG</p>
              </div>
            )}
            
            <input
              type="file"
              id="team-logo-input"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  if (file.size > 2 * 1024 * 1024) {
                    alert('Logo size must be less than 2MB');
                    return;
                  }
                  setTeamLogo(file);
                  const reader = new FileReader();
                  reader.onloadend = () => setLogoPreview(reader.result);
                  reader.readAsDataURL(file);
                }
              }}
              className="hidden"
            />
          </div>

          <button
            type="submit"
            disabled={isCreating}
            className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-bold text-lg hover:from-green-700 hover:to-emerald-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isCreating ? (
              <>
                <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                Creating...
              </>
            ) : (
              <>
                <UserPlus size={20} />
                Create Captain
              </>
            )}
          </button>
        </form>
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 lg:p-8 border-2 border-gray-200 shadow-lg">
        <div className="flex items-start gap-4 mb-6 pb-4 border-b-2 border-gray-300">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white shadow-lg">
            <Zap size={24} />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">Quick Actions</h3>
            <p className="text-sm text-gray-600">Bulk operations and system controls</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={generateTeams}
            className="group relative flex items-start gap-4 bg-white p-6 border-2 border-gray-200 rounded-2xl hover:border-blue-500 hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-500 opacity-0 group-hover:opacity-5 transition-opacity duration-300"></div>
            <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-md">
              <Users size={24} />
            </div>
            <div className="flex-1 text-left">
              <div className="font-bold text-gray-900 mb-1 text-lg">Generate 20 Teams</div>
              <div className="text-sm text-gray-600">Create bulk teams with random credentials</div>
              <div className="mt-2 flex items-center gap-1 text-xs text-blue-600 font-semibold">
                <CheckCircle size={14} />
                Auto-download credentials
              </div>
            </div>
          </button>

          <button
            onClick={() => window.location.reload()}
            className="group relative flex items-start gap-4 bg-white p-6 border-2 border-gray-200 rounded-2xl hover:border-green-500 hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-emerald-500 opacity-0 group-hover:opacity-5 transition-opacity duration-300"></div>
            <div className="w-14 h-14 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-md">
              <RefreshCw size={24} className="group-hover:rotate-180 transition-transform duration-500" />
            </div>
            <div className="flex-1 text-left">
              <div className="font-bold text-gray-900 mb-1 text-lg">Refresh Data</div>
              <div className="text-sm text-gray-600">Reload all data from server</div>
              <div className="mt-2 flex items-center gap-1 text-xs text-green-600 font-semibold">
                <CheckCircle size={14} />
                Sync latest changes
              </div>
            </div>
          </button>

          <button
            onClick={resetAuction}
            className="group relative flex items-start gap-4 bg-gradient-to-br from-yellow-50 to-orange-50 p-6 border-2 border-yellow-300 rounded-2xl hover:border-yellow-500 hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-500 to-orange-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
            <div className="w-14 h-14 bg-yellow-100 text-yellow-600 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-md">
              <RotateCcw size={24} className="group-hover:rotate-180 transition-transform duration-500" />
            </div>
            <div className="flex-1 text-left">
              <div className="font-bold text-gray-900 mb-1 text-lg">Reset Auction</div>
              <div className="text-sm text-gray-600">Clear all bids and rosters</div>
              <div className="mt-2 flex items-center gap-1 text-xs text-yellow-700 font-semibold">
                <AlertTriangle size={14} />
                Requires confirmation
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-6 lg:p-8 border-2 border-indigo-200 shadow-lg">
        <div className="flex items-start gap-4 mb-6 pb-4 border-b-2 border-indigo-200">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-lg">
            <Info size={24} />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">Setup Instructions</h3>
            <p className="text-sm text-gray-600">Follow these steps to set up your auction successfully</p>
          </div>
        </div>

        <ol className="space-y-5">
          <li className="flex gap-4 group">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 text-white flex items-center justify-center font-bold flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300">
              1
            </div>
            <div className="flex-1 pt-1">
              <div className="font-bold text-gray-900 mb-2 text-lg">Create Teams</div>
              <p className="text-sm text-gray-700 leading-relaxed">
                Use the form above to create individual captains OR generate 20 teams in bulk with auto-generated credentials
              </p>
            </div>
          </li>

          <li className="flex gap-4 group">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 text-white flex items-center justify-center font-bold flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300">
              2
            </div>
            <div className="flex-1 pt-1">
              <div className="font-bold text-gray-900 mb-2 text-lg">Upload or Register Players</div>
              <p className="text-sm text-gray-700 leading-relaxed">
                Go to Registration tab to add players individually OR go to Players tab and upload CSV with columns: name, category, basePrice, photo
              </p>
            </div>
          </li>

          <li className="flex gap-4 group">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 text-white flex items-center justify-center font-bold flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300">
              3
            </div>
            <div className="flex-1 pt-1">
              <div className="font-bold text-gray-900 mb-2 text-lg">Start Auction</div>
              <p className="text-sm text-gray-700 leading-relaxed">
                Navigate to Auction Control tab and select a player to start manual auction OR click Start Auto-Auction for automated bidding
              </p>
            </div>
          </li>

          <li className="flex gap-4 group">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 text-white flex items-center justify-center font-bold flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300">
              4
            </div>
            <div className="flex-1 pt-1">
              <div className="font-bold text-gray-900 mb-2 text-lg">Monitor & Control</div>
              <p className="text-sm text-gray-700 leading-relaxed">
                Track team connections, manage bids in real-time, and use pause/resume controls. Watch the stats bar for live progress
              </p>
            </div>
          </li>

          <li className="flex gap-4 group">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 text-white flex items-center justify-center font-bold flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300">
              5
            </div>
            <div className="flex-1 pt-1">
              <div className="font-bold text-gray-900 mb-2 text-lg">Download Results</div>
              <p className="text-sm text-gray-700 leading-relaxed">
                View team rosters in Teams tab, download individual team PDFs or download all teams at once. Undo sales if necessary
              </p>
            </div>
          </li>
        </ol>

        {/* Quick Tips */}
        <div className="mt-6 pt-6 border-t-2 border-indigo-200">
          <div className="bg-white rounded-xl p-5 border-l-4 border-indigo-600">
            <div className="flex items-start gap-3">
              <AlertTriangle className="text-indigo-600 flex-shrink-0 mt-1" size={20} />
              <div>
                <div className="font-bold text-gray-900 mb-2">Pro Tips</div>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Save team credentials immediately - PINs are shown only once</li>
                  <li>• Test captain login before starting the auction</li>
                  <li>• Use auto-auction for faster bulk player allocation</li>
                  <li>• Monitor online teams status in the stats bar</li>
                  <li>• Download team PDFs for record keeping</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;
