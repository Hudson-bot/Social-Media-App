import { motion } from 'framer-motion';

const ViewPosts = ({ posts, profile }) => {
  return (
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <h3 className="text-xl font-bold mb-4">Recent Posts</h3>
      {posts.length > 0 ? (
        posts.map((post, index) => (
          <motion.div 
            key={post.id || index}
            className="border-b border-gray-200 pb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="flex items-center mb-3">
              <img 
                src={profile.photo} 
                alt="Profile" 
                className="w-10 h-10 rounded-full mr-3 object-cover"
              />
              <span className="font-medium">{profile.name}</span>
            </div>
            <p className="text-gray-800">{post.content}</p>
          </motion.div>
        ))
      ) : (
        <p className="text-gray-500">No posts yet. Create your first post!</p>
      )}
    </motion.div>
  );
};

export default ViewPosts;