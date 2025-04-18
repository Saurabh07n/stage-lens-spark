import React, { useState } from 'react';
import FileUpload from '../components/FileUpload';
import UserForm from '../components/UserForm';
import LoadingScreen from '../components/LoadingScreen';
import FeedbackPage from '../components/FeedbackPage';
import Footer from '../components/Footer';
import Backdrop from '../components/Backdrop';
import Hero from '../components/Hero';
import { UserFormData } from '../components/UserForm';
import { Play } from 'lucide-react';

type AppState = 'upload' | 'form' | 'loading' | 'feedback';

const Index = () => {
  const [appState, setAppState] = useState<AppState>('upload');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | string | null>(null);

  const handleUpload = (file: File | string) => {
    setSelectedFile(file);
  };

  const handleAnalyzeClick = () => {
    if (selectedFile) {
      setIsFormOpen(true);
      setAppState('form');
    } else {
      alert('Please upload a video or paste a YouTube link first');
    }
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setAppState('upload');
  };

  const handleFormSubmit = (userData: UserFormData) => {
    setIsFormOpen(false);
    setAppState('loading');
    
    // Simulate loading time
    setTimeout(() => {
      setAppState('feedback');
    }, 3000);
  };

  return (
    <div className="min-h-screen flex flex-col font-inter">
      <header className="py-6 border-b border-gray-100">
        <div className="container mx-auto px-4">
          <h1 className="font-sora text-3xl font-bold text-center text-gray-800">
            <span className="text-stage-purple">Stage</span> Lens
          </h1>
          <p className="text-center text-gray-600 mt-2 font-inter">
            Improve your public speaking with AI-powered feedback
          </p>
        </div>
      </header>

      <main className="flex-1">
        {appState === 'upload' && (
          <>
            <Hero />
            <div className="container mx-auto px-4 py-12">
              <div className="max-w-2xl mx-auto">
                <FileUpload onUpload={handleUpload} />
                <div className="mt-8 text-center">
                  <button
                    className="btn-primary flex items-center space-x-2 mx-auto hover:scale-105 transition-transform"
                    onClick={handleAnalyzeClick}
                  >
                    <Play className="h-5 w-5" />
                    <span>Analyze My Video</span>
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

        {appState === 'loading' && <LoadingScreen />}
        
        {appState === 'feedback' && <FeedbackPage />}

        <Backdrop isVisible={isFormOpen} onClick={handleFormClose} />
        <UserForm 
          isOpen={isFormOpen} 
          onClose={handleFormClose} 
          onSubmit={handleFormSubmit} 
        />
      </main>

      <Footer />
    </div>
  );
};

export default Index;
