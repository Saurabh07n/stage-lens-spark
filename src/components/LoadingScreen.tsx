
import React, { useState, useEffect } from 'react';
import { Mic } from 'lucide-react';

const LoadingScreen: React.FC = () => {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  const loadingMessages = [
    "Analyzing your presentation style...",
    "Detecting speech patterns and clarity...",
    "Evaluating body language and gestures...",
    "Identifying key topics discussed...",
    "Measuring audience engagement potential...",
    "Processing voice modulation patterns...",
    "Examining presentation structure...",
    "Analyzing speaking pace and rhythm...",
    "Checking communication effectiveness...",
    "Assessing presentation confidence...",
    "Reviewing content organization...",
    "Identifying storytelling elements...",
    "Analyzing presentation flow...",
    "Evaluating visual engagement...",
    "Detecting key discussion points..."
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessageIndex((prev) => 
        prev === loadingMessages.length - 1 ? 0 : prev + 1
      );
    }, 3000); // Change message every 3 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-4">
      <div className="relative w-24 h-24 mb-8">
        <div className="absolute inset-0 bg-stage-purple-light rounded-full animate-pulse"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <Mic className="h-12 w-12 text-stage-purple animate-float" />
        </div>
      </div>

      <div className="text-center mb-8">
        <p 
          key={currentMessageIndex}
          className="text-gray-600 animate-fade-in min-h-[24px]"
        >
          {loadingMessages[currentMessageIndex]}
        </p>
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
