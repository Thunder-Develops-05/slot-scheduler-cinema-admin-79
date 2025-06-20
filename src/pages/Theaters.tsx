
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Theaters = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to centers page as we've converted to box cricket system
    navigate('/centers', { replace: true });
  }, [navigate]);

  return null;
};

export default Theaters;
