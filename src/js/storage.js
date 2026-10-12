/**
 * Session Storage State Manager for Multi-Page Navigation
 */

export const STORAGE_KEY = 'cns_hill_cipher_state';

/**
 * Save user inputs and operation state
 * @param {Object} state - { operation, inputText, matrix }
 */
export function saveCalculationState(state) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    console.warn('Unable to save state to sessionStorage:', err);
  }
}

/**
 * Retrieve saved calculation state
 * @returns {Object|null}
 */
export function getCalculationState() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (err) {
    console.warn('Unable to read state from sessionStorage:', err);
    return null;
  }
}

/**
 * Clear saved calculation state
 */
export function clearCalculationState() {
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.warn('Unable to clear state from sessionStorage:', err);
  }
}
