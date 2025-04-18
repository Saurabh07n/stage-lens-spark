
import React from 'react';

interface BackdropProps {
  isVisible: boolean;
  onClick: () => void;
}

const Backdrop: React.FC<BackdropProps> = ({ isVisible, onClick }) => {
  if (!isVisible) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300"
      onClick={onClick}
    />
  );
};

export default Backdrop;
