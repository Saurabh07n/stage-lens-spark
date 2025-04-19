
import React, { useState } from 'react';
import Navigation from '../components/Navigation';
import FileUpload from '../components/FileUpload';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Store feedback temporarily
  const [feedback, setFeedback] = useState<any>(null);

  const handleFeedback = (data: any) => {
    setFeedback(data);
    // Save to session storage so FeedbackPage can access
    window.sessionStorage.setItem('feedback', JSON.stringify(data));
    navigate('/feedback');
  };

  return (
    <div className="min-h-screen flex flex-col font-inter">
      <Navigation />

      <main className="flex-1">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto">
            <FileUpload onFeedback={handleFeedback} onFetching={setIsLoading} />
            {isLoading && (
              <div className="mt-4 text-stage-purple text-lg font-medium text-center animate-pulse">
                Analyzing video, please wait...
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
