import { motion } from 'framer-motion';
import { useState, useRef } from 'react';

const CreatePost = ({ handlePostSubmit }) => {
  const [postType, setPostType] = useState('photo'); // 'photo' or 'blog'
  const [photo, setPhoto] = useState(null);
  const [tagline, setTagline] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const fileInputRef = useRef(null);

  const buttonVariants = {
    hover: { scale: 1.05 },
    tap: { scale: 0.95 }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const postData = {
      type: postType,
      isPublic,
      tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      ...(postType === 'photo' 
        ? { image: fileInputRef.current.files[0], caption: tagline }
        : { title, content }
      )
    };

    handlePostSubmit(postData);
  };

  return (
    <motion.div 
      className="bg-gray-50 p-6 rounded-lg"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="flex mb-6 space-x-4">
        <motion.button
          onClick={() => setPostType('photo')}
          className={`px-4 py-2 rounded-lg ${postType === 'photo' ? 'bg-black text-white' : 'bg-gray-200'}`}
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
        >
          Photo Post
        </motion.button>
        <motion.button
          onClick={() => setPostType('blog')}
          className={`px-4 py-2 rounded-lg ${postType === 'blog' ? 'bg-black text-white' : 'bg-gray-200'}`}
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
        >
          Blog Post
        </motion.button>
      </div>

      <form onSubmit={handleSubmit}>
        {postType === 'photo' ? (
          <>
            <div className="mb-4">
              <label className="block mb-2 font-medium">Upload Photo</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                {photo ? (
                  <img src={photo} alt="Preview" className="max-h-64 mx-auto mb-2 rounded" />
                ) : (
                  <p className="text-gray-500">Click to select an image</p>
                )}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handlePhotoChange}
                  accept="image/*"
                  className="hidden"
                  id="photo-upload"
                  required
                />
                <motion.label
                  htmlFor="photo-upload"
                  className="inline-block bg-black text-white px-4 py-2 rounded cursor-pointer"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  Choose Image
                </motion.label>
              </div>
            </div>
            <div className="mb-4">
              <label className="block mb-2 font-medium">Tagline</label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg"
                placeholder="Add a catchy caption..."
                maxLength="120"
                required
              />
            </div>
          </>
        ) : (
          <>
            <div className="mb-4">
              <label className="block mb-2 font-medium">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg"
                placeholder="Your blog title..."
                maxLength="100"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2 font-medium">Content</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg min-h-[200px]"
                placeholder="Write your thoughts..."
                required
              />
            </div>
          </>
        )}

        <div className="mb-4">
          <label className="block mb-2 font-medium">Tags (comma separated)</label>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg"
            placeholder="travel, food, photography"
          />
        </div>

        <div className="flex items-center mb-6">
          <input
            type="checkbox"
            id="isPublic"
            checked={isPublic}
            onChange={(e) => setIsPublic(e.target.checked)}
            className="mr-2"
          />
          <label htmlFor="isPublic">Make this post public</label>
        </div>

        <motion.button
          type="submit"
          className="bg-black text-white px-6 py-3 rounded-lg font-medium w-full"
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
        >
          {postType === 'photo' ? 'Share Photo' : 'Publish Blog'}
        </motion.button>
      </form>
    </motion.div>
  );
};

export default CreatePost;