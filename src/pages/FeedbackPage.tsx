
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import { ArrowLeft } from 'lucide-react';
import { getFeedbackFromStorage, clearFeedbackStorage } from '../utils/feedbackStore';

const SectionCard = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="bg-white rounded-xl shadow-lg mx-auto mb-6 px-8 py-6" style={{maxWidth:'820px', width:'80%'}}>
    <div className="font-semibold text-lg mb-3 text-stage-purple">{title}</div>
    <div className="text-gray-700">{children}</div>
  </div>
);

const FeedbackPage = () => {
  const navigate = useNavigate();
  const [feedback, setFeedback] = useState<any | null>(null);

  useEffect(() => {
    const fb = getFeedbackFromStorage();
    setFeedback(fb);
  }, []);

  const handleBack = () => {
    clearFeedbackStorage();
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFB]">
      <Navigation />
      <div className="container mx-auto px-4 py-8 flex-1 flex flex-col items-center">
        <div className="w-screen bg-white shadow rounded-xl p-8 mt-6">
          <h2 className="text-2xl font-bold mb-4 text-stage-purple text-center">AI Video Feedback</h2>
          {feedback?.error ? (
            <div className="text-red-600 font-semibold bg-white rounded-lg shadow-lg px-8 py-6 w-full text-center">{feedback.error}</div>
          ) : feedback ? (
            <div className="w-full flex flex-col items-center">
              <SectionCard title="Overall Impressions">
                <p>{feedback.overallImpressions}</p>
              </SectionCard>
              <SectionCard title="Strengths">
                <ul className="list-disc pl-6 space-y-2">
                  {feedback.strengths?.map?.((item: string, i: number) =>
                    <li key={i}>{item}</li>
                  )}
                </ul>
              </SectionCard>
              <SectionCard title="Areas of Improvement">
                <ul className="list-disc pl-6 space-y-2">
                  {feedback.areasOfImprovement?.map?.((item: string, i: number) =>
                    <li key={i}>{item}</li>
                  )}
                </ul>
              </SectionCard>
              <SectionCard title="Practice Tips">
                <ul className="list-disc pl-6 space-y-2">
                  {feedback.practiceTips?.map?.((item: string, i: number) =>
                    <li key={i}>{item}</li>
                  )}
                </ul>
              </SectionCard>
            </div>
          ) : (
            <div className="text-gray-700 bg-white rounded-xl shadow-lg p-6 text-center w-full">No feedback available. Please upload or analyze a video.</div>
          )}
        </div>
        <div className="flex gap-4 mt-10">
          <button
            onClick={handleBack}
            className="flex items-center space-x-2 bg-stage-purple-light/30 hover:bg-stage-purple-light/50 text-stage-purple px-6 py-3 rounded-lg transition-all duration-200 font-semibold"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Analyze Another Video</span>
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default FeedbackPage;
