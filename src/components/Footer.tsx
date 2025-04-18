
import React from 'react';
import { Youtube, Instagram, Globe } from 'lucide-react';

const Footer = () => {
  const socialLinks = [
    { icon: Globe, href: 'https://smallgrp.com' },
    { icon: Youtube, href: 'https://smallgrp.com' },
    { icon: Instagram, href: 'https://smallgrp.com' },
  ];

  return (
    <footer className="mt-16 py-8 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center space-y-4">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-stage-purple rounded-full mr-3 flex items-center justify-center">
              <span className="text-white font-bold">S</span>
            </div>
            <p className="text-gray-600 font-sora">Powered by <span className="font-semibold">SmallGroup</span></p>
          </div>
          
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
    </footer>
  );
};

export default Footer;
