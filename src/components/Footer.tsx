
import React from 'react';
import { Youtube, Instagram, Globe } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="mt-16 py-8 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center space-y-4">
          <span className="text-gray-600 font-sora">
            <span className="font-bold text-stage-purple">Stage </span><span className="font-bold">Lens</span> powered by{' '}
            <a
              href="https://smallgrp.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-gray-900 transition-colors hover:text-stage-purple underline underline-offset-2"
            >
              SmallGroup
            </a>
          </span>
          <div className="flex gap-4">
            <a href="https://smallgrp.com" target="_blank" rel="noopener noreferrer" aria-label="Website">
              <Globe className="w-5 h-5 text-gray-600 hover:text-stage-purple transition-colors" />
            </a>
            <a href="https://smallgrp.com" target="_blank" rel="noopener noreferrer" aria-label="Youtube">
              <Youtube className="w-5 h-5 text-gray-600 hover:text-stage-purple transition-colors" />
            </a>
            <a href="https://smallgrp.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <Instagram className="w-5 h-5 text-gray-600 hover:text-stage-purple transition-colors" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
