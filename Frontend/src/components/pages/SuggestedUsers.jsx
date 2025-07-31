import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { auth } from '../../firebase/config';

const SuggestedUsers = ({ followedUsers, toggleFollow }) => {
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const buttonVariants = {
    hover: { scale: 1.05, transition: { duration: 0.2 } },
    tap: { scale: 0.95 }
  };

  const slideIn = {
    hidden: { x: -20, opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { duration: 0.3 } }
  };

  useEffect(() => {
    const fetchSuggestedUsers = async () => {
      try {
        const token = await auth.currentUser?.getIdToken();
        if (!token) return;

        const response = await axios.get('http://localhost:5000/api/profile/suggested', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setSuggestedUsers(response.data);
      } catch (err) {
        console.error("Error fetching suggested users:", err);
        setError("Failed to load suggested users");
      } finally {
        setLoading(false);
      }
    };

    fetchSuggestedUsers();
  }, []);

  if (loading) {
    return (
      <div className="w-full">
        <h3 className="text-lg font-semibold mb-4 border-b border-gray-700 pb-2 text-white">
          Suggested Users
        </h3>
        <div className="flex justify-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full">
        <h3 className="text-lg font-semibold mb-4 border-b border-gray-700 pb-2 text-white">
          Suggested Users
        </h3>
        <p className="text-red-400 text-sm">{error}</p>
      </div>
    );
  }

  if (suggestedUsers.length === 0) {
    return (
      <div className="w-full">
        <h3 className="text-lg font-semibold mb-4 border-b border-gray-700 pb-2 text-white">
          Suggested Users
        </h3>
        <p className="text-gray-400 text-sm">No suggestions available</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold mb-4 border-b border-gray-700 pb-2 text-white">
        Suggested Users
      </h3>
      <div className="space-y-4">
        {suggestedUsers.map((user, index) => (
          <motion.div 
            key={user._id}
            className="flex items-center justify-between bg-gray-900 p-3 rounded-lg"
            variants={slideIn}
            initial="hidden"
            animate="visible"
            transition={{ delay: index * 0.1 }}
          >
            <div className="flex items-center">
              <img 
                src={user.photo ? `http://localhost:5000/${user.photo}` : '/default-profile.png'} 
                alt={user.name} 
                className="w-10 h-10 rounded-full mr-3 object-cover"
              />
              <div>
                <p className="font-medium text-white">{user.name}</p>
                <p className="text-gray-400 text-xs">{user.bio}</p>
              </div>
            </div>
            <motion.button
              onClick={() => toggleFollow(user._id)}
              className={`px-4 py-1 text-sm rounded-full font-medium flex items-center gap-1 ${
                followedUsers.includes(user._id) 
                  ? 'bg-white text-black' 
                  : 'bg-gray-800 text-white hover:bg-gray-700'
              }`}
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              {followedUsers.includes(user._id) ? 'Following' : 'Follow'}
            </motion.button>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default SuggestedUsers;