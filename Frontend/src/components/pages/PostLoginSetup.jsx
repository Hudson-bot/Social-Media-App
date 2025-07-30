import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { auth } from '../../firebase/config';

export default function PostLoginSetup() {
  const navigate = useNavigate();
  const [showSetup, setShowSetup] = useState(true);
  const [profile, setProfile] = useState({
    name: '',
    bio: '',
    photo: null,
    preview: '/default-profile.png' // Changed from external URL to local
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [isCheckingProfile, setIsCheckingProfile] = useState(true);

  // Check for existing profile on mount
  useEffect(() => {
    const checkProfile = async () => {
      try {
        const token = await auth.currentUser.getIdToken();
        const response = await axios.get('http://localhost:5000/api/profile', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (response.data) {
          // Profile exists, redirect to dashboard
          navigate('/dashboard');
        }
      } catch (error) {
        // Profile doesn't exist, show setup form
        console.log('No existing profile found');
      } finally {
        setIsCheckingProfile(false);
      }
    };

    checkProfile();
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfile(prev => ({
        ...prev,
        photo: file,
        preview: URL.createObjectURL(file)
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('name', profile.name);
      formData.append('bio', profile.bio);
      if (profile.photo) {
        formData.append('profilePhoto', profile.photo);
      }

      const token = await auth.currentUser.getIdToken();
      const response = await axios.post('http://localhost:5000/api/profile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });

      // Handle both new profile creation and existing profile cases
      if (response.data) {
        navigate('/dashboard');
      }
    } catch (err) {
      if (err.response?.status === 400 && err.response?.data?.message === 'Profile already exists') {
        // If profile exists (despite our earlier check), redirect to dashboard
        navigate('/dashboard');
      } else {
        setError(err.response?.data?.message || 'Failed to save profile');
        console.error('Profile submission error:', err);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isCheckingProfile) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Checking your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <AnimatePresence>
        {showSetup && (
          <motion.div 
            className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md"
            variants={{
              hidden: { scale: 0.9, opacity: 0 },
              visible: { 
                scale: 1, 
                opacity: 1,
                transition: { type: 'spring', damping: 20, stiffness: 300 }
              },
              exit: { scale: 0.9, opacity: 0 }
            }}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <h2 className="text-2xl font-bold text-center mb-6">Complete Your Profile</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Photo Upload */}
              <div className="flex flex-col items-center">
                <label htmlFor="photo-upload" className="cursor-pointer">
                  <motion.div whileHover={{ scale: 1.05 }} className="relative">
                    <img 
                      src={profile.preview} 
                      alt="Profile preview" 
                      className="w-32 h-32 rounded-full object-cover border-4 border-gray-200"
                    />
                    <div className="absolute bottom-0 right-0 bg-black text-white rounded-full p-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                  </motion.div>
                </label>
                <input
                  id="photo-upload"
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="hidden"
                />
                <p className="text-sm text-gray-500 mt-2">Click to upload profile photo</p>
              </div>

              {/* Name Field */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={profile.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  placeholder="Enter your name"
                />
              </div>

              {/* Bio Field */}
              <div>
                <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                  Short Bio
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  value={profile.bio}
                  onChange={handleInputChange}
                  required
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  placeholder="Tell us about yourself"
                ></textarea>
              </div>

              {/* Error Display */}
              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-500 text-sm mb-4 text-center"
                >
                  {error}
                </motion.div>
              )}

              {/* Submit Button */}
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={isSubmitting}
                className={`w-full bg-black text-white py-3 rounded-lg font-medium ${
                  isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {isSubmitting ? (
                  <>
                    <svg 
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" 
                      xmlns="http://www.w3.org/2000/svg" 
                      fill="none" 
                      viewBox="0 0 24 24"
                    >
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </>
                ) : (
                  'Continue to Dashboard'
                )}
              </motion.button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}