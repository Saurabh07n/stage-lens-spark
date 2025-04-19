
import React, { useEffect, useState } from 'react';
import { FileText, Download, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';

const FeedbackPage = () => {
  const [feedback, setFeedback] = useState<any>(null);

  useEffect(() => {
    // Load generated feedback from session storage
    const data = window.sessionStorage.getItem('feedback');
    if (data) {
      setFeedback(JSON.parse(data));
    }
  }, []);

  if (!feedback) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <div className="container mx-auto px-4 py-8 text-center flex-1 flex flex-col justify-center items-center">
          <div className="text-2xl font-semibold text-gray-800">No feedback data found!</div>
          <Link 
            to="/"
            className="mt-6 inline-flex items-center space-x-2 bg-stage-purple-light/30 hover:bg-stage-purple-light/50 text-stage-purple px-6 py-3 rounded-lg transition-all duration-200"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Analyze Another Video</span>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8 flex-1">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Your Feedback</h1>
        
        <div className="space-y-8">
          {/* Overall Impressions */}
          {feedback.overallImpressions && (
            <div className="feedback-card">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Overall Impressions</h2>
              <p className="text-gray-700">{feedback.overallImpressions}</p>
            </div>
          )}
          {/* Strengths */}
          {feedback.strengths && (
            <div className="feedback-card">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Strengths</h2>
              <ul className="list-disc pl-5 space-y-2">
                {feedback.strengths.map((item: string, idx: number) => (
                  <li className="text-gray-700" key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          )}
          {/* Areas of Improvement */}
          {feedback.areasOfImprovement && (
            <div className="feedback-card">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Areas of Improvement</h2>
              <ul className="list-disc pl-5 space-y-2">
                {feedback.areasOfImprovement.map((item: string, idx: number) => (
                  <li className="text-gray-700" key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          )}
          {/* Practice Tips */}
          {feedback.practiceTips && (
            <div className="feedback-card">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Practice Tips</h2>
              <ul className="list-disc pl-5 space-y-2">
                {feedback.practiceTips.map((item: string, idx: number) => (
                  <li className="text-gray-700" key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          )}
          {/* Engagement Suggestions */}
          {feedback.engagementSuggestions && (
            <div className="feedback-card">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Engagement Suggestions</h2>
              <ul className="list-disc pl-5 space-y-2">
                {feedback.engagementSuggestions.map((item: string, idx: number) => (
                  <li className="text-gray-700" key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex flex-wrap gap-4 mt-10">
            <Link
              to="/"
              className="flex items-center space-x-2 bg-stage-purple-light/30 hover:bg-stage-purple-light/50 text-stage-purple px-6 py-3 rounded-lg transition-all duration-200"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Analyze Another Video</span>
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default FeedbackPage;
