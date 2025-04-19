
import React, { useState, useRef } from 'react';
import { Upload, Youtube, Video, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from "@/components/ui/use-toast";

const YT_API_KEY = "AIzaSyBUdogLDYjPZUNTYEBiXl0ni_iIPKkuMfE";

interface FileUploadProps {
  onUpload: (file: File | string) => void;
}

function parseIsoDuration(duration: string): number {
  // Returns duration in seconds
  // Format: PT18M27S
  let match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return 0;
  const hours = parseInt(match[1] || "0", 10);
  const minutes = parseInt(match[2] || "0", 10);
  const seconds = parseInt(match[3] || "0", 10);
  return hours * 3600 + minutes * 60 + seconds;
}

function extractYouTubeVideoID(url: string): string | null {
  // Accepts various YT url formats
  const regexp = /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|vi|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
  const match = url.match(regexp);
  return match ? match[1] : null;
}

// Simple Modal
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

  const checkVideoDuration = (file: File): Promise<boolean> => {
    return new Promise((resolve) => {
      const video = document.createElement('video');
      video.preload = 'metadata';

      video.onloadedmetadata = () => {
        window.URL.revokeObjectURL(video.src);
        const duration = video.duration;
        if (duration > 900) {
          setWarningMsg("Please upload a video under 15 minutes so we can focus on your performance's best moments. Shorter videos = sharper analysis!");
          setShowWarning(true);
          resolve(false);
        } else {
          resolve(true);
        }
      };

      video.src = URL.createObjectURL(file);
    });
  };

  // Fetch YT API 
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
        setWarningMsg("The YouTube video is over 15 minutes. Please paste a link to a shorter video for best results!");
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
          setYoutubeLink(''); // remove youtube link if any
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
    // Always clear file input so user can re-select same file if needed
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

  // Remove video/file
  const removeUpload = () => {
    setSelectedFile(null);
    setYoutubeLink('');
    setYtValid(false);
    setYtDuration(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Remove just YT input
  const removeYtLink = () => {
    setYoutubeLink('');
    setYtValid(false);
    setYtDuration(null);
  };

  // Remove modal
  const closeWarning = () => setShowWarning(false);

  const handleAnalyze = async () => {
    // Check YouTube
    if (youtubeLink) {
      const check = await checkYoutubeDuration(youtubeLink);
      if (!check) return;
      if (ytValid) {
        onUpload(youtubeLink);
        return;
      }
    }
    if (selectedFile) {
      const isValid = await checkVideoDuration(selectedFile);
      if (!isValid) return;
      onUpload(selectedFile);
      return;
    }
    setWarningMsg('Please upload a video file or paste a valid YouTube link!');
    setShowWarning(true);
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
        <Button 
          onClick={handleAnalyze}
          disabled={(!selectedFile && !youtubeLink)}
          className="w-full"
        >
          Analyze Your Video
        </Button>
      </div>
    </div>
  );
};

export default FileUpload;
