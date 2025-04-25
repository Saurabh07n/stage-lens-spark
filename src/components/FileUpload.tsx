
import React, { useState, useRef } from 'react';
import { Upload, Youtube, Video, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GEMINI_API_KEY, YT_API_KEY } from '../config/apiKeys';
import { saveFeedbackToStorage } from '../utils/feedbackStore';
import { useNavigate } from 'react-router-dom';
import UserForm, { UserFormData } from './UserForm';
import { GoogleGenAI, createUserContent, createPartFromUri } from "@google/genai";

const GEMINI_FEEDBACK_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

const basePrompt1 = `Act as a top-tier public speaking and video presentation coach. Analyze the following YouTube video and respond ONLY with a valid JSON, no extra commentary, strictly matching this format:
{
  "overallImpressions": "Concise summary of the speaker's style, tone, confidence (1-2 sentences).",
  "keyPoints": ["Main topics, points, or concepts discussed in the video"],
  "strengths": ["Bullet points on strong aspects (clarity, energy, body language, etc.)"],
  "areasOfImprovement": ["Bullet points for what can be improved (filler words, vocal variety, engagement, etc.)"],
  "practiceTips": ["Specific actionable tips (practice routines, exercises, presentation habits, confidence building, engagement techniques, etc.)"]
}
Focus on both presentation skills and the key discussion points to help viewers understand the content and delivery style.
Make sure the JSON is well-structured and can be parsed directly.`;

const basePrompt = `You're a warm, insightful top-tier, public speaking and video presentation coach. Watch the video carefully and share thoughtful, encouraging feedback to help the speaker grow. Analyze the following video and respond ONLY with a valid JSON, no extra commentary, strictly matching this format:
{
  "version": "1.0",
  "overallImpressions": "Concise summary of the speaker's style, tone, and confidence (1-2 sentences).",
  "keyPoints": ["Up to 5 main topics, points, or concepts discussed in the video"],
  "strengths": ["3-5 bullet points highlighting strong aspects like clarity, energy, body language, structure, etc."],
  "areasOfImprovement": ["3-5 bullet points suggesting improvements like vocal variety, filler words, audience engagement, etc."],
  "practiceTips": ["Specific actionable tips (exercises, habits, routines) to enhance delivery and content quality."],
  "personalityMetrics": {
    "confidence": 0-10 float,
    "clarity": 0-10 float,
    "engagement": 0-10 float,
    "vocalVariety": 0-10 float,
    "bodyLanguage": 0-10 float,
    "overallDelivery": 0-10 float
  }
}
Focus equally on presentation quality and the value of the content being communicated. Ensure the JSON is well-structured and directly parsable. Use floating point scores rounded to one decimal place for metrics.`;


type FileUploadProps = {
  onUpload: (fileOrUrl: File | string, status: string) => void;
};

function buildGeminiPrompt(ytUrl: string) {
  return {
    contents: [
      {
        parts: [
          {
            text: basePrompt}
,
          {
            file_data: {
              file_uri: ytUrl
            }
          }
        ]
      }
    ]
  }
}

function parseIsoDuration(duration: string): number {
  let match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return 0;
  const hours = parseInt(match[1] || "0", 10);
  const minutes = parseInt(match[2] || "0", 10);
  const seconds = parseInt(match[3] || "0", 10);
  return hours * 3600 + minutes * 60 + seconds;
}

function extractYouTubeVideoID(url: string): string | null {
  const regexp = /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|vi|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
  const match = url.match(regexp);
  return match ? match[1] : null;
}

function WarningModal({ open, onClose, message }: { open: boolean; onClose: () => void; message: string }) {
  if (!open) return null;
  return (
    <div className="fixed z-50 inset-0 bg-black/50 flex items-center justify-center animate-fade-in">
      <div className="bg-white px-6 py-5 rounded-xl w-full max-w-xs flex flex-col items-center shadow-lg text-center">
        <Video className="w-10 h-10 mb-2 text-red-500" />
        <div className="text-stage-purple font-bold mb-2">Hold up!</div>
        <div className="mb-4 text-gray-700">{message}</div>
        <Button onClick={onClose} className="mt-2 px-4 py-2">Got it</Button>
      </div>
    </div>
  );
}

