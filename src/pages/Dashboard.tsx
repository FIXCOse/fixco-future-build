import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    navigate('/mitt-fixco', { replace: true });
  }, [navigate]);

  return null;
};

export default Dashboard;