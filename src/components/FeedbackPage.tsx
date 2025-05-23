
import React from 'react';
import { FileText, Download } from 'lucide-react';
import { getFeedbackFromStorage } from "../utils/feedbackStore";

const FeedbackPage: React.FC = () => {
  const feedbackData = getFeedbackFromStorage() || {
    overallImpressions: "You present confidently and maintain good eye contact with the camera. Your tone is engaging and consistent.",
    strengths: ["Clear articulation", "Friendly tone", "Strong use of hand gestures"],
    areasOfImprovement: ["Try to reduce filler words like 'um' and 'you know'", "Maintain more variation in pitch to emphasize key points", "Consider slowing down during complex explanations"],
    practicesTips: ["Record short daily speaking exercises", "Watch talks by favorite speakers and try mirroring their delivery", "Practice in front of friends or family for immediate feedback", "Use a metronome to practice pacing"]
  };

  const handleDownloadPDF = () => {
    alert('PDF download functionality would be implemented here');
  };

  const handleDownloadTXT = () => {
    alert('TXT download functionality would be implemented here');
  };

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Your Feedback</h1>
      
      <div className="space-y-8">
        {/* Overall Impressions */}
        <div className="feedback-card">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Overall Impressions</h2>
          <p className="text-gray-700">{feedbackData.overallImpressions}</p>
        </div>
        
        {/* Strengths */}
        <div className="feedback-card">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Strengths</h2>
          <ul className="list-disc pl-5 space-y-2">
            {feedbackData.strengths.map((strength, index) => (
              <li key={index} className="text-gray-700">{strength}</li>
            ))}
          </ul>
        </div>
        
        {/* Areas of Improvement */}
        <div className="feedback-card">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Areas of Improvement</h2>
          <ul className="list-disc pl-5 space-y-2">
            {feedbackData.areasOfImprovement.map((area, index) => (
              <li key={index} className="text-gray-700">{area}</li>
            ))}
          </ul>
        </div>
        
        {/* Suggested Practice Tips */}
        <div className="feedback-card">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Suggested Practice Tips</h2>
          <ul className="list-disc pl-5 space-y-2">
            {feedbackData.practicesTips ? feedbackData.practicesTips.map((tip, index) => (
              <li key={index} className="text-gray-700">{tip}</li>
            )) : feedbackData.practiceTips?.map((tip, index) => (
              <li key={index} className="text-gray-700">{tip}</li>
            ))}
          </ul>
        </div>
      </div>
      
      {/* Download buttons */}
      <div className="flex flex-wrap gap-4 mt-10">
        <button 
          onClick={handleDownloadPDF}
          className="flex items-center space-x-2 bg-stage-purple hover:bg-stage-purple-dark text-white px-6 py-3 rounded-lg transition-all duration-200"
        >
          <FileText className="h-5 w-5" />
          <span>Download PDF</span>
        </button>
        
        <button 
          onClick={handleDownloadTXT}
          className="flex items-center space-x-2 bg-white hover:bg-gray-100 text-gray-800 border border-gray-300 px-6 py-3 rounded-lg transition-all duration-200"
        >
          <Download className="h-5 w-5" />
          <span>Download TXT</span>
        </button>
      </div>
    </div>
  );
};

export default FeedbackPage;
