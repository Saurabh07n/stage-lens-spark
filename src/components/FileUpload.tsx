
import React, { useState, useRef } from 'react';
import { Upload, Youtube } from 'lucide-react';

interface FileUploadProps {
  onUpload: (file: File | string) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onUpload }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [youtubeLink, setYoutubeLink] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type === 'video/mp4' || file.type === 'video/quicktime') {
        onUpload(file);
      } else {
        alert('Please upload an MP4 or MOV file');
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type === 'video/mp4' || file.type === 'video/quicktime') {
        onUpload(file);
      } else {
        alert('Please upload an MP4 or MOV file');
      }
    }
  };

  const handleYoutubeSubmit = () => {
    if (youtubeLink.includes('youtube.com') || youtubeLink.includes('youtu.be')) {
      onUpload(youtubeLink);
    } else {
      alert('Please enter a valid YouTube link');
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto space-y-8">
      <div 
        className={`drag-drop-area ${isDragging ? 'active' : ''} flex flex-col items-center justify-center cursor-pointer`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          accept=".mp4,.mov"
          onChange={handleFileSelect}
        />
        <Upload className="h-12 w-12 text-stage-purple mb-4" />
        <h3 className="text-lg font-medium mb-2">Drag & drop your video here</h3>
        <p className="text-gray-500 text-sm text-center">or click to browse (MP4, MOV)</p>
      </div>

      <div className="text-center text-gray-500 font-medium">OR</div>

      <div className="space-y-4">
        <div className="flex items-center space-x-2 p-3 bg-stage-purple-light/30 rounded-lg">
          <Youtube className="h-5 w-5 text-stage-purple" />
          <input
            type="text"
            placeholder="Paste YouTube video link here"
            className="flex-1 bg-transparent outline-none border-none text-gray-700"
            value={youtubeLink}
            onChange={(e) => setYoutubeLink(e.target.value)}
          />
          <button 
            onClick={handleYoutubeSubmit}
            className="bg-stage-purple text-white px-3 py-1 rounded-md text-sm"
          >
            Use
          </button>
        </div>
      </div>
    </div>
  );
};

export default FileUpload;
