
import React, { useState } from 'react';
import { X } from 'lucide-react';

interface UserFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (userData: UserFormData) => void;
}
export interface UserFormData {
  fullName: string;
  email: string;
  purpose: string;
  description: string;
  customTask?: string;
}

const UserForm: React.FC<UserFormProps> = ({ isOpen, onClose, onSubmit }) => {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<UserFormData>({
    fullName: '',
    email: '',
    purpose: '',
    description: '',
    customTask: '',
  });

  const purposeOptions = [
    'Practicing Public Speaking',
    'YouTube Improvement',
    'Pitch Practice',
    'Job Interview Preparation',
    'Academic Presentation',
    'Other'
  ];

  const descriptionOptions = [
    'Student',
    'Creator',
    'Speaker',
    'Professional',
    'Entrepreneur',
    'Educator',
    'Other'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNextStep = () => {
    if (step < (formData.purpose === "Other" && step === 2 ? 4 : 3)) {
      setStep(step + 1);
    } else {
      onSubmit(formData);
    }
  };

  const handlePrevStep = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  // Validate the current step
  const isCurrentStepValid = () => {
    switch (step) {
      case 0:
        return formData.fullName.trim().length > 0;
      case 1:
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(formData.email);
      case 2:
        return formData.purpose.trim().length > 0;
      case 3:
        if (formData.purpose === "Other") {
          return formData.customTask?.trim().length > 0;
        }
        return formData.description.trim().length > 0;
      case 4:
        return formData.customTask?.trim().length > 0; // "Other" extra step
      default:
        return false;
    }
  };

  return (
    <div className={`form-slide ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
      <div className="p-6 md:p-10">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800">Tell Us About Yourself</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-6 w-6" />
          </button>
        </div>
        <div className="mb-6">
          <div className="flex justify-between mb-2">
            {[0, 1, 2, 3, ...(formData.purpose === "Other" ? [4] : [])].map((i) => (
              <div 
                key={i} 
                className={`h-2 flex-1 mx-1 rounded-full ${i <= step ? 'bg-stage-purple' : 'bg-gray-200'}`}
              />
            ))}
          </div>
          <div className="text-right text-sm text-gray-500">Step {step + 1} of {formData.purpose === "Other" ? "5" : "4"}</div>
        </div>
        <div className="min-h-[250px]">
          {step === 0 && (
            <div className="space-y-4 animate-fade-in">
              <h3 className="text-xl font-medium text-gray-700">What's your name?</h3>
              <p className="text-gray-500">Let us know who we're helping today</p>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                placeholder="Full Name"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-stage-purple focus:border-transparent outline-none"
              />
            </div>
          )}
          {step === 1 && (
            <div className="space-y-4 animate-fade-in">
              <h3 className="text-xl font-medium text-gray-700">What's your email?</h3>
              <p className="text-gray-500">We'll send your feedback here</p>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Email Address"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-stage-purple focus:border-transparent outline-none"
              />
            </div>
          )}
          {step === 2 && (
            <div className="space-y-4 animate-fade-in">
              <h3 className="text-xl font-medium text-gray-700">What's your goal?</h3>
              <p className="text-gray-500">Tell us what you're preparing for</p>
              <select
                name="purpose"
                value={formData.purpose}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-stage-purple focus:border-transparent outline-none bg-white"
              >
                <option value="" disabled>Select a purpose</option>
                {purposeOptions.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
          )}
          {step === 3 && formData.purpose === "Other" && (
            <div className="space-y-4 animate-fade-in">
              <h3 className="text-xl font-medium text-gray-700">What task should we do for you?</h3>
              <p className="text-gray-500">Please describe your custom task.</p>
              <input
                type="text"
                name="customTask"
                value={formData.customTask || ""}
                onChange={handleInputChange}
                placeholder="e.g. Suggest unique ways to boost engagement"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-stage-purple focus:border-transparent outline-none"
              />
            </div>
          )}
          {(step === 3 && formData.purpose !== "Other") && (
            <div className="space-y-4 animate-fade-in">
              <h3 className="text-xl font-medium text-gray-700">How would you describe yourself?</h3>
              <p className="text-gray-500">Help us tailor our feedback to you</p>
              <select
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-stage-purple focus:border-transparent outline-none bg-white"
              >
                <option value="" disabled>Select a description</option>
                {descriptionOptions.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
          )}
        </div>
        <div className="flex justify-between mt-12">
          {step > 0 ? (
            <button
              onClick={handlePrevStep}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Back
            </button>
          ) : (
            <div></div>
          )}
          <button
            onClick={handleNextStep}
            disabled={!isCurrentStepValid()}
            className={`btn-primary ${!isCurrentStepValid() ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {step === (formData.purpose === "Other" ? 3 : 3) ? 'Start Analysis' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserForm;
