import { Navigate } from 'react-router-dom';
import { auth } from '../../firebase/config';

export default function ProtectedRoute({ children, requireCompleteProfile = false }) {
  const user = auth.currentUser;
  
  if (!user) {
    return <Navigate to="/signin" replace />;
  }

  // In a real app, you might want to check profile completion status
  // from your backend or context instead of localStorage
  const profileComplete = localStorage.getItem('profileComplete') === 'true';

  if (requireCompleteProfile && !profileComplete) {
    return <Navigate to="/profile-setup" replace />;
  }

  return children;
}