/**
 * Page One: Input & Configuration Controller
 * Cryptography and Network Security (CNS) Mini Project
 */

import { validateMatrix } from './matrixUtils.js';
import { saveCalculationState, getCalculationState, clearCalculationState } from './storage.js';

// Default matrix: [[7, 8], [11, 11]] (det=23, invertible mod 26)
const DEFAULT_MATRIX = [
  [7, 8],
  [11, 11]
];

/**
 * Read matrix numbers from DOM inputs
 */
function getMatrixFromInputs() {
  const k11Val = document.getElementById('k11').value.trim();
  const k12Val = document.getElementById('k12').value.trim();
  const k21Val = document.getElementById('k21').value.trim();
  const k22Val = document.getElementById('k22').value.trim();

  if (k11Val === '' || k12Val === '' || k21Val === '' || k22Val === '') {
    return { matrix: null, isComplete: false };
  }

  const k11 = parseInt(k11Val, 10);
  const k12 = parseInt(k12Val, 10);
  const k21 = parseInt(k21Val, 10);
  const k22 = parseInt(k22Val, 10);

  if (
    Number.isNaN(k11) || Number.isNaN(k12) || Number.isNaN(k21) || Number.isNaN(k22) ||
    k11 < 0 || k11 > 25 || k12 < 0 || k12 > 25 ||
    k21 < 0 || k21 > 25 || k22 < 0 || k22 > 25
  ) {
    return { matrix: null, isComplete: true, isOutOfRange: true };
  }

  return { matrix: [[k11, k12], [k21, k22]], isComplete: true, isOutOfRange: false };
}

/**
 * Set matrix values in input fields
 */
function setMatrixInputs(matrix) {
  const [[a, b], [c, d]] = matrix;
  document.getElementById('k11').value = a;
  document.getElementById('k12').value = b;
  document.getElementById('k21').value = c;
  document.getElementById('k22').value = d;
}

/**
 * Get selected operation: 'encrypt' or 'decrypt'
 */
function getSelectedOperation() {
  const selected = document.querySelector('input[name="operation"]:checked');
  return selected ? selected.value : 'encrypt';
}

/**
 * Set selected operation in UI
 */
function setSelectedOperation(operation) {
  const radio = document.querySelector(`input[name="operation"][value="${operation}"]`);
  if (radio) {
    radio.checked = true;
  }
  updateOperationUI();
}

/**
 * Update dynamic text labels and placeholders based on selected operation
 */
function updateOperationUI() {
  const op = getSelectedOperation();
  const labelEl = document.getElementById('input-text-label');
  const textareaEl = document.getElementById('input-text');
  const hintEl = document.getElementById('input-hint-text');

  if (op === 'encrypt') {
    labelEl.textContent = 'Plaintext Input (Text to Encrypt):';
    textareaEl.placeholder = 'Enter plaintext to encrypt (e.g., ACT, HELLO, CNS)...';
    hintEl.innerHTML = '<strong>Note:</strong> Non-alphabetic characters will be stripped. Letters map to numbers (A=0, B=1, &hellip;, Z=25). Odd-length plaintext will be padded with \'X\'.';
  } else {
    labelEl.textContent = 'Ciphertext Input (Text to Decrypt):';
    textareaEl.placeholder = 'Enter ciphertext to decrypt (e.g., QWFU, ZEBBW)...';
    hintEl.innerHTML = '<strong>Note:</strong> Non-alphabetic characters will be stripped. Decryption will multiply ciphertext digraphs by the calculated modular inverse key matrix K⁻¹ mod 26.';
  }

  // Update visual selection state on radio cards
  document.querySelectorAll('.operation-option').forEach(card => {
    const radio = card.querySelector('input[type="radio"]');
    if (radio && radio.checked) {
      card.classList.add('selected');
    } else {
      card.classList.remove('selected');
    }
  });
}

/**
 * Update real-time key matrix status badge & diagnostic calculations
 */