const FileUpload: React.FC<FileUploadProps> = ({ onUpload }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [youtubeLink, setYoutubeLink] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [ytValid, setYtValid] = useState<boolean>(false);
  const [ytDuration, setYtDuration] = useState<number | null>(null);
  const [showWarning, setShowWarning] = useState(false);
  const [warningMsg, setWarningMsg] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const analyzeBtnRef = useRef<HTMLButtonElement | null>(null);
  const navigate = useNavigate();
  const [showUserForm, setShowUserForm] = useState(false);
  const [pendingAnalyze, setPendingAnalyze] = useState<"yt" | "file" | null>(null);
  const [pendingData, setPendingData] = useState<{file?: File, link?: string} | null>(null);

  const checkVideoDuration = (file: File): Promise<boolean> => {
    return new Promise((resolve) => {
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.onloadedmetadata = () => {
        window.URL.revokeObjectURL(video.src);
        const duration = video.duration;
        if (duration > 900) {
          setWarningMsg("That video’s a bit too epic.\nFor Stage Lens to work its magic, try something under 15 minutes!");
          setShowWarning(true);
          resolve(false);
        } else {
          resolve(true);
        }
      };
      video.src = URL.createObjectURL(file);
    });
  };

  const checkYoutubeDuration = async (url: string) => {
    const vid = extractYouTubeVideoID(url);
    setYtValid(false);
    setYtDuration(null);
    if (!vid) return false;
    try {
      const resp = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${vid}&key=${YT_API_KEY}`);
      const data = await resp.json();
      const contentDetails = data.items?.[0]?.contentDetails;
      if (!contentDetails) return false;
      const seconds = parseIsoDuration(contentDetails.duration);
      setYtDuration(seconds);
      if (seconds > 900) {
        setWarningMsg("That video’s a bit too epic.\nFor Stage Lens to work its magic, try something under 15 minutes!");
        setShowWarning(true);
        setYtValid(false);
        return false;
      }
      setYtValid(true);
      return true;
    } catch (e) {
      setWarningMsg("Couldn't verify YouTube video. Please check the link!");
      setShowWarning(true);
      setYtValid(false);
      return false;
    }
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type === 'video/mp4' || file.type === 'video/quicktime') {
        const isValidDuration = await checkVideoDuration(file);
        if (isValidDuration) {
          setSelectedFile(file);
          setYoutubeLink('');
        }
      } else {
        setWarningMsg('Please upload an MP4 or MOV file only.');
        setShowWarning(true);
      }
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type === 'video/mp4' || file.type === 'video/quicktime') {
        const isValidDuration = await checkVideoDuration(file);
        if (isValidDuration) {
          setSelectedFile(file);
          setYoutubeLink('');
        }
      } else {
        setWarningMsg('Please upload an MP4 or MOV file only.');
        setShowWarning(true);
      }
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleYoutubeLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setYoutubeLink(val);
    setSelectedFile(null);
    setYtValid(false);
    setYtDuration(null);
    if (val) {
      checkYoutubeDuration(val);
    }
  };

  const removeUpload = () => {
    setSelectedFile(null);
    setYoutubeLink('');
    setYtValid(false);
    setYtDuration(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeYtLink = () => {
    setYoutubeLink('');
    setYtValid(false);
    setYtDuration(null);
  };

  const closeWarning = () => setShowWarning(false);

  const parseGeminiResponse = (responseText: string): any => {
    try {
      // Clean the response text to handle code block formatting
      const cleanText = responseText
        .trim()
        .replace(/^```(?:json)?/, '')
        .replace(/```$/, '')
        .trim();
  
      const parsed = JSON.parse(cleanText);
      const requiredFields = ['overallImpressions', 'strengths', 'areasOfImprovement', 'practiceTips'];
      const isValid = requiredFields.every(field => parsed[field]);
      if (!isValid) {
        console.error("Invalid feedback structure:", parsed);
        return { error: "Incomplete feedback structure received" };
      }
      return parsed;
    } catch (err) {
      console.error('Feedback parsing error:', err);
      return {
        error: "Unable to process the video feedback. Please try again."
      };
    }
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (
      e.key === "Enter" &&
      (!analyzeBtnRef.current?.disabled)
    ) {
      analyzeBtnRef.current?.click();
    }
  };

  const handleYoutubeAnalysisFlow = async () => {
    const check = await checkYoutubeDuration(youtubeLink);
    if (!check) return;
    if (ytValid) {
      setPendingAnalyze("yt");
      setShowUserForm(true);
    }
  };

  const handleFileAnalysisFlow = async () => {
    const isValid = await checkVideoDuration(selectedFile!);
    if (!isValid) return;
    setPendingAnalyze("file");
    setShowUserForm(true);
  };

  const analyzeFileWithGemini = async (file: File): Promise<any> => {
    try {
      const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
      const myfile = await ai.files.upload({
        file,
        config: { mimeType: file.type }
      });

      if (file) {
        const durationInSec = await new Promise<number>(resolve => {
          const video = document.createElement('video');
          video.preload = 'metadata';
          video.onloadedmetadata = () => {
            window.URL.revokeObjectURL(video.src);
            resolve(video.duration);
          };
          video.src = URL.createObjectURL(file);
        });
      }

      await new Promise(resolve => setTimeout(resolve, 5000));

      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: createUserContent([
          createPartFromUri(myfile.uri, myfile.mimeType),
          basePrompt,
        ]),
      });

      const result =
        (response as any)?.text ||
        (response as any)?.candidates?.[0]?.content?.parts?.[0]?.text ||
        (response as any)?.candidates?.[0]?.content?.parts?.[0];

      if (result) return parseGeminiResponse(result);
      return { error: "Could not extract feedback from Gemini" };
    } catch (error) {
      return { error: "Failed to analyze your video, try again." };
    }
  };

  const handleAnalyze = async () => {
    if (youtubeLink) { await handleYoutubeAnalysisFlow(); return; }
    if (selectedFile) { await handleFileAnalysisFlow(); return; }
    setWarningMsg('Please upload a video file or paste a valid YouTube link!');
    setShowWarning(true);
  };

  const handleUserFormSubmit = async (userData: UserFormData) => {
    setShowUserForm(false);

    // fetch('https://n8n-webhook-url.smg', {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({
    //     user: userData,
    //     videoType: pendingAnalyze === "file" ? "upload" : "youtube",
    //     videoInfo: pendingAnalyze === "file" ? selectedFile?.name : youtubeLink
    //   })
    // }).catch(() => {});
    
    if (pendingAnalyze === "yt") {
      try {
        onUpload(youtubeLink, "loading");
        const res = await fetch(
          `${GEMINI_FEEDBACK_URL}?key=${GEMINI_API_KEY}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(buildGeminiPrompt(youtubeLink))
          }
        );
        
        const data = await res.json();
        console.log("Gemini API response:", data);
        
        let feedback = null;
        if (data && data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
          const responseText = data.candidates[0].content.parts[0].text;
          console.log("Raw response text:", responseText);
          feedback = parseGeminiResponse(responseText);
          console.log("Parsed feedback:", feedback);
        } else {
          console.error("Unexpected API response structure:", data);
          feedback = { error: "We couldn't analyze your video right now. Please try again in a moment." };
        }
        
        saveFeedbackToStorage(feedback);
        navigate('/feedback');
      } catch (e) {
        console.error("YouTube analysis error:", e);
        setWarningMsg("Unable to analyze your video. Please check your connection and try again.");
        setShowWarning(true);
      }
    } else if (pendingAnalyze === "file") {
      onUpload(selectedFile!, "loading");
      const feedback = await analyzeFileWithGemini(selectedFile!);
      saveFeedbackToStorage(feedback);
      navigate('/feedback');
    }
    setPendingAnalyze(null);
    setPendingData(null);
  };

  const handleUserFormClose = () => {
    setShowUserForm(false);
    setPendingAnalyze(null);
    setPendingData(null);
  };

  const getFileName = (file: File) => file.name.length > 20 ? `${file.name.slice(0, 17)}...` : file.name;

  return (
    <div className="w-full max-w-xl mx-auto space-y-8">
      <WarningModal open={showWarning} onClose={closeWarning} message={warningMsg} />
      <div 
        className={`group cursor-pointer transition-all duration-300 ${
          isDragging 
            ? 'border-stage-purple bg-stage-purple-light/50'
            : selectedFile
              ? 'border-stage-purple bg-stage-purple-light/30'
              : 'border-dashed border-2 border-gray-300 hover:border-stage-purple hover:bg-stage-purple-light/30'
        } rounded-xl p-8 flex flex-col items-center justify-center min-h-[160px]`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={!selectedFile && !youtubeLink ? handleDrop : undefined}
        onClick={() => {
          if (!selectedFile && !youtubeLink) fileInputRef.current?.click();
        }}
        style={{ pointerEvents: selectedFile || youtubeLink ? "none" : "auto" }}
      >
        {selectedFile ? (
          <div className="w-full flex flex-col items-center space-y-2">
            <div className="flex items-center gap-2">
              <Video className="h-10 w-10 text-stage-purple" />
              <span className="text-gray-800 font-semibold">{getFileName(selectedFile)}</span>
              <button type="button"
                onClick={(e) => { e.stopPropagation(); removeUpload(); }}
                className="ml-2 rounded-full p-1 hover:bg-gray-200 transition-colors"
                style={{ pointerEvents: "auto" }}
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="text-sm text-gray-500">Video ready for analysis</div>
          </div>
        ) : (
          <>
            <Upload className="h-12 w-12 text-stage-purple mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="text-lg font-medium mb-2">Drop your stage moment here</h3>
            <p className="text-gray-500 text-sm text-center">or click to browse (MP4, MOV, max 15min)</p>
          </>
        )}
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          accept=".mp4,.mov"
          onChange={handleFileSelect}
        />
      </div>

      <div className="text-center text-gray-500 font-medium">OR</div>

      <div className="flex flex-col space-y-4">
        <div className={`flex items-center space-x-2 p-4 rounded-lg transition-all duration-300 ${
            youtubeLink ? 'bg-stage-purple-light/50' : 'bg-stage-purple-light/30'
          } focus-within:ring-2 focus-within:ring-stage-purple`}>
          <Youtube className="h-5 w-5 text-stage-purple" />
          <input
            type="text"
            placeholder="Paste YouTube video link here"
            className="flex-1 bg-transparent outline-none border-none text-gray-700"
            value={youtubeLink}
            onChange={handleYoutubeLinkChange}
            onKeyDown={handleInputKeyDown}
            disabled={!!selectedFile}
            spellCheck={false}
            autoCorrect="off"
          />
          {youtubeLink && (
            <button type="button"
              onClick={removeYtLink}
              className="ml-2 rounded-full p-1 hover:bg-gray-200 transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          )}
        </div>
        <button
          ref={analyzeBtnRef}
          onClick={handleAnalyze}
          disabled={(!selectedFile && !youtubeLink)}
          className="w-full px-6 py-3 bg-stage-purple text-white font-bold rounded-lg hover:bg-stage-purple-dark transition"
        >Analyze Your Video</button>
      </div>
      <UserForm 
        isOpen={showUserForm} 
        onClose={handleUserFormClose} 
        onSubmit={handleUserFormSubmit} 
      />
    </div>
  );
};

export default FileUpload;
