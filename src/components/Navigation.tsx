
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Youtube, Instagram, Globe } from 'lucide-react';

const Navigation = () => {
  const navigate = useNavigate();
  const socialLinks = [
    { icon: Globe, href: 'https://smallgrp.com' },
    { icon: Youtube, href: 'https://smallgrp.com' },
    { icon: Instagram, href: 'https://smallgrp.com' },
  ];

  return (
    <header className="py-6 border-b border-gray-100">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <button
            onClick={() => navigate('/')}
            className="font-sora text-2xl font-bold text-gray-800 bg-transparent border-none cursor-pointer outline-none p-0 m-0"
            aria-label="Go to Stage Lens Home"
            tabIndex={0}
            style={{ background: 'none' }}
          >
            <span className="text-stage-purple">Stage</span> Lens
          </button>
          <div className="flex items-center gap-4">
            <div className="flex gap-4">
              {socialLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-stage-purple transition-colors"
                >
                  <link.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navigation;
