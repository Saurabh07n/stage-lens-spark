
/**
 * Utilities for storing/fetching feedback from localStorage.
 */
const FEEDBACK_STORAGE_KEY = 'stage_lens_feedback';

export function saveFeedbackToStorage(feedback: any) {
  try {
    console.log("Saving feedback to storage:", feedback);
    localStorage.setItem(FEEDBACK_STORAGE_KEY, JSON.stringify(feedback));
  } catch (error) {
    console.error("Error saving feedback to storage:", error);
  }
}

export function getFeedbackFromStorage(): any | null {
  try {
    const raw = localStorage.getItem(FEEDBACK_STORAGE_KEY);
    console.log("Raw feedback from storage:", raw);
    const parsed = raw ? JSON.parse(raw) : null;
    console.log("Parsed feedback from storage:", parsed);
    return parsed;
  } catch (error) {
    console.error("Error getting feedback from storage:", error);
    return null;
  }
}

export function clearFeedbackStorage() {
  try {
    localStorage.removeItem(FEEDBACK_STORAGE_KEY);
  } catch (error) {
    console.error("Error clearing feedback from storage:", error);
  }
}
