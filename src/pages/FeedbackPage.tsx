
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import { ArrowLeft } from 'lucide-react';
import { getFeedbackFromStorage, clearFeedbackStorage } from '../utils/feedbackStore';

const SectionCard = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="bg-white rounded-xl shadow-sm mb-6 px-6 py-5">
    <div className="font-semibold text-xm md:text-lg mb-2 text-stage-purple">{title}</div>
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
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <div className="container mx-auto px-4 py-12 flex-1 flex flex-col items-center bg-[#FAFAFB]">
        <div className="max-w-2xl w-full bg-white shadow rounded-2xl p-8 mt-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-stage-purple">AI Video Feedback</h2>
          {feedback?.error ? (
            <div className="text-red-600 font-semibold">{feedback.error}</div>
          ) : feedback ? (
            <div className="space-y-6">
              <SectionCard title="Overall Impressions">
                <p>{feedback.overallImpressions}</p>
              </SectionCard>
              <SectionCard title="Strengths">
                <ul className="list-disc pl-5">
                  {feedback.strengths?.map?.((item: string, i: number) =>
                    <li key={i}>{item}</li>
                  )}
                </ul>
              </SectionCard>
              <SectionCard title="Areas of Improvement">
                <ul className="list-disc pl-5">
                  {feedback.areasOfImprovement?.map?.((item: string, i: number) =>
                    <li key={i}>{item}</li>
                  )}
                </ul>
              </SectionCard>
              <SectionCard title="Practice Tips">
                <ul className="list-disc pl-5">
                  {feedback.practiceTips?.map?.((item: string, i: number) =>
                    <li key={i}>{item}</li>
                  )}
                </ul>
              </SectionCard>
            </div>
          ) : (
            <div className="text-gray-700">No feedback available. Please upload or analyze a video.</div>
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
