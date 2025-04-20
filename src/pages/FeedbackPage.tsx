
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import { ArrowLeft } from 'lucide-react';
import { getFeedbackFromStorage, clearFeedbackStorage } from '../utils/feedbackStore';

const FeedbackPage = () => {
  const navigate = useNavigate();
  const [feedback, setFeedback] = useState<any | null>(null);

  useEffect(() => {
    const fb = getFeedbackFromStorage();
    setFeedback(fb);
    // Optionally clear on arrive, or on leave as needed
  }, []);

  // Optionally clear feedback storage when going back to analyze another video
  const handleBack = () => {
    clearFeedbackStorage();
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <div className="container mx-auto px-4 py-8 flex-1 flex flex-col items-center">
        <div className="w-screen bg-white shadow rounded-xl p-8 mt-6">
          <h2 className="text-2xl font-bold mb-4 text-stage-purple">AI Video Feedback</h2>
          {feedback?.error ? (
            <div className="text-red-600 font-semibold">{feedback.error}</div>
          ) : feedback ? (
            <>
              <div className="mb-4">
                <div className="font-semibold text-gray-800 mb-1">Overall Impressions:</div>
                <p className="text-gray-700">{feedback.overallImpressions}</p>
              </div>
              <div className="mb-4">
                <div className="font-semibold text-gray-800 mb-1">Strengths:</div>
                <ul className="list-disc pl-5 text-gray-700">
                  {feedback.strengths &&
                    feedback.strengths.map((item: string, i: number) => (
                      <li key={i}>{item}</li>
                    ))}
                </ul>
              </div>
              <div className="mb-4">
                <div className="font-semibold text-gray-800 mb-1">Areas of Improvement:</div>
                <ul className="list-disc pl-5 text-gray-700">
                  {feedback.areasOfImprovement &&
                    feedback.areasOfImprovement.map((item: string, i: number) => (
                      <li key={i}>{item}</li>
                    ))}
                </ul>
              </div>
              <div>
                <div className="font-semibold text-gray-800 mb-1">Practice Tips:</div>
                <ul className="list-disc pl-5 text-gray-700">
                  {feedback.practiceTips &&
                    feedback.practiceTips.map((item: string, i: number) => (
                      <li key={i}>{item}</li>
                    ))}
                </ul>
              </div>
            </>
          ) : (
            <div className="text-gray-700">No feedback available. Please upload or analyze a video.</div>
          )}
        </div>
        <div className="flex gap-4 mt-10">
          <button
            onClick={handleBack}
            className="flex items-center space-x-2 bg-stage-purple-light/30 hover:bg-stage-purple-light/50 text-stage-purple px-6 py-3 rounded-lg transition-all duration-200"
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
