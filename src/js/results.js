/**
 * Page Two: Step-by-Step Calculation & Results Controller
 * Cryptography and Network Security (CNS) Mini Project
 */

import { encryptHill, decryptHill } from './hillCipher.js';
import { mod } from './matrixUtils.js';
import { getCalculationState, clearCalculationState } from './storage.js';

/**
 * Render the full calculation breakdown and result
 */
function renderResultsPage() {
  const state = getCalculationState();
  const resultsContentEl = document.getElementById('results-content');

  // Guard: if no valid calculation state is present (e.g. direct visit or cleared), redirect to Page 1
  if (!state || !state.inputText || !state.matrix || !state.operation) {
    window.location.replace('index.html');
    return;
  }

  const { operation, inputText, matrix } = state;
  const isEncrypt = operation === 'encrypt';

  // Execute the Hill Cipher using the existing tested functions
  const result = isEncrypt ? encryptHill(inputText, matrix) : decryptHill(inputText, matrix);

  if (!result.success) {
    resultsContentEl.innerHTML = `
      <div class="card error-card">
        <h3>Calculation Error</h3>
        <p>${result.error}</p>
        <div class="margin-top-md">
          <a href="index.html" class="btn btn-primary">← Return to Input Page</a>
        </div>
      </div>
    `;
    return;
  }

  const {
    mode,
    keyMatrix,
    validation,
    digraphSteps,
    padded,
    plaintextCleaned,
    ciphertextCleaned,
    ciphertext,
    plaintext
  } = result;

  const [[k11, k12], [k21, k22]] = keyMatrix;
  const [[ik11, ik12], [ik21, ik22]] = validation.inverseMatrix;
  const finalOutput = isEncrypt ? ciphertext : plaintext;

  // Populate Operation Summary
  document.getElementById('summary-operation-badge').textContent = mode;
  document.getElementById('summary-operation-badge').className = `badge mode-badge ${isEncrypt ? 'badge-encrypt' : 'badge-decrypt'}`;
  document.getElementById('summary-original-text').textContent = inputText;
  document.getElementById('summary-cleaned-text').textContent = isEncrypt ? plaintextCleaned : ciphertextCleaned;
  
  document.getElementById('summary-matrix-display').innerHTML = `
    <div class="matrix-bracket">
      <div><span>${k11}</span><span>${k12}</span></div>
      <div><span>${k21}</span><span>${k22}</span></div>
    </div>
  `;

  // Step 1: Text Preparation
  const step1Container = document.getElementById('step1-container');
  let step1HTML = `
    <p class="step-explanation">
      Each character is mapped to its standard modular alphabet index: 
      <code>A = 0, B = 1, C = 2, &hellip;, Z = 25</code>.
      All non-alphabetic characters are stripped and remaining letters are converted to uppercase.
    </p>
    <div class="step-box">
      <div><strong>Original Input:</strong> <code>${escapeHtml(inputText)}</code></div>
      <div><strong>Cleaned Alphabet Text:</strong> <code>${isEncrypt ? plaintextCleaned : ciphertextCleaned}</code></div>
      ${padded ? `
        <div class="pad-alert">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          <span><strong>Odd-Length Padding Applied:</strong> The original input contained an odd number of letters. 'X' was appended at the end to form complete 2-letter digraph blocks for the 2×2 matrix.</span>
        </div>
      ` : ''}
      <div><strong>Divided into 2-Letter Digraphs:</strong> [ ${digraphSteps.map(s => `"${s.pairText}"`).join(', ')} ]</div>
      <div><strong>Digraph Numerical Vector Pairs:</strong> [ ${digraphSteps.map(s => `[${isEncrypt ? `${s.p1}, ${s.p2}` : `${s.c1}, ${s.c2}`}]ᵀ`).join(', ')} ]</div>
    </div>
  `;
  step1Container.innerHTML = step1HTML;

  // Step 2: Key Matrix Analysis
  const step2Container = document.getElementById('step2-container');
  const adj11 = k22;
  const adj12 = mod(-k12, 26);
  const adj21 = mod(-k21, 26);
  const adj22 = k11;

  let step2HTML = `
    <p class="step-explanation">
      For a 2×2 matrix to be valid in the Hill Cipher modulo 26, its determinant must be non-zero and coprime to 26 (<code>gcd(det(K), 26) = 1</code>).
    </p>

    <div class="math-box">
      <div><strong>1. Determinant Calculation:</strong></div>
      <div>det(K) = (k₁₁ × k₂₂ &minus; k₁₂ × k₂₁) = (${k11} × ${k22} &minus; ${k12} × ${k21}) = ${validation.rawDet}</div>
      <div>det(K) mod 26 = ${validation.rawDet} mod 26 = <strong>${validation.modDet}</strong></div>
      
      <div class="margin-top-sm"><strong>2. Coprimality & Invertibility Check:</strong></div>
      <div>gcd(det(K), 26) = gcd(${validation.modDet}, 26) = <strong>${validation.gcd}</strong> &rarr; Valid (coprime with 26)</div>
      
      <div class="margin-top-sm"><strong>3. Modular Multiplicative Inverse of Determinant:</strong></div>
      <div>Find integer x such that (${validation.modDet} &times; x) &equiv; 1 (mod 26):</div>
      <div>det⁻¹(K) &equiv; <strong>${validation.detInv}</strong> (mod 26), since (${validation.modDet} &times; ${validation.detInv}) = ${validation.modDet * validation.detInv} &equiv; 1 (mod 26)</div>
      
      <div class="margin-top-sm"><strong>4. Adjugate Matrix adj(K) mod 26:</strong></div>
      <div>adj(K) = [[k₂₂, -k₁₂], [-k₂₁, k₁₁]] mod 26 = [[${k22}, ${-k12}], [${-k21}, ${k11}]] mod 26 = [[${adj11}, ${adj12}], [${adj21}, ${adj22}]]</div>
      
      <div class="margin-top-sm"><strong>5. Inverse Key Matrix K⁻¹ mod 26:</strong></div>
      <div>K⁻¹ = (det⁻¹(K) &times; adj(K)) mod 26 = (${validation.detInv} &times; [[${adj11}, ${adj12}], [${adj21}, ${adj22}]]) mod 26 = <strong>[[${ik11}, ${ik12}], [${ik21}, ${ik22}]]</strong></div>
    </div>

    <div class="matrix-grid-display">
      <div class="matrix-unit">
        <label>Entered Key Matrix K:</label>
        <div class="matrix-bracket">
          <div><span>${k11}</span><span>${k12}</span></div>
          <div><span>${k21}</span><span>${k22}</span></div>
        </div>
      </div>

      <div class="matrix-unit">
        <label>Adjugate Matrix adj(K) mod 26:</label>
        <div class="matrix-bracket">
          <div><span>${adj11}</span><span>${adj12}</span></div>
          <div><span>${adj21}</span><span>${adj22}</span></div>
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

    <p class="matrix-note margin-top-sm">
      ${isEncrypt ? '<em>Note:</em> For encryption, the Key Matrix <strong>K</strong> is applied directly to plaintext vectors.' : '<em>Note:</em> For decryption, the Inverse Key Matrix <strong>K⁻¹ mod 26</strong> is applied to ciphertext vectors to recover the plaintext.'}
    </p>
  `;
  step2Container.innerHTML = step2HTML;

  // Step 3: Detailed Mathematical Calculations
  const step3Container = document.getElementById('step3-container');
  let step3HTML = `
    <div class="formula-banner">
      <strong>Formula Applied:</strong> 
      <code>${isEncrypt ? 'C = (K × P) mod 26' : 'P = (K⁻¹ × C) mod 26'}</code>
    </div>
    <p class="step-explanation margin-top-sm">
      Below is the line-by-line matrix multiplication and modulo 26 calculation for every 2-letter pair in the text:
    </p>

    <div class="digraph-table-wrapper">
      <table class="digraph-table">
        <thead>
          <tr>
            <th>Pair #</th>
            <th>Digraph Letters</th>
            <th>Input Vector</th>
            <th>Matrix Vector Multiplication Formula</th>
            <th>Mod 26 Vector</th>
            <th>Output Letters</th>
          </tr>
        </thead>
        <tbody>
  `;

  digraphSteps.forEach(step => {
    if (isEncrypt) {
      step3HTML += `
        <tr>
          <td><strong>#${step.pairIndex}</strong></td>
          <td><span class="pair-badge">${step.pairText}</span></td>
          <td><code>[ ${step.p1}, ${step.p2} ]ᵀ</code></td>
          <td class="calc-cell">
            C₁ = ${step.calc1}<br>
            C₂ = ${step.calc2}
          </td>
          <td><code>[ ${step.c1}, ${step.c2} ]</code></td>
          <td><span class="out-letters">${step.outText}</span></td>
        </tr>
      `;
    } else {
      step3HTML += `
        <tr>
          <td><strong>#${step.pairIndex}</strong></td>
          <td><span class="pair-badge">${step.pairText}</span></td>
          <td><code>[ ${step.c1}, ${step.c2} ]ᵀ</code></td>
          <td class="calc-cell">
            P₁ = ${step.calc1}<br>
            P₂ = ${step.calc2}
          </td>
          <td><code>[ ${step.p1}, ${step.p2} ]</code></td>
          <td><span class="out-letters">${step.outText}</span></td>
        </tr>
      `;
    }
  });

  step3HTML += `
        </tbody>
      </table>
    </div>
  `;
  step3Container.innerHTML = step3HTML;

  // Final Result Card
  const resultTitleEl = document.getElementById('result-title');
  const resultDisplayEl = document.getElementById('final-result-text');
  resultTitleEl.textContent = isEncrypt ? 'Final Ciphertext Output:' : 'Final Recovered Plaintext Output:';
  resultDisplayEl.textContent = finalOutput;

  // Setup Copy Result Button
  const btnCopy = document.getElementById('btn-copy-result');
  if (btnCopy) {
    btnCopy.onclick = () => {
      navigator.clipboard.writeText(finalOutput).then(() => {
        const origContent = btnCopy.innerHTML;
        btnCopy.innerHTML = `
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          <span>✓ Copied!</span>
        `;
        setTimeout(() => {
          btnCopy.innerHTML = origContent;
        }, 2000);
      });
    };
  }
}

/**
 * Helper to escape HTML characters
 */
function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}

/**
 * Initialize Page 2
 */
document.addEventListener('DOMContentLoaded', () => {
  // Render calculation results
  renderResultsPage();

  // Back to Input button (preserves values)
  const btnBack = document.getElementById('btn-back');
  if (btnBack) {
    btnBack.addEventListener('click', () => {
      window.location.href = 'index.html';
    });
  }

  // Bottom back button
  const btnBackBottom = document.getElementById('btn-back-bottom');
  if (btnBackBottom) {
    btnBackBottom.addEventListener('click', () => {
      window.location.href = 'index.html';
    });
  }

  // Reset / New Calculation buttons
  const resetHandler = () => {
    clearCalculationState();
    window.location.href = 'index.html';
  };

  const btnResetTop = document.getElementById('btn-reset-top');
  if (btnResetTop) {
    btnResetTop.addEventListener('click', resetHandler);
  }

  const btnResetBottom = document.getElementById('btn-reset-bottom');
  if (btnResetBottom) {
    btnResetBottom.addEventListener('click', resetHandler);
  }

  console.log('Hill Cipher Page 2 (Calculation & Results) initialized.');
});
