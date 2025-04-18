
import React from 'react';
import { Mic } from 'lucide-react';

const LoadingScreen: React.FC = () => {
  const loadingMessages = [
    "Tuning into your voice...",
    "Breaking down your body language...",
    "Analyzing your presentation style...",
    "Crafting personalized feedback..."
  ];

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-4">
      <div className="relative w-24 h-24 mb-8">
        <div className="absolute inset-0 bg-stage-purple-light rounded-full animate-pulse"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <Mic className="h-12 w-12 text-stage-purple animate-float" />
        </div>
      </div>

      <div className="space-y-2 text-center mb-8">
        {loadingMessages.map((message, index) => (
          <p 
            key={index}
            className="text-gray-600 animate-fade-in"
            style={{ animationDelay: `${index * 0.5}s` }}
          >
            {message}
          </p>
        ))}
      </div>
      
      <div className="flex space-x-2 mb-8">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="w-2 h-8 bg-stage-purple rounded-full animate-wave"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>

      <div className="w-64 h-2 bg-gray-200 rounded-full overflow-hidden">
        <div className="h-full bg-stage-purple rounded-full animate-[loading_2s_ease-in-out_infinite]" 
             style={{width: '75%'}} />
      </div>
    </div>
  );
};

export default LoadingScreen;
