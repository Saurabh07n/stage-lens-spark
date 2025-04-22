
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

  const [descriptionOtherText, setDescriptionOtherText] = useState("");
  const [purposeOtherText, setPurposeOtherText] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'descriptionOther') {
      setDescriptionOtherText(value);
      setFormData(prev => ({
        ...prev,
        description: "Other",
        customTask: prev.customTask
      }));
    } else if (name === 'purposeOther') {
      setPurposeOtherText(value);
      setFormData(prev => ({
        ...prev,
        purpose: "Other",
        customTask: prev.customTask
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // On Next/Start Analysis, only submit if all required fields are filled. If "Other" is selected and described, Finish.
  const handleNextStep = () => {
    // Step 0: Name, Step 1: Email, Step 2: Purpose, Step 3: Description (may be "Other")
    if (step === 2 && formData.purpose === "Other") {
      setStep(3); // Show description step if not already there
      return;
    }
    // Show custom input for description if "Other"
    if (step === 3 && formData.description === "Other") {
      // Do not increment further, just submit if text is filled
      if (descriptionOtherText.trim().length > 0) {
        onSubmit({
          ...formData,
          purpose: purposeOtherText || formData.purpose,
          description: descriptionOtherText,
          customTask: formData.customTask,
        });
      }
      return;
    }
    // If step==3 and no "Other"
    if (step === 3 && formData.description !== "Other") {
      onSubmit({
        ...formData,
        purpose: purposeOtherText || formData.purpose,
        description: descriptionOtherText || formData.description,
        customTask: formData.customTask,
      });
      return;
    }
    // All other cases (steps 0,1,2 inc) go to next step
    if (step < 3) {
      setStep(step + 1);
    } else {
      // Final fallback submit (should not be hit, but for safety)
      onSubmit({
        ...formData,
        purpose: purposeOtherText || formData.purpose,
        description: descriptionOtherText || formData.description,
        customTask: formData.customTask,
      });
    }
  };

  const handlePrevStep = () => {
    setStep(prev => (prev > 0 ? prev - 1 : 0));
  };

  // Validation per step (ensure Other text is provided if shown)
  const isCurrentStepValid = () => {
    switch (step) {
      case 0:
        return formData.fullName.trim().length > 0;
      case 1:
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(formData.email);
      case 2:
        if (formData.purpose === "Other") {
          return purposeOtherText.trim().length > 0;
        }
        return formData.purpose.trim().length > 0;
      case 3:
        if (formData.description === "Other") {
          return descriptionOtherText.trim().length > 0;
        }
        return formData.description.trim().length > 0;
      default:
        return false;
    }
  };

  // Change button label logic to always show 'Start Analysis' on last step
  const isFinalStep = () => {
    // If current step is description and description is not "Other"
    if (step === 3 && formData.description !== "Other") return true;
    // If current step is description and description is "Other"
    if (step === 3 && formData.description === "Other") return true;
    return false;
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
            {(() => {
              let totalSteps = 3;
              if (formData.purpose === "Other") totalSteps++;
              if (formData.description === "Other") totalSteps++;
              return [...Array(totalSteps + 1)].map((_, i) => (
                <div 
                  key={i} 
                  className={`h-2 flex-1 mx-1 rounded-full ${i <= step ? 'bg-stage-purple' : 'bg-gray-200'}`}
                />
              ));
            })()}
          </div>
          <div className="text-right text-sm text-gray-500">
            Step {step + 1} of {
              1 +
              1 +
              1 +
              (formData.purpose === "Other" ? 1 : 0) +
              (formData.description === "Other" ? 1 : 0)
            }
          </div>
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
              {formData.purpose === "Other" && (
                <input
                  type="text"
                  name="purposeOther"
                  value={purposeOtherText}
                  onChange={handleInputChange}
                  placeholder="Please describe your purpose"
                  className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-stage-purple focus:border-transparent outline-none"
                />
              )}
            </div>
          )}
          {step === 3 && (
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
              {formData.description === "Other" && (
                <input
                  type="text"
                  name="descriptionOther"
                  value={descriptionOtherText}
                  onChange={handleInputChange}
                  placeholder="Please describe yourself"
                  className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-stage-purple focus:border-transparent outline-none"
                />
              )}
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
            {isFinalStep() ? 'Start Analysis' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserForm;

