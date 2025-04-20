
import React, { useState } from 'react';
import Navigation from '../components/Navigation';
import FileUpload from '../components/FileUpload';
import UserForm from '../components/UserForm';
import LoadingScreen from '../components/LoadingScreen';
import Footer from '../components/Footer';
import Backdrop from '../components/Backdrop';
import Hero from '../components/Hero';
import { UserFormData } from '../components/UserForm';
import { useNavigate } from 'react-router-dom';

type AppState = 'upload' | 'form' | 'loading';

const Index = () => {
  const [appState, setAppState] = useState<AppState>('upload');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleUpload = (file: File | string, feedback?: any) => {
    setSelectedFile(file);
    if (feedback === "loading") {
      setLoading(true);
      setAppState('loading');
      return;
    }
    if (feedback && typeof feedback === "object") {
      setLoading(false);
      setIsFormOpen(false);
      // Do NOT show feedback on this page, handled by /feedback route after storage
      navigate('/feedback');
      return;
    }
    setIsFormOpen(true);
    setAppState('form');
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setAppState('upload');
  };

  const handleFormSubmit = (userData: UserFormData) => {
    setIsFormOpen(false);
    setAppState('loading');
    setTimeout(() => {
      navigate('/feedback');
    }, 3000);
  };

  return (
    <div className="min-h-screen flex flex-col font-inter">
      <Navigation />

      <main className="flex-1">
        {appState === 'upload' && (
          <>
            <Hero />
            <div className="container mx-auto px-4 py-12">
              <div className="max-w-2xl mx-auto">
                <FileUpload onUpload={handleUpload} />
              </div>
            </div>
          </>
        )}

        {(appState === 'loading' || loading) && <LoadingScreen />}

        <Backdrop isVisible={isFormOpen} onClick={handleFormClose} />
        <UserForm 
          isOpen={isFormOpen} 
          onClose={handleFormClose} 
          onSubmit={handleFormSubmit} 
        />

        {/* Feedback is no longer rendered inline! */}
      </main>

      <Footer />
    </div>
  );
};

export default Index;
