/**
 * UI Renderer, Event Handlers, & Step-by-Step Math Presentation
 */

import {
  mod,
  validateMatrix,
  generateValidKey,
  keyStringToMatrix,
  matrixToKeyString
} from './matrixUtils.js';

import { encryptHill, decryptHill } from './hillCipher.js';

// Sample Presets for quick Viva Demo
export const PRESETS = {
  HILL: { name: 'HILL [[7, 8], [11, 11]]', matrix: [[7, 8], [11, 11]], sample: 'ACT' },
  GYBN: { name: 'GYBN [[6, 24], [1, 13]]', matrix: [[6, 24], [1, 13]], sample: 'HELP' },
  BACK: { name: 'BACK [[1, 0], [2, 10]]', matrix: [[1, 0], [2, 10]], sample: 'EXAM' },
  CODE: { name: 'CODE [[2, 14], [3, 4]]', matrix: [[2, 14], [3, 4]], sample: 'CNS' }
};

let currentResult = null;

// Get current 2x2 matrix from UI grid
export function getMatrixFromInputs() {
  const k11 = parseInt(document.getElementById('k11').value, 10) || 0;
  const k12 = parseInt(document.getElementById('k12').value, 10) || 0;
  const k21 = parseInt(document.getElementById('k21').value, 10) || 0;
  const k22 = parseInt(document.getElementById('k22').value, 10) || 0;
  return [[k11, k12], [k21, k22]];
}

// Set matrix grid inputs
export function setMatrixInputs(matrix) {
  const [[a, b], [c, d]] = matrix;
  document.getElementById('k11').value = a;
  document.getElementById('k12').value = b;
  document.getElementById('k21').value = c;
  document.getElementById('k22').value = d;
  updateKeyStatus();
}

// Update live status badge and inverse preview
export function updateKeyStatus() {
  const matrix = getMatrixFromInputs();
  const validation = validateMatrix(matrix);
  const statusEl = document.getElementById('key-status-badge');
  const detailsEl = document.getElementById('key-details');
  const keyWordEl = document.getElementById('key-word-input');

  // Sync key string preview
  keyWordEl.value = matrixToKeyString(matrix);

  if (validation.isValid) {
    statusEl.className = 'badge status-valid';
    statusEl.innerHTML = '<span class="dot green"></span> Valid Key Matrix';
    
    const [[ik11, ik12], [ik21, ik22]] = validation.inverseMatrix;
    detailsEl.innerHTML = `
      <div class="key-stat-item"><span>det(K) mod 26:</span> <strong>${validation.modDet}</strong></div>
      <div class="key-stat-item"><span>gcd(det, 26):</span> <strong>${validation.gcd}</strong></div>
      <div class="key-stat-item"><span>det⁻¹ mod 26:</span> <strong>${validation.detInv}</strong></div>
      <div class="key-stat-item"><span>K⁻¹ mod 26:</span> <strong>[[${ik11}, ${ik12}], [${ik21}, ${ik22}]]</strong></div>
    `;
  } else {
    statusEl.className = 'badge status-invalid';
    statusEl.innerHTML = '<span class="dot red"></span> Invalid Key Matrix';
    detailsEl.innerHTML = `
      <div class="key-stat-error">
        <strong>Invalid Matrix:</strong> ${validation.errorMessage}<br>
        <span style="font-size: 0.8rem; color: #7F1D1D;">det(K) raw = ${validation.rawDet}, mod 26 = ${validation.modDet}, gcd(det, 26) = ${validation.gcd}</span>
      </div>
    `;
  }
}

