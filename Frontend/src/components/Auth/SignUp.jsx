import { useState } from "react";
import { auth, googleProvider } from "../../firebase/config";
import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { saveUserData } from "../../services/api";

export default function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleGoogleSignUp = async () => {
    try {
      setIsSubmitting(true);
      setError("");
      const result = await signInWithPopup(auth, googleProvider);
      
      // Get the Firebase token
      const token = await result.user.getIdToken();
      
      // Save user data to MongoDB
      await saveUserData({
        uid: result.user.uid,
        email: result.user.email,
        name: result.user.displayName || name || "User",
      });
      
      // Redirect to dashboard or home page
      navigate("/");
    } catch (err) {
      setError(err.message || "Google sign up failed");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEmailSignUp = async (e) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      setError("");
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Get the Firebase token
      const token = await userCredential.user.getIdToken();
      
      // Save user data to MongoDB
      await saveUserData({
        uid: userCredential.user.uid,
        email,
        name,
      });
      
      navigate("/");
    } catch (err) {
      setError(err.message || "Email sign up failed");
      console.error("Sign up error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center min-h-screen bg-white"
    >
      <div className="w-full max-w-md px-6 py-8 bg-black text-white rounded-lg shadow-xl">
        <motion.h1 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-3xl font-bold mb-8 text-center"
        >
          Create Account
        </motion.h1>
        
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-4 p-3 bg-red-500/20 text-red-500 rounded-lg text-sm"
          >
            {error}
          </motion.div>
        )}
        
        <form onSubmit={handleEmailSignUp} className="space-y-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
              placeholder="Full Name"
              type="text"
              required
            />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
              placeholder="Email"
              type="email"
              required
            />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
              placeholder="Password"
              type="password"
              required
              minLength="6"
            />
          </motion.div>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-white text-black font-medium rounded-lg transition-colors hover:bg-gray-200 disabled:opacity-70"
          >
            {isSubmitting ? "Creating Account..." : "Sign Up"}
          </motion.button>
        </form>
        
        <div className="flex items-center my-6">
          <div className="flex-1 h-px bg-gray-700"></div>
          <span className="px-3 text-gray-400">OR</span>
          <div className="flex-1 h-px bg-gray-700"></div>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleGoogleSignUp}
          disabled={isSubmitting}
          className="w-full flex items-center justify-center py-3 bg-gray-900 border border-gray-700 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-70"
        >
          <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Sign up with Google
        </motion.button>
        
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6 text-center text-gray-400"
        >
          Already have an account?{" "}
          <Link to="/" className="text-white hover:underline transition-colors">
            Login
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );
}