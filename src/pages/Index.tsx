
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

type AppState = 'upload' | 'form' | 'loading' | 'feedback';

const Index = () => {
  const [appState, setAppState] = useState<AppState>('upload');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | string | null>(null);
  const navigate = useNavigate();

  const handleUpload = (file: File | string) => {
    setSelectedFile(file);
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
    
    // Simulate loading time
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

        {appState === 'loading' && <LoadingScreen />}

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
