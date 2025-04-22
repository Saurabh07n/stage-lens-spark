
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

  const socialLinks = [
    { icon: Globe, href: 'https://smallgrp.com', label: 'Website' },
    { icon: Youtube, href: 'https://www.youtube.com/@smallgrp', label: 'YouTube' },
    { icon: Instagram, href: 'https://smallgrp.com', label: 'Instagram' },
  ];

  return (
    <header className="bg-white border-b border-gray-100 w-full">
      <nav className="container mx-auto px-4 flex items-center h-16 justify-between">
        {/* Left: logo */}
        <div className="flex-1 flex items-center justify-start">
          <button
            onClick={handleLogoClick}
            className="flex items-center space-x-2 focus:outline-none cursor-pointer group"
            style={{ background: "none", border: "none", padding: 0 }}
          >
            <span className="text-2xl font-bold text-stage-purple group-hover:underline">Stage</span>
            <span className="text-2xl font-bold text-gray-800 group-hover:underline">Lens</span>
          </button>
        </div>
        {/* Right: social icons */}
        <div className="flex-1 flex items-center justify-end gap-4">
          {socialLinks.map((link, index) => (
            <a
              key={index}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={link.label}
              className="text-gray-600 hover:text-stage-purple transition-colors"
              onClick={link.label === "YouTube" ? undefined : undefined}
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
