
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

  // Restore file upload drag/drop related states
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);

  // Drag-drop handlers (restored)
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleSetFile(file);
    }
  };

  const handleSetFile = (file: File) => {
    setError('');
    if (file.type.startsWith('video/')) {
      // Check duration using a video element
      const url = URL.createObjectURL(file);
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.src = url;
      video.onloadedmetadata = () => {
        // duration in seconds
        const duration = video.duration;
        URL.revokeObjectURL(url);
        if (duration > 900) {
          setError("Video is over 15 minutes. Please upload a shorter video for best results!");
          setUploadedFile(null);
          setFileUrl(null);
        } else {
          setUploadedFile(file);
          setFileUrl(url);
        }
      };
    } else {
      setError('Only video files are allowed.');
    }
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
    setFileUrl(null);
    setError('');
  };

  // YouTube duration validation
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

  // New Gemini Prompt
  const getGeminiPrompt = (youtubeUrl: string) => {
    return `Analyze the public speaking and delivery of the presenter in this YouTube video. Reply only with VALID JSON for the following fields:
{
  "overallImpressions": string (your overall assessment including confidence, clarity, and audience presence),
  "strengths": [string, ...] (list of major speaking strengths observed, actionable & specific),
  "areasOfImprovement": [string, ...] (areas to improve, phrased as advice and always actionable),
  "practiceTips": [string, ...] (practical tips this creator can use to get better at speaking/delivery and engagement),
  "engagementSuggestions": [string, ...] (ways to make content more engaging for the audience)
}
Do not wrap the JSON in code blocks. Give detailed, tailored feedback for the speaker's on-screen presence and delivery — focus on public speaking, clarity, confidence, pacing, and engagement, referencing video moments if possible.

The video to analyze: ${youtubeUrl}`;
  };

  const handleAnalyze = async () => {
    setError('');
    if (!youtubeLink && !uploadedFile) {
      setError('Please paste a YouTube video link or upload a video file.');
      return;
    }
    onFetching(true);
    setAnalyzing(true);

    // Priority: YouTube link
    if (youtubeLink) {
      const isValid = await validateYoutubeDuration(youtubeLink);
      if (!isValid) {
        setAnalyzing(false);
        onFetching(false);
        return;
      }
      // Call Gemini API as per new requirements
      try {
        const apiKey = import.meta.env.VITE_GEMINI_API_KEY; // Set this in your .env 
        const videoPrompt = getGeminiPrompt(youtubeLink);

        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              contents: [
                {
                  parts: [
                    { text: videoPrompt },
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
      return;
    }
    // Legacy: Custom video upload
    if (uploadedFile) {
      // No live AI feedback for uploads, can be extended in future
      setError("Only YouTube link analysis is currently supported.");
    }
    setAnalyzing(false);
    onFetching(false);
  };

  const handleReset = () => {
    setYoutubeLink('');
    setError('');
  };

  // Drag events
  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
  };

  return (
    <div className="w-full max-w-xl mx-auto space-y-8">
      <div className="flex flex-col space-y-4">
        {/* YouTube link input */}
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
        {/* OR divider */}
        <div className="relative flex items-center">
          <span className="flex-shrink-0 text-gray-400 px-2 bg-white z-10 text-sm">OR</span>
          <span className="flex-grow border-t border-gray-200 absolute left-0 right-0 top-1/2 -z-0" />
        </div>
        {/* Drag-drop area */}
        <label
          className={`drag-drop-area flex flex-col items-center justify-center cursor-pointer relative ${uploadedFile ? 'opacity-80' : ''}`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          {!uploadedFile ? (
            <>
              <svg width={32} height={32} fill="none" className="mb-2 text-stage-purple" viewBox="0 0 24 24"><path fill="currentColor" d="M12 16v-7m0 0-3 3m3-3 3 3"/><circle cx={12} cy={12} r={9} stroke="currentColor" strokeWidth={2}/></svg>
              <p className="mb-2 text-sm text-gray-600">Drag &amp; drop a video file, or <span className="underline">browse</span></p>
              <input
                type="file"
                accept="video/*"
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={handleFileChange}
                disabled={!!uploadedFile || analyzing}
                tabIndex={-1}
              />
            </>
          ) : (
            <div className="flex flex-col items-center space-y-2 w-full">
              <video src={fileUrl!} controls className="rounded-xl mb-2 w-full max-h-56 object-contain" />
              <div className="text-sm text-gray-700 truncate w-full">{uploadedFile.name}</div>
              <button
                type="button"
                onClick={handleRemoveFile}
                className="absolute top-2 right-2 bg-white rounded-full p-1 shadow hover:bg-gray-100"
                aria-label="Remove video"
                disabled={analyzing}
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>
          )}
        </label>
        <Button
          onClick={handleAnalyze}
          disabled={analyzing || (!youtubeLink && !uploadedFile)}
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
