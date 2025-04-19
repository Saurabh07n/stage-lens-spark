
import React, { useState } from 'react';
import { Youtube, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FileUploadProps {
  onFeedback: (feedback: any) => void;
  onFetching: (isLoading: boolean) => void;
}

function extractYouTubeVideoID(url: string): string | null {
  const regexp = /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|vi|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
  const match = url.match(regexp);
  return match ? match[1] : null;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFeedback, onFetching }) => {
  const [youtubeLink, setYoutubeLink] = useState('');
  const [error, setError] = useState('');
  const [analyzing, setAnalyzing] = useState(false);

  const validateYoutubeDuration = async (url: string): Promise<boolean> => {
    setError('');
    const apiKey = import.meta.env.VITE_YT_API_KEY;
    const vid = extractYouTubeVideoID(url);
    if (!vid) {
      setError('Please enter a valid YouTube video link.');
      return false;
    }
    try {
      const ytResp = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${vid}&key=${apiKey}`);
      const ytData = await ytResp.json();
      const duration = ytData?.items?.[0]?.contentDetails?.duration;
      if (!duration) {
        setError('Could not fetch video details. Please check the link.');
        return false;
      }
      // PT18M27S
      const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
      const hours = parseInt(match?.[1] || "0", 10);
      const minutes = parseInt(match?.[2] || "0", 10);
      const seconds = parseInt(match?.[3] || "0", 10);
      const totalSeconds = hours * 3600 + minutes * 60 + seconds;
      if (totalSeconds > 900) {
        setError("Video is over 15 minutes. Please paste a shorter YouTube video for best results!");
        return false;
      }
      return true;
    } catch {
      setError('Could not verify YouTube video. Please check the link!');
      return false;
    }
  };

  const handleAnalyze = async () => {
    setError('');
    if (!youtubeLink) {
      setError('Please paste a YouTube video link.');
      return;
    }
    onFetching(true);
    setAnalyzing(true);

    const isValid = await validateYoutubeDuration(youtubeLink);
    if (!isValid) {
      setAnalyzing(false);
      onFetching(false);
      return;
    }
    // Fetch Gemini feedback
    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY; // <-- Set this in your .env
      const videoPrompt = `Analyze the following YouTube video and reply with a JSON object with these fields: 
{
"overallImpressions": "...",
"strengths": ["..."],
"areasOfImprovement": ["..."],
"practiceTips": ["..."],
"engagementSuggestions": ["..."]
}
Provide clear advice about public speaking, video delivery, and how to gain more engagement. The field content must be highly actionable and personalized to the video's public speaking performance. Only output valid JSON, no explanations.

Video to analyze:`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  { text: `${videoPrompt}\n${youtubeLink}` },
                  { file_data: { file_uri: youtubeLink } }
                ]
              }
            ]
          }),
        });
      const json = await response.json();
      const feedbackText = json?.candidates?.[0]?.content?.parts?.[0]?.text || '';
      let feedback: any = {};
      try {
        feedback = JSON.parse(feedbackText);
      } catch {
        setError("Analysis failed. Please try again with another video.");
        setAnalyzing(false);
        onFetching(false);
        return;
      }
      onFeedback(feedback);
    } catch {
      setError("Something went wrong. Please try again!");
    }
    setAnalyzing(false);
    onFetching(false);
  };

  const handleReset = () => {
    setYoutubeLink('');
    setError('');
  };

  return (
    <div className="w-full max-w-xl mx-auto space-y-8">
      <div className="flex flex-col space-y-4">
        <div className={`flex items-center space-x-2 p-4 bg-stage-purple-light/50 rounded-lg transition-all duration-300 focus-within:ring-2 focus-within:ring-stage-purple`}>
          <Youtube className="h-5 w-5 text-stage-purple" />
          <input
            type="text"
            placeholder="Paste YouTube video link here"
            className="flex-1 bg-transparent outline-none border-none text-gray-700"
            value={youtubeLink}
            onChange={e => { setYoutubeLink(e.target.value); setError(''); }}
            spellCheck={false}
            autoCorrect="off"
            disabled={analyzing}
          />
          {youtubeLink && (
            <button
              type="button"
              onClick={handleReset}
              className="ml-2 rounded-full p-1 hover:bg-gray-200 transition-colors"
              disabled={analyzing}
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          )}
        </div>
        <Button
          onClick={handleAnalyze}
          disabled={!youtubeLink || analyzing}
          className="w-full"
        >
          {analyzing ? "Analyzing..." : "Analyze Your Video"}
        </Button>
        {error && (
          <div className="bg-red-100 text-red-700 mt-2 p-2 rounded text-center font-medium animate-in fade-in">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUpload;
