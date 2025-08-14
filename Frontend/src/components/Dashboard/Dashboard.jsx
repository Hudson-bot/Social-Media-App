import { useEffect, useState } from 'react';
import axios from 'axios';
import { auth } from '../../firebase/config';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import SuggestedUsers from '../pages/SuggestedUsers';
import CreatePost from '../pages/CreatePost';
import ViewPosts from '../pages/ViewPost';

export default function Dashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('create');
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');
  const [followedUsers, setFollowedUsers] = useState([]);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profile, setProfile] = useState({
    name: '',
    bio: '',
    photo: '/default-profile.png'
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);



  // Fetch profile and posts data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await auth.currentUser?.getIdToken();
        if (!token) {
          navigate('/');
          return;
        }

        // Fetch profile
        const profileResponse = await axios.get('http://localhost:5000/api/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (profileResponse.data) {
          setProfile({
            name: profileResponse.data.name,
            bio: profileResponse.data.bio,
            photo: profileResponse.data.photo
              ? `http://localhost:5000/${profileResponse.data.photo}`
              : '/default-profile.png'
          });
        }

        // Fetch posts
        // const postsResponse = await axios.get('http://localhost:5000/api/posts', {
        //   headers: { Authorization: `Bearer ${token}` }
        // });
        // setPosts(postsResponse.data || []);

      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    if (!newPost.trim()) return;

    try {
      const token = await auth.currentUser.getIdToken();
      const response = await axios.post('http://localhost:5000/api/posts',
        { content: newPost },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setPosts([response.data, ...posts]);
      setNewPost('');
    } catch (err) {
      console.error("Error creating post:", err);
      setError("Failed to create post. Please try again.");
    }
  };

  const toggleFollow = (userId) => {
    setFollowedUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = await auth.currentUser.getIdToken();
      const formData = new FormData();

      if (profile.name) formData.append('name', profile.name);
      if (profile.bio) formData.append('bio', profile.bio);
      if (profile.photoFile) formData.append('profilePhoto', profile.photoFile);

      const response = await axios.put('http://localhost:5000/api/profile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });

      setProfile(prev => ({
        ...prev,
        name: response.data.name,
        bio: response.data.bio,
        photo: response.data.photo
          ? `http://localhost:5000/${response.data.photo}`
          : prev.photo
      }));
      setIsEditingProfile(false);
    } catch (err) {
      console.error("Error updating profile:", err);
      setError("Failed to update profile. Please try again.");
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfile(prev => ({
        ...prev,
        photo: URL.createObjectURL(file),
        photoFile: file
      }));
    }
  };

  // Animation variants
  const buttonVariants = {
    hover: { scale: 1.05, transition: { duration: 0.2 } },
    tap: { scale: 0.95 }
  };

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } }
  };

  const slideIn = {
    hidden: { x: -20, opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { duration: 0.3 } }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center p-6 bg-red-50 rounded-lg max-w-md">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-black text-white px-4 py-2 rounded"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left Profile Section */}
      <div className="w-1/4 bg-black text-white p-8 relative">
        <motion.button
          onClick={() => setIsEditingProfile(!isEditingProfile)}
          className="absolute top-4 right-4 bg-white text-black px-4 py-2 rounded-full text-sm font-medium flex items-center gap-1 shadow-md"
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
        >
          {isEditingProfile ? (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Cancel
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit
            </>
          )}
        </motion.button>

        <motion.div
          className="flex flex-col items-center mb-8"
          initial="hidden"
          animate="visible"
          variants={fadeIn}
        >
          <motion.div
            className="relative mb-4"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <img
              src={profile.photo}
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover border-4 border-white"
            />
            {isEditingProfile && (
              <label className="absolute bottom-0 right-0 bg-black text-white rounded-full p-2 cursor-pointer">
                <input
                  type="file"
                  onChange={handlePhotoChange}
                  accept="image/*"
                  className="hidden"
                />
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </label>
            )}
          </motion.div>

          {isEditingProfile ? (
            <motion.form
              onSubmit={handleProfileUpdate}
              className="w-full"
              variants={slideIn}
            >
              <input
                type="text"
                name="name"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="w-full p-2 mb-2 bg-gray-800 text-white border border-gray-700 rounded focus:outline-none focus:ring-1 focus:ring-white"
                placeholder="Your name"
                required
              />
              <textarea
                name="bio"
                value={profile.bio}
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                className="w-full p-2 mb-4 bg-gray-800 text-white border border-gray-700 rounded focus:outline-none focus:ring-1 focus:ring-white"
                rows="3"
                placeholder="Tell us about yourself"
              />
              <motion.button
                type="submit"
                className="w-full bg-white text-black py-2 rounded font-medium flex items-center justify-center gap-2"
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Save Changes
              </motion.button>
            </motion.form>
          ) : (
            <>
              <motion.h2
                className="text-2xl font-bold"
                whileHover={{ scale: 1.02 }}
              >
                {profile.name}
              </motion.h2>
              <motion.p
                className="text-gray-300 text-center mt-2 mb-8"
                whileHover={{ scale: 1.01 }}
              >
                {profile.bio}
              </motion.p>
            </>
          )}

          {/* Users to Follow Section */}
          <SuggestedUsers
            followedUsers={followedUsers}
            toggleFollow={toggleFollow}
          />
        </motion.div>
      </div>

      {/* Right Content Section */}
      <div className="w-3/4 p-8">
        {/* Post Buttons */}
        <div className="flex mb-8 space-x-4">
          <motion.button
            onClick={() => setActiveTab('create')}
            className={`px-6 py-3 font-medium rounded-lg flex items-center gap-2 ${activeTab === 'create' ? 'bg-black text-white' : 'bg-gray-100 text-black'
              }`}
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            Create Post
          </motion.button>
          <motion.button
            onClick={() => setActiveTab('view')}
            className={`px-6 py-3 font-medium rounded-lg flex items-center gap-2 ${activeTab === 'view' ? 'bg-black text-white' : 'bg-gray-100 text-black'
              }`}
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            View Posts
          </motion.button>
        </div>

        {/* Content Area */}
        {activeTab === 'create' ? (
          <CreatePost
            newPost={newPost}
            setNewPost={setNewPost}
            handlePostSubmit={handlePostSubmit}
          />
        ) : (
          <ViewPosts
            posts={posts}
            profile={profile}
          />
        )}
      </div>
    </div>
  );
}