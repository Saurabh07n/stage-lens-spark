
import React from 'react';
import { Play } from 'lucide-react';

const LoadingScreen: React.FC = () => {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center animate-fade-in">
      <div className="relative w-24 h-24 mb-8">
        <div className="absolute inset-0 bg-stage-purple-light rounded-full animate-pulse-scale"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <Play className="h-12 w-12 text-stage-purple animate-bounce-subtle" fill="currentColor" />
        </div>
      </div>
      
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Hang tight!</h2>
      <p className="text-gray-600 text-center max-w-md mb-8">
        We're analyzing your video and crafting powerful feedback. This might take a minute!
      </p>
      
      <div className="w-64 h-2 bg-gray-200 rounded-full overflow-hidden">
        <div className="h-full bg-stage-purple rounded-full w-2/3 animate-pulse"></div>
      </div>
    </div>
  );
};

export default LoadingScreen;
