
import React from 'react';
import { Mic } from 'lucide-react';

const Hero = () => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-stage-purple-light via-white to-stage-blue-light">
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="animate-float mb-8">
          <Mic className="h-16 w-16 mx-auto text-stage-purple animate-glow" />
        </div>
        <h1 className="font-sora text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 mb-6">
          Level Up Your <span className="text-stage-purple">Speaking Game</span>
        </h1>
        <p className="font-inter text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
          Get AI-powered feedback on your public speaking and content creation. Upload your video and watch your skills grow.
        </p>
      </div>
    </div>
  );
};

export default Hero;