// Render mathematical calculation steps for viva demonstration
export function renderSteps(result) {
  const container = document.getElementById('steps-container');
  if (!result || !result.success) {
    container.innerHTML = `
      <div class="placeholder-steps">
        <p>Enter text and a valid Key Matrix, then click <strong>Encrypt Text</strong> or <strong>Decrypt Text</strong> to view step-by-step mathematical calculations for your viva demonstration.</p>
      </div>
    `;
    return;
  }

  const { mode, keyMatrix, validation, digraphSteps, padded, plaintextCleaned, ciphertextCleaned, ciphertext, plaintext } = result;
  const [[k11, k12], [k21, k22]] = keyMatrix;
  const [[ik11, ik12], [ik21, ik22]] = validation.inverseMatrix;

  let html = `
    <div class="steps-header">
      <span class="mode-tag ${mode.toLowerCase()}">${mode} Demonstration</span>
      <h3>Mathematical Execution Breakdown</h3>
    </div>

    <!-- Step 1: Text Digraph Preparation -->
    <div class="step-card">
      <div class="step-title">Step 1: Text Digraph Pair Preparation</div>
      <p>Convert text into uppercase alphabetic pairs. Alphabets map to numbers (A=0, B=1, ..., Z=25).</p>
      <div class="step-box">
        <div><strong>Input Text:</strong> <code>${mode === 'Encryption' ? plaintextCleaned : ciphertextCleaned}</code></div>
        ${padded ? `<div class="pad-alert">Note: Input text length was odd. Padded with 'X' at the end.</div>` : ''}
        <div><strong>Resulting Pair(s):</strong> [ ${digraphSteps.map(s => `"${s.pairText}"`).join(', ')} ]</div>
      </div>
    </div>

    <!-- Step 2: Key Matrix & Inversion Analysis -->
    <div class="step-card">
      <div class="step-title">Step 2: Key Matrix Analysis & Modular Inversion</div>
      <p>Formula for 2×2 matrix determinant and modular inverse mod 26:</p>
      <div class="math-box">
        <div>det(K) = (a &times; d &minus; b &times; c) mod 26</div>
        <div>det(K) = (${k11} &times; ${k22} &minus; ${k12} &times; ${k21}) = ${validation.rawDet} &equiv; ${validation.modDet} (mod 26)</div>
        <div>gcd(${validation.modDet}, 26) = ${validation.gcd} &rarr; Valid & Coprime with 26</div>
        <div>det⁻¹(K) &equiv; ${validation.detInv} (mod 26)</div>
      </div>

      <div class="matrix-grid-display">
        <div class="matrix-unit">
          <label>Key Matrix K:</label>
          <div class="matrix-bracket">
            <div><span>${k11}</span><span>${k12}</span></div>
            <div><span>${k21}</span><span>${k22}</span></div>
          </div>
        </div>

        <div class="matrix-unit">
          <label>Adjugate Matrix adj(K):</label>
          <div class="matrix-bracket">
            <div><span>${k22}</span><span>${mod(-k12, 26)}</span></div>
            <div><span>${mod(-k21, 26)}</span><span>${k11}</span></div>
          </div>
        </div>

        <div class="matrix-unit">
          <label>Inverse Key Matrix K⁻¹ mod 26:</label>
          <div class="matrix-bracket inverse">
            <div><span>${ik11}</span><span>${ik12}</span></div>
            <div><span>${ik21}</span><span>${ik22}</span></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Step 3: Digraph Matrix Multiplication -->
    <div class="step-card">
      <div class="step-title">Step 3: Vector-Matrix Multiplication for Each Digraph</div>
      <p>Formula used: <code>${mode === 'Encryption' ? 'C = (K × P) mod 26' : 'P = (K⁻¹ × C) mod 26'}</code></p>
      <div class="digraph-table-wrapper">
        <table class="digraph-table">
          <thead>
            <tr>
              <th>Pair #</th>
              <th>Digraph</th>
              <th>Vector Pair</th>
              <th>Matrix Calculation Step</th>
              <th>Mod 26 Result</th>
              <th>Output Letters</th>
            </tr>
          </thead>
          <tbody>
  `;

  digraphSteps.forEach(step => {
    if (mode === 'Encryption') {
      html += `
        <tr>
          <td>#${step.pairIndex}</td>
          <td><span class="pair-badge">${step.pairText}</span></td>
          <td><code>[ ${step.p1}, ${step.p2} ]ᵀ</code></td>
          <td class="calc-cell">
            C₁ = ${step.calc1}<br>
            C₂ = ${step.calc2}
          </td>
          <td><code>[ ${step.c1}, ${step.c2} ]</code></td>
          <td><strong class="out-letters">${step.outText}</strong></td>
        </tr>
      `;
    } else {
      html += `
        <tr>
          <td>#${step.pairIndex}</td>
          <td><span class="pair-badge">${step.pairText}</span></td>
          <td><code>[ ${step.c1}, ${step.c2} ]ᵀ</code></td>
          <td class="calc-cell">
            P₁ = ${step.calc1}<br>
            P₂ = ${step.calc2}
          </td>
          <td><code>[ ${step.p1}, ${step.p2} ]</code></td>
          <td><strong class="out-letters">${step.outText}</strong></td>
        </tr>
      `;
    }
  });

  html += `
          </tbody>
        </table>
      </div>
    </div>

    <!-- Step 4: Final Output Summary -->
    <div class="step-card highlight-card">
      <div class="step-title">Step 4: Final Output Result</div>
      <div class="final-result-display">
        <div><span>Operation:</span> <strong>${mode}</strong></div>
        <div><span>Final Result:</span> <strong class="final-text">${mode === 'Encryption' ? ciphertext : plaintext}</strong></div>
      </div>
    </div>
  `;

  container.innerHTML = html;
}

