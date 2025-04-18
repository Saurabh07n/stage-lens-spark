
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

  const handleYoutubeLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setYoutubeLink(e.target.value);
    if (e.target.value.includes('youtube.com') || e.target.value.includes('youtu.be')) {
      onUpload(e.target.value);
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
      </div>
    </div>
  );
};

export default FileUpload;
