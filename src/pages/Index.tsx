
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();
  
  // Redirect to dashboard
  useEffect(() => {
    navigate('/login');
  }, [navigate]);
  
  // This should never render as we redirect immediately
  return null;
};

export default Index;
