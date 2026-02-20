import React, { useState } from 'react';
import axios from 'axios';
import { User, DollarSign, Upload, CheckCircle, XCircle, Camera, Trash2 } from 'lucide-react';
import LoadingAnimation from './LoadingAnimation';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const RegistrationPanel = ({ loadData }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: 'Batsman',
    basePrice: '50'
  });
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (file) => {
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setSubmitStatus({ 
        type: 'error', 
        message: 'Photo size must be less than 5MB' 
      });
      setTimeout(() => setSubmitStatus(null), 3000);
      return;
    }
    
    if (!file.type.startsWith('image/')) {
      setSubmitStatus({ 
        type: 'error', 
        message: 'Only image files are allowed' 
      });
      setTimeout(() => setSubmitStatus(null), 3000);
      return;
    }

    setPhoto(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPhotoPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleFileInput = (e) => {
    const file = e.target.files[0];
    handlePhotoChange(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handlePhotoChange(file);
  };

  const removePhoto = () => {
    setPhoto(null);
    setPhotoPreview(null);
    // Reset file input
    const fileInput = document.getElementById('photo-input');
    if (fileInput) fileInput.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const submitData = new FormData();
      
      // Append all form fields
      Object.keys(formData).forEach(key => {
        if (formData[key]) {
          submitData.append(key, formData[key]);
        }
      });

      // Append photo
      if (photo) {
        submitData.append('photo', photo);
      }

      const response = await axios.post(`${API_URL}/players/register`, submitData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setSubmitStatus({ 
        type: 'success', 
        message: response.data.message || 'Player registered successfully!' 
      });
      
      // Reset form
      setFormData({
        name: '',
        category: 'Batsman',
        basePrice: '5'
      });
      setPhoto(null);
      setPhotoPreview(null);
      
      // Reset file input
      const fileInput = document.getElementById('photo-input');
      if (fileInput) fileInput.value = '';

      // Reload data to show new player
      if (loadData) {
        setTimeout(() => loadData(), 500);
      }

      // Clear success message after 5 seconds
      setTimeout(() => setSubmitStatus(null), 5000);
    } catch (error) {
      setSubmitStatus({ 
        type: 'error', 
        message: error.response?.data?.message || 'Registration failed. Please try again.' 
      });
      setTimeout(() => setSubmitStatus(null), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const categoryColors = {
    'Batsman': 'from-red-500 to-red-600',
    'Bowler': 'from-green-500 to-green-600',
    'All-Rounder': 'from-orange-500 to-orange-600',
    'Wicket-Keeper': 'from-blue-500 to-blue-600'
  };

  const categoryIcons = {
    'Batsman': '🏏',
    'Bowler': '⚡',
    'All-Rounder': '🌟',
    'Wicket-Keeper': '🧤'
  };

  return (
    <div className="space-y-6">
      {/* Loading Animation */}
      {isSubmitting && <LoadingAnimation message="Registering Player..." />}
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b-2 border-gray-200">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Player Registration</h2>
          <p className="text-gray-600">Register new players for the upcoming cricket auction</p>
        </div>
        <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold shadow-lg">
          <User className="mr-2" size={20} />
          Quick Add Player
        </div>
      </div>

      {/* Registration Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Photo Upload */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 border-2 border-gray-200 h-full">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Camera size={20} className="text-blue-600" />
                Player Photo
              </h3>
              
              {/* Photo Preview/Upload Area */}
              <div className="space-y-4">
                {photoPreview ? (
                  <div className="relative">
                    <div className="w-full aspect-square rounded-2xl overflow-hidden border-4 border-blue-500 shadow-xl">
                      <img 
                        src={photoPreview} 
                        alt="Preview" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={removePhoto}
                      className="absolute -top-3 -right-3 w-10 h-10 bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-red-700 transition-all duration-200 hover:scale-110"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ) : (
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`w-full aspect-square rounded-2xl border-4 border-dashed transition-all duration-200 flex flex-col items-center justify-center cursor-pointer ${
                      isDragging 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-300 bg-white hover:border-blue-400 hover:bg-blue-50'
                    }`}
                    onClick={() => document.getElementById('photo-input').click()}
                  >
                    <Upload size={48} className={`mb-4 ${isDragging ? 'text-blue-600' : 'text-gray-400'}`} />
                    <p className="text-gray-700 font-semibold mb-1">
                      {isDragging ? 'Drop photo here' : 'Upload Photo'}
                    </p>
                    <p className="text-sm text-gray-500 mb-2">
                      Click or drag & drop
                    </p>
                    <p className="text-xs text-gray-400">Max 5MB • JPG, PNG</p>
                  </div>
                )}
                
                <input
                  type="file"
                  id="photo-input"
                  accept="image/*"
                  onChange={handleFileInput}
                  className="hidden"
                />
                
                <p className="text-xs text-gray-500 text-center">
                  Photo is optional but recommended for better player identification
                </p>
              </div>
            </div>
          </div>

          {/* Right Column - Form Fields */}
          <div className="lg:col-span-2">
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 border-2 border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                <User size={20} className="text-blue-600" />
                Player Information
              </h3>

              <div className="space-y-6">
                {/* Player Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g., Virat Kohli"
                    required
                    className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-200 text-gray-900 font-medium placeholder-gray-400"
                  />
                </div>

                {/* Category Selection */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Player Category <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {Object.keys(categoryColors).map(cat => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, category: cat }))}
                        className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                          formData.category === cat
                            ? `bg-gradient-to-r ${categoryColors[cat]} text-white border-transparent shadow-lg scale-105`
                            : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400 hover:shadow-md'
                        }`}
                      >
                        <div className="flex items-center justify-center gap-2">
                          <span className="text-2xl">{categoryIcons[cat]}</span>
                          <span className="font-semibold">{cat}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Base Price */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Base Price (₹ Lakhs) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <DollarSign 
                      size={20} 
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                    />
                    <input
                      type="number"
                      name="basePrice"
                      value={formData.basePrice}
                      onChange={handleInputChange}
                      min="20"
                      max="150"
                      required
                      className="w-full pl-12 pr-4 py-3 bg-white border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-200 text-gray-900 font-bold text-lg"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Minimum: ₹20L • Maximum: ₹150L
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Status Message */}
        {submitStatus && (
          <div className={`p-4 rounded-xl border-2 flex items-center gap-3 ${
            submitStatus.type === 'success'
              ? 'bg-green-50 border-green-500 text-green-700'
              : 'bg-red-50 border-red-500 text-red-700'
          }`}>
            {submitStatus.type === 'success' ? (
              <CheckCircle size={24} className="flex-shrink-0" />
            ) : (
              <XCircle size={24} className="flex-shrink-0" />
            )}
            <p className="font-semibold">{submitStatus.message}</p>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between p-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl border-2 border-gray-200">
          <p className="text-sm text-gray-600">
            <span className="text-red-500 font-bold">*</span> Required fields. 
            Player will be added to the auction pool immediately.
          </p>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-lg shadow-lg transition-all duration-200 ${
              isSubmitting
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white hover:shadow-xl hover:scale-105'
            }`}
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                Registering...
              </>
            ) : (
              <>
                <CheckCircle size={20} />
                Register Player
              </>
            )}
          </button>
        </div>
      </form>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border-2 border-blue-200">
          <div className="text-3xl mb-2">🏏</div>
          <h4 className="font-bold text-gray-900 mb-1">Category Guide</h4>
          <p className="text-sm text-gray-600">
            Choose the primary role of the player in the team
          </p>
        </div>
        
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border-2 border-purple-200">
          <div className="text-3xl mb-2">💰</div>
          <h4 className="font-bold text-gray-900 mb-1">Base Price</h4>
          <p className="text-sm text-gray-600">
            Starting bid amount for the player in lakhs
          </p>
        </div>
        
        <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border-2 border-green-200">
          <div className="text-3xl mb-2">📸</div>
          <h4 className="font-bold text-gray-900 mb-1">Photo Upload</h4>
          <p className="text-sm text-gray-600">
            Optional but helps with player identification
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegistrationPanel;
