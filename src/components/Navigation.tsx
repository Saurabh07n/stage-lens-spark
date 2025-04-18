
import React from 'react';
import { Link } from 'react-router-dom';
import { Youtube, Instagram, Globe } from 'lucide-react';

const Navigation = () => {
  const socialLinks = [
    { icon: Globe, href: 'https://smallgrp.com' },
    { icon: Youtube, href: 'https://smallgrp.com' },
    { icon: Instagram, href: 'https://smallgrp.com' },
  ];

  return (
    <header className="py-6 border-b border-gray-100">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="font-sora text-2xl font-bold text-gray-800">
            <span className="text-stage-purple">Stage</span> Lens
          </Link>
          
          <div className="flex items-center gap-6">
            {/* SmallGroup Logo */}
            <div className="flex items-center">
              <div className="w-8 h-8 bg-stage-purple rounded-full flex items-center justify-center">
                <span className="text-white font-bold">S</span>
              </div>
            </div>
            
            {/* Social Icons */}
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