function updateDiagnostics() {
  const statusEl = document.getElementById('key-status-badge');
  const detailsEl = document.getElementById('key-details');
  const parsed = getMatrixFromInputs();

  if (!parsed.isComplete) {
    statusEl.className = 'badge status-invalid';
    statusEl.innerHTML = '<span class="dot red"></span> Incomplete Matrix';
    detailsEl.innerHTML = `
      <div class="key-stat-error">
        Please enter integer values between 0 and 25 in all four cells of the 2×2 key matrix.
      </div>
    `;
    return;
  }

  if (parsed.isOutOfRange) {
    statusEl.className = 'badge status-invalid';
    statusEl.innerHTML = '<span class="dot red"></span> Value Out of Range';
    detailsEl.innerHTML = `
      <div class="key-stat-error">
        Matrix values must be integers between 0 and 25 (A=0, B=1, &hellip;, Z=25).
      </div>
    `;
    return;
  }

  const matrix = parsed.matrix;
  const validation = validateMatrix(matrix);

  if (validation.isValid) {
    statusEl.className = 'badge status-valid';
    statusEl.innerHTML = '<span class="dot green"></span> Valid Key Matrix (Invertible mod 26)';

    const [[ik11, ik12], [ik21, ik22]] = validation.inverseMatrix;
    detailsEl.innerHTML = `
      <div class="key-stat-item"><span>det(K) = (ad - bc):</span> <strong>${validation.rawDet}</strong></div>
      <div class="key-stat-item"><span>det(K) mod 26:</span> <strong>${validation.modDet}</strong></div>
      <div class="key-stat-item"><span>gcd(det, 26):</span> <strong>${validation.gcd} (Coprime with 26)</strong></div>
      <div class="key-stat-item"><span>det⁻¹ mod 26:</span> <strong>${validation.detInv}</strong></div>
      <div class="key-stat-item"><span>K⁻¹ mod 26:</span> <strong>[[${ik11}, ${ik12}], [${ik21}, ${ik22}]]</strong></div>
    `;
  } else {
    statusEl.className = 'badge status-invalid';
    statusEl.innerHTML = '<span class="dot red"></span> Invalid Key Matrix (Not Invertible)';
    detailsEl.innerHTML = `
      <div class="key-stat-error">
        <strong>Validation Error:</strong> ${validation.errorMessage}<br>
        <span class="diagnostic-calc-sub">det(K) raw = ${validation.rawDet}, det(K) mod 26 = ${validation.modDet}, gcd(det, 26) = ${validation.gcd}</span>
      </div>
    `;
  }
}

/**
 * Display alert error message
 */
function showError(message) {
  const alertEl = document.getElementById('alert-box');
  alertEl.className = 'alert-box alert-danger';
  alertEl.innerHTML = `<strong>Validation Error:</strong> ${message}`;
  alertEl.classList.remove('hidden');
  alertEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

/**
 * Clear alert message
 */
function clearError() {
  const alertEl = document.getElementById('alert-box');
  alertEl.className = 'alert-box hidden';
  alertEl.innerHTML = '';
}

/**
 * Validate all inputs and proceed to Page 2
 */
function handleProceed() {
  clearError();

  const operation = getSelectedOperation();
  const textareaEl = document.getElementById('input-text');
  const rawText = textareaEl.value.trim();
  const sanitizedLetters = rawText.toUpperCase().replace(/[^A-Z]/g, '');

  // 1. Text input validation
  if (sanitizedLetters.length === 0) {
    showError(`Please enter valid ${operation === 'encrypt' ? 'plaintext' : 'ciphertext'} containing at least one alphabetic letter (A-Z).`);
    textareaEl.focus();
    return;
  }

  // 2. Matrix inputs validation
  const parsed = getMatrixFromInputs();
  if (!parsed.isComplete) {
    showError('Please fill in all four numeric fields for the 2×2 key matrix.');
    return;
  }

  if (parsed.isOutOfRange) {
    showError('All four key matrix values must be integers between 0 and 25.');
    return;
  }

  // 3. Matrix invertibility validation
  const matrix = parsed.matrix;
  const validation = validateMatrix(matrix);
  if (!validation.isValid) {
    showError(`Invalid Key Matrix: ${validation.errorMessage}`);
    return;
  }

  // 4. Save state & navigate to Page 2
  saveCalculationState({
    operation,
    inputText: rawText,
    matrix
  });

  window.location.href = 'results.html';
}

/**
 * Reset all fields to initial default state
 */
function handleReset() {
  clearCalculationState();
  clearError();

  document.getElementById('input-text').value = '';
  setSelectedOperation('encrypt');
  setMatrixInputs(DEFAULT_MATRIX);
  updateDiagnostics();
}

/**
 * Initialize Page 1
 */
document.addEventListener('DOMContentLoaded', () => {
  // Load previous state if available (e.g. from Back button navigation)
  const savedState = getCalculationState();
  if (savedState) {
    if (savedState.operation) {
      setSelectedOperation(savedState.operation);
    } else {
      setSelectedOperation('encrypt');
    }

    if (savedState.inputText) {
      document.getElementById('input-text').value = savedState.inputText;
    }

    if (savedState.matrix && Array.isArray(savedState.matrix)) {
      setMatrixInputs(savedState.matrix);
    } else {
      setMatrixInputs(DEFAULT_MATRIX);
    }
  } else {
    setSelectedOperation('encrypt');
    setMatrixInputs(DEFAULT_MATRIX);
  }

  updateOperationUI();
  updateDiagnostics();

  // Operation radio listeners
  document.querySelectorAll('input[name="operation"]').forEach(radio => {
    radio.addEventListener('change', () => {
      updateOperationUI();
      clearError();
    });
  });

  // Matrix inputs change listeners
  ['k11', 'k12', 'k21', 'k22'].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('input', () => {
        clearError();
        updateDiagnostics();
      });
    }
  });

  // Proceed button listener
  const btnProceed = document.getElementById('btn-proceed');
  if (btnProceed) {
    btnProceed.addEventListener('click', handleProceed);
  }

  // Reset button listener
  const btnReset = document.getElementById('btn-reset');
  if (btnReset) {
    btnReset.addEventListener('click', handleReset);
  }

  console.log('Hill Cipher Page 1 (Input & Configuration) initialized.');
});