// Bind all UI event listeners
export function initUIListeners() {
  // Input Matrix Change Listeners
  ['k11', 'k12', 'k21', 'k22'].forEach(id => {
    document.getElementById(id).addEventListener('input', () => {
      updateKeyStatus();
    });
  });

  // Key String input listener (e.g. typing "HILL")
  document.getElementById('key-word-input').addEventListener('input', (e) => {
    const val = e.target.value.trim();
    if (val.length === 4) {
      const matrix = keyStringToMatrix(val);
      if (matrix) {
        setMatrixInputs(matrix);
      }
    }
  });

  // Random Valid Key Generator
  document.getElementById('btn-random-key').addEventListener('click', () => {
    const validMatrix = generateValidKey();
    setMatrixInputs(validMatrix);
  });

  // Preset Selector
  document.getElementById('preset-select').addEventListener('change', (e) => {
    const key = e.target.value;
    if (PRESETS[key]) {
      setMatrixInputs(PRESETS[key].matrix);
      document.getElementById('plaintext-input').value = PRESETS[key].sample;
    }
  });

  // Encrypt Button
  document.getElementById('btn-encrypt').addEventListener('click', () => {
    const matrix = getMatrixFromInputs();
    const text = document.getElementById('plaintext-input').value;
    const result = encryptHill(text, matrix);
    currentResult = result;

    const outputEl = document.getElementById('output-text');
    const alertEl = document.getElementById('alert-box');

    if (result.success) {
      outputEl.value = result.ciphertext;
      alertEl.className = 'alert-box alert-success';
      alertEl.innerHTML = `<strong>Success:</strong> Text encrypted successfully. Result: <strong>${result.ciphertext}</strong>`;
      renderSteps(result);
    } else {
      outputEl.value = '';
      alertEl.className = 'alert-box alert-danger';
      alertEl.innerHTML = `<strong>Error:</strong> ${result.error}`;
      renderSteps(null);
    }
  });

  // Decrypt Button
  document.getElementById('btn-decrypt').addEventListener('click', () => {
    const matrix = getMatrixFromInputs();
    const text = document.getElementById('plaintext-input').value || document.getElementById('output-text').value;
    const result = decryptHill(text, matrix);
    currentResult = result;

    const outputEl = document.getElementById('output-text');
    const alertEl = document.getElementById('alert-box');

    if (result.success) {
      outputEl.value = result.plaintext;
      alertEl.className = 'alert-box alert-success';
      alertEl.innerHTML = `<strong>Success:</strong> Ciphertext decrypted successfully. Result: <strong>${result.plaintext}</strong>`;
      renderSteps(result);
    } else {
      outputEl.value = '';
      alertEl.className = 'alert-box alert-danger';
      alertEl.innerHTML = `<strong>Error:</strong> ${result.error}`;
      renderSteps(null);
    }
  });

  // Clear / Reset Button
  document.getElementById('btn-reset').addEventListener('click', () => {
    document.getElementById('plaintext-input').value = '';
    document.getElementById('output-text').value = '';
    document.getElementById('alert-box').className = 'alert-box hidden';
    document.getElementById('preset-select').value = 'HILL';
    setMatrixInputs(PRESETS.HILL.matrix);
    renderSteps(null);
  });

  // Copy Output Button
  document.getElementById('btn-copy').addEventListener('click', () => {
    const outputText = document.getElementById('output-text').value;
    if (outputText) {
      navigator.clipboard.writeText(outputText);
      const btn = document.getElementById('btn-copy');
      const origText = btn.innerHTML;
      btn.innerHTML = '✓ Copied!';
      setTimeout(() => { btn.innerHTML = origText; }, 2000);
    }
  });

  // Viva Modal Listeners
  const modal = document.getElementById('viva-modal');
  document.getElementById('btn-viva-modal').addEventListener('click', () => {
    modal.classList.add('active');
  });
  document.getElementById('btn-close-modal').addEventListener('click', () => {
    modal.classList.remove('active');
  });
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.classList.remove('active');
  });

  // Tab Switching inside Viva Modal
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById(btn.dataset.tab).classList.add('active');
    });
  });

  // Initialize default key preset
  setMatrixInputs(PRESETS.HILL.matrix);
  document.getElementById('plaintext-input').value = PRESETS.HILL.sample;
}
