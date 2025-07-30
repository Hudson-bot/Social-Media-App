import { useEffect, useState } from 'react';
import axios from 'axios';
import { auth } from '../../firebase/config';
import { motion } from 'framer-motion';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('create');
  const [posts, setPosts] = useState([
    { id: 1, content: "Just finished my morning run! 🏃‍♂️" },
    { id: 2, content: "Working on a new project. #coding" },
  ]);
  const [newPost, setNewPost] = useState('');
  const [followedUsers, setFollowedUsers] = useState([]);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profile, setProfile] = useState({
    name: '',
    bio: '',
    photo: '/default-profile.png' 
  });

  const usersToFollow = [
    { id: 1, name: "Sarah Miller", bio: "UX Designer", photo: "https://via.placeholder.com/80" },
    { id: 2, name: "Michael Chen", bio: "Frontend Developer", photo: "https://via.placeholder.com/80" },
    { id: 3, name: "Emma Wilson", bio: "Digital Marketer", photo: "https://via.placeholder.com/80" },
  ];

  const handlePostSubmit = (e) => {
    e.preventDefault();
    if (newPost.trim()) {
      setPosts([...posts, { id: posts.length + 1, content: newPost }]);
      setNewPost('');
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const currentUser = auth.currentUser;
      if (!currentUser) {
        console.warn("User not authenticated");
        return;
      }
        const token = await auth.currentUser.getIdToken();
        const res = await axios.get(`http://localhost:5000/api/profile`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const { name, bio, photo } = res.data;

        setProfile({
          name,
          bio,
          photo: `${import.meta.env.VITE_BACKEND_URL}/${photo}`
        });

      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };

    fetchProfile();
  }, []);

  const toggleFollow = (userId) => {
    if (followedUsers.includes(userId)) {
      setFollowedUsers(followedUsers.filter(id => id !== userId));
    } else {
      setFollowedUsers([...followedUsers, userId]);
    }
  };

  const handleProfileEdit = () => {
    setIsEditingProfile(!isEditingProfile);
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    setIsEditingProfile(false);
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

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left Profile Section */}
      <div className="w-1/4 bg-black text-white p-8 relative">
        <motion.button 
          onClick={handleProfileEdit}
          className="absolute top-4 right-4 bg-white text-black px-4 py-2 rounded-full text-sm font-medium flex items-center gap-1 shadow-md"
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
          initial="hidden"
          animate="visible"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          Edit
        </motion.button>
        
        <motion.div 
          className="flex flex-col items-center mb-8"
          initial="hidden"
          animate="visible"
          variants={fadeIn}
        >
          <motion.img 
            src={profile.photo} 
            alt="Profile" 
            className="w-32 h-32 rounded-full object-cover mb-4 border-4 border-white"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          />
          
          {isEditingProfile ? (
            <motion.form 
              onSubmit={handleProfileSubmit} 
              className="w-full"
              variants={slideIn}
            >
              <input
                type="text"
                name="name"
                value={profile.name}
                onChange={handleProfileChange}
                className="w-full p-2 mb-2 bg-gray-800 text-white border border-gray-700 rounded focus:outline-none focus:ring-1 focus:ring-white"
              />
              <textarea
                name="bio"
                value={profile.bio}
                onChange={handleProfileChange}
                className="w-full p-2 mb-4 bg-gray-800 text-white border border-gray-700 rounded focus:outline-none focus:ring-1 focus:ring-white"
                rows="3"
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
          <div className="w-full">
            <h3 className="text-lg font-semibold mb-4 border-b border-gray-700 pb-2">
              Users to Follow
            </h3>
            <div className="space-y-4">
              {usersToFollow.map((user, index) => (
                <motion.div 
                  key={user.id} 
                  className="flex items-center justify-between bg-gray-900 p-3 rounded-lg"
                  variants={slideIn}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex items-center">
                    <motion.img 
                      src={user.photo} 
                      alt={user.name} 
                      className="w-10 h-10 rounded-full mr-3"
                      whileHover={{ scale: 1.1 }}
                    />
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-gray-400 text-xs">{user.bio}</p>
                    </div>
                  </div>
                  <motion.button
                    onClick={() => toggleFollow(user.id)}
                    className={`px-4 py-1 text-sm rounded-full font-medium flex items-center gap-1 ${
                      followedUsers.includes(user.id) 
                        ? 'bg-white text-black' 
                        : 'bg-gray-800 text-white hover:bg-gray-700'
                    }`}
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                  >
                    {followedUsers.includes(user.id) ? (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Following
                      </>
                    ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Follow
                      </>
                    )}
                  </motion.button>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Right Content Section */}
      <div className="w-3/4 p-8">
        {/* Post Buttons */}
        <div className="flex mb-8 space-x-4">
          <motion.button
            onClick={() => setActiveTab('create')}
            className={`px-6 py-3 font-medium rounded-lg flex items-center gap-2 ${
              activeTab === 'create' ? 'bg-black text-white' : 'bg-gray-100 text-black'
            }`}
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create Post
          </motion.button>
          <motion.button
            onClick={() => setActiveTab('view')}
            className={`px-6 py-3 font-medium rounded-lg flex items-center gap-2 ${
              activeTab === 'view' ? 'bg-black text-white' : 'bg-gray-100 text-black'
            }`}
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            View Posts
          </motion.button>
        </div>

        {/* Content Area */}
        {activeTab === 'create' ? (
          <motion.div 
            className="bg-gray-50 p-6 rounded-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-xl font-bold mb-4">Create New Post</h3>
            <form onSubmit={handlePostSubmit}>
              <textarea
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                className="w-full p-4 border border-gray-300 mb-4 rounded-lg focus:outline-none focus:ring-1 focus:ring-black"
                rows="4"
                placeholder="What's on your mind?"
              />
              <motion.button
                type="submit"
                className="bg-black text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2 mx-auto"
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                </svg>
                Post
              </motion.button>
            </form>
          </motion.div>
        ) : (
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-xl font-bold mb-4">Recent Posts</h3>
            {posts.map((post, index) => (
              <motion.div 
                key={post.id} 
                className="border-b border-gray-200 pb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-center mb-3">
                  <motion.img 
                    src={profile.photo} 
                    alt="Profile" 
                    className="w-10 h-10 rounded-full mr-3"
                    whileHover={{ scale: 1.1 }}
                  />
                  <span className="font-medium">{profile.name}</span>
                </div>
                <p className="text-gray-800">{post.content}</p>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}