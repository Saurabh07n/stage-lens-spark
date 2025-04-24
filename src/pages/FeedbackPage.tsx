
import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { getFeedbackFromStorage } from "../utils/feedbackStore";

interface FeedbackData {
  overallImpressions: string;
  strengths: string[];
  areasOfImprovement: string[];
  practiceTips: string[];
  error?: string;
}

const FeedbackPage: React.FC = () => {
  const feedback = getFeedbackFromStorage();
  const navigate = useNavigate();

  console.log("Feedback data from storage:", feedback); // Add debugging

  if (!feedback || feedback.error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh]">
        <div className="text-lg text-red-500 font-semibold mb-3">
          {feedback?.error || "No feedback available!"}
        </div>
        <button
          className="px-6 py-2 mt-2 bg-stage-purple text-white rounded-lg shadow hover:bg-stage-purple-dark"
          onClick={() => navigate("/")}
        >
          Go Back
        </button>
      </div>
    );
  }

  // Utility to render a tile
  function SectionTile({ title, children }: { title: string; children: React.ReactNode }) {
    return (
      <div className="bg-white rounded-2xl shadow-xl mx-auto my-8 p-6 md:p-10 max-w-3xl w-[75vw] flex flex-col space-y-3">
        <h2 className="text-2xl font-bold text-stage-purple mb-2">{title}</h2>
        <div className="text-gray-700">{children}</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center min-h-screen py-10 bg-gray-50">
      <div className="w-full max-w-3xl flex items-center justify-between mb-6">
        <button
          className="flex items-center text-stage-purple hover:underline"
          onClick={() => navigate("/")}
        >
          <ArrowLeft className="w-5 h-5 mr-2" />Analyze another video
        </button>
        <span className="font-bold text-xl text-gray-900">Your Video Feedback</span>
        <div />
      </div>
      <SectionTile title="Overall Impressions">
        {feedback.overallImpressions}
      </SectionTile>
      <SectionTile title="Strengths">
        <ul className="list-disc list-inside space-y-1">
          {feedback.strengths?.map((point, i) => (
            <li key={i}>{point}</li>
          ))}
        </ul>
      </SectionTile>
      <SectionTile title="Areas for Improvement">
        <ul className="list-disc list-inside space-y-1">
          {feedback.areasOfImprovement?.map((point, i) => (
            <li key={i}>{point}</li>
          ))}
        </ul>
      </SectionTile>
      <SectionTile title="Practice Tips">
        <ul className="list-disc list-inside space-y-1">
          {feedback.practiceTips?.map((point, i) => (
            <li key={i}>{point}</li>
          ))}
        </ul>
      </SectionTile>
    </div>
  );
};

export default FeedbackPage;
