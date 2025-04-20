
/**
 * Utilities for storing/fetching feedback from localStorage.
 */
const FEEDBACK_STORAGE_KEY = 'stage_lens_feedback';

export function saveFeedbackToStorage(feedback: any) {
  localStorage.setItem(FEEDBACK_STORAGE_KEY, JSON.stringify(feedback));
}

export function getFeedbackFromStorage(): any | null {
  const raw = localStorage.getItem(FEEDBACK_STORAGE_KEY);
  try {
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function clearFeedbackStorage() {
  localStorage.removeItem(FEEDBACK_STORAGE_KEY);
}
