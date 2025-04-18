
import React from 'react';
import { MessageCircle } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="mt-16 py-8 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <div className="w-8 h-8 bg-stage-purple rounded-full mr-3 flex items-center justify-center">
              <span className="text-white font-bold">S</span>
            </div>
            <p className="text-gray-600 font-sora">Made by <span className="font-semibold">SmallGroup</span></p>
          </div>
          <p className="text-gray-500 font-inter text-sm md:text-base">
            Helping voices grow. One video at a time.
          </p>
          <button 
            className="flex items-center text-gray-600 hover:text-stage-purple transition-colors mt-4 md:mt-0"
            onClick={() => window.location.href = 'mailto:contact@stagelens.com'}
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            <span className="text-sm">Get in touch</span>
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
