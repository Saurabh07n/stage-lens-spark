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
  const [ytFeedback, setYtFeedback] = useState<any|null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleUpload = (file: File | string, feedback?: any) => {
    setSelectedFile(file);
    if (feedback === "loading") {
      setYtFeedback(null);
      setLoading(true);
      setAppState('loading');
      return;
    }
    if (feedback && typeof feedback === "object") {
      setYtFeedback(feedback);
      setLoading(false);
      setIsFormOpen(false);
      setAppState('feedback');
      return;
    }
    setYtFeedback(null);
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

        {appState === 'feedback' && ytFeedback && (
          <div className="container max-w-xl mx-auto my-8 p-8 bg-white shadow rounded-xl">
            <h2 className="text-2xl font-bold mb-4 text-stage-purple">AI Video Feedback</h2>
            {ytFeedback.error ? (
              <div className="text-red-600 font-semibold">{ytFeedback.error}</div>
            ) : (
              <>
                <div className="mb-4">
                  <div className="font-semibold text-gray-800 mb-1">Overall Impressions:</div>
                  <p className="text-gray-700">{ytFeedback.overallImpressions}</p>
                </div>
                <div className="mb-4">
                  <div className="font-semibold text-gray-800 mb-1">Strengths:</div>
                  <ul className="list-disc pl-5 text-gray-700">
                    {ytFeedback.strengths && ytFeedback.strengths.map((item: string, i: number) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div className="mb-4">
                  <div className="font-semibold text-gray-800 mb-1">Areas of Improvement:</div>
                  <ul className="list-disc pl-5 text-gray-700">
                    {ytFeedback.areasOfImprovement && ytFeedback.areasOfImprovement.map((item: string, i: number) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <div className="font-semibold text-gray-800 mb-1">Practice Tips:</div>
                  <ul className="list-disc pl-5 text-gray-700">
                    {ytFeedback.practiceTips && ytFeedback.practiceTips.map((item: string, i: number) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
              </>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Index;
