
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="mt-16 py-6 border-t border-gray-100">
      <div className="container mx-auto flex justify-center items-center">
        <p className="text-gray-600 text-sm">Made by <span className="font-semibold">SmallGroup</span></p>
        {/* Placeholder for logo */}
        <div className="ml-2 w-6 h-6 bg-stage-purple rounded-full"></div>
      </div>
    </footer>
  );
};

export default Footer;
