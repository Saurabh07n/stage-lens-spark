
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Youtube, Instagram, Globe } from 'lucide-react';

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (location.pathname === '/') {
      window.location.reload();
    } else {
      navigate('/');
    }
  };

  // The correct YouTube channel
  const socialLinks = [
    { icon: Globe, href: 'https://smallgrp.com' },
    { icon: Youtube, href: 'https://www.youtube.com/@smallgrp' },
    { icon: Instagram, href: 'https://smallgrp.com' },
  ];

  return (
    <header className="bg-white border-b border-gray-100 w-full">
      <nav className="container mx-auto px-4 flex items-center h-16 justify-between">
        <div className="flex items-center">
          <button
            onClick={handleLogoClick}
            className="flex items-center space-x-2 focus:outline-none cursor-pointer group"
            style={{ background: "none", border: "none", padding: 0 }}
          >
            <span className="text-2xl font-bold text-stage-purple group-hover:underline">Stage</span>
            <span className="text-2xl font-bold text-gray-800 group-hover:underline">Lens</span>
          </button>
        </div>
        <div className="flex items-center gap-4">
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
      </nav>
    </header>
  );
};

export default Navigation;
