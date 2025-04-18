
import React, { useState, useRef } from 'react';
import { Upload, Youtube } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from "@/components/ui/use-toast";

interface FileUploadProps {
  onUpload: (file: File | string) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onUpload }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [youtubeLink, setYoutubeLink] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const checkVideoDuration = (file: File): Promise<boolean> => {
    return new Promise((resolve) => {
      const video = document.createElement('video');
      video.preload = 'metadata';

      video.onloadedmetadata = () => {
        window.URL.revokeObjectURL(video.src);
        const duration = video.duration;
        if (duration > 1200) { // 20 minutes = 1200 seconds
          toast({
            title: "Whoa! That's a long performance! 🎭",
            description: "Please upload a video under 20 minutes for the best analysis experience. We want to focus on your key moments!",
            variant: "destructive",
          });
          resolve(false);
        } else {
          resolve(true);
        }
      };

      video.src = URL.createObjectURL(file);
    });
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
        }
      } else {
        alert('Please upload an MP4 or MOV file');
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
        }
      } else {
        alert('Please upload an MP4 or MOV file');
      }
    }
  };

  const handleYoutubeLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setYoutubeLink(e.target.value);
  };

  const handleAnalyze = () => {
    if (selectedFile) {
      onUpload(selectedFile);
    } else if (youtubeLink && (youtubeLink.includes('youtube.com') || youtubeLink.includes('youtu.be'))) {
      onUpload(youtubeLink);
    } else {
      alert('Please upload a video file or paste a valid YouTube link');
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto space-y-8">
      <div 
        className={`group cursor-pointer transition-all duration-300 ${
          isDragging 
            ? 'border-stage-purple bg-stage-purple-light/50' 
            : 'border-dashed border-2 border-gray-300 hover:border-stage-purple hover:bg-stage-purple-light/30'
        } rounded-xl p-8 flex flex-col items-center justify-center`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <Upload className="h-12 w-12 text-stage-purple mb-4 group-hover:scale-110 transition-transform" />
        <h3 className="text-lg font-medium mb-2">Drop your stage moment here</h3>
        <p className="text-gray-500 text-sm text-center">or click to browse (MP4, MOV)</p>
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
        <div className="flex items-center space-x-2 p-4 bg-stage-purple-light/30 rounded-lg transition-all duration-300 hover:bg-stage-purple-light/50 focus-within:ring-2 focus-within:ring-stage-purple">
          <Youtube className="h-5 w-5 text-stage-purple" />
          <input
            type="text"
            placeholder="Paste YouTube video link here"
            className="flex-1 bg-transparent outline-none border-none text-gray-700"
            value={youtubeLink}
            onChange={handleYoutubeLinkChange}
          />
        </div>

        <Button 
          onClick={handleAnalyze}
          disabled={!selectedFile && !youtubeLink}
          className="w-full"
        >
          Analyze Your Video
        </Button>
      </div>
    </div>
  );
};

export default FileUpload;

