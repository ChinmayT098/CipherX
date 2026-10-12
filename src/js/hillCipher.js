/**
 * Hill Cipher Algorithm Core Engine & Step-by-Step Math Generator
 */

import {
  mod,
  validateMatrix,
  matrixToKeyString
} from './matrixUtils.js';

// Clean text: strip non-alphabetic chars, convert to uppercase, pad with 'X' if odd length
export function cleanText(text, padChar = 'X') {
  const sanitized = text.toUpperCase().replace(/[^A-Z]/g, '');
  let padded = false;
  let result = sanitized;
  if (result.length % 2 !== 0) {
    result += padChar;
    padded = true;
  }
  return { cleaned: result, padded, rawLength: sanitized.length };
}

/**
 * Encrypt plaintext using 2x2 Hill Cipher matrix
 */
export function encryptHill(plaintext, keyMatrix) {
  const validation = validateMatrix(keyMatrix);
  if (!validation.isValid) {
    return {
      success: false,
      error: validation.errorMessage,
      ciphertext: '',
      steps: null
    };
  }

  const { cleaned, padded } = cleanText(plaintext);
  if (cleaned.length === 0) {
    return {
      success: false,
      error: 'Please enter valid text (letters A-Z) to encrypt.',
      ciphertext: '',
      steps: null
    };
  }

  const cipherChars = [];
  const digraphSteps = [];
  const [[k11, k12], [k21, k22]] = keyMatrix;

  for (let i = 0; i < cleaned.length; i += 2) {
    const char1 = cleaned[i];
    const char2 = cleaned[i + 1];
    const p1 = char1.charCodeAt(0) - 65;
    const p2 = char2.charCodeAt(0) - 65;

    // Vector multiplication: C = K * P mod 26
    const rawC1 = k11 * p1 + k12 * p2;
    const c1 = mod(rawC1, 26);

    const rawC2 = k21 * p1 + k22 * p2;
    const c2 = mod(rawC2, 26);

    const outChar1 = String.fromCharCode(c1 + 65);
    const outChar2 = String.fromCharCode(c2 + 65);

    cipherChars.push(outChar1, outChar2);

    digraphSteps.push({
      pairIndex: i / 2 + 1,
      pairText: `${char1}${char2}`,
      p1,
      p2,
      calc1: `(${k11} × ${p1}) + (${k12} × ${p2}) = ${rawC1} ≡ ${c1} (mod 26)`,
      calc2: `(${k21} × ${p1}) + (${k22} × ${p2}) = ${rawC2} ≡ ${c2} (mod 26)`,
      c1,
      c2,
      outText: `${outChar1}${outChar2}`
    });
  }

  const ciphertext = cipherChars.join('');

  return {
    success: true,
    mode: 'Encryption',
    plaintextCleaned: cleaned,
    ciphertext,
    padded,
    keyMatrix,
    keyString: matrixToKeyString(keyMatrix),
    validation,
    digraphSteps
  };
}

/**
 * Decrypt ciphertext using 2x2 Hill Cipher inverse matrix
 */
export function decryptHill(ciphertext, keyMatrix) {
  const validation = validateMatrix(keyMatrix);
  if (!validation.isValid) {
    return {
      success: false,
      error: validation.errorMessage,
      plaintext: '',
      steps: null
    };
  }

  const { cleaned } = cleanText(ciphertext);
  if (cleaned.length === 0) {
    return {
      success: false,
      error: 'Please enter valid ciphertext (letters A-Z) to decrypt.',
      plaintext: '',
      steps: null
    };
  }

  const invMatrix = validation.inverseMatrix;
  const [[ik11, ik12], [ik21, ik22]] = invMatrix;
  const plainChars = [];
  const digraphSteps = [];

  for (let i = 0; i < cleaned.length; i += 2) {
    const char1 = cleaned[i];
    const char2 = cleaned[i + 1];
    const c1 = char1.charCodeAt(0) - 65;
    const c2 = char2.charCodeAt(0) - 65;

    // Vector multiplication: P = K^-1 * C mod 26
    const rawP1 = ik11 * c1 + ik12 * c2;
    const p1 = mod(rawP1, 26);

    const rawP2 = ik21 * c1 + ik22 * c2;
    const p2 = mod(rawP2, 26);

    const outChar1 = String.fromCharCode(p1 + 65);
    const outChar2 = String.fromCharCode(p2 + 65);

    plainChars.push(outChar1, outChar2);

    digraphSteps.push({
      pairIndex: i / 2 + 1,
      pairText: `${char1}${char2}`,
      c1,
      c2,
      calc1: `(${ik11} × ${c1}) + (${ik12} × ${c2}) = ${rawP1} ≡ ${p1} (mod 26)`,
      calc2: `(${ik21} × ${c1}) + (${ik22} × ${c2}) = ${rawP2} ≡ ${p2} (mod 26)`,
      p1,
      p2,
      outText: `${outChar1}${outChar2}`
    });
  }

  const plaintext = plainChars.join('');

  return {
    success: true,
    mode: 'Decryption',
    ciphertextCleaned: cleaned,
    plaintext,
    keyMatrix,
    invMatrix,
    keyString: matrixToKeyString(keyMatrix),
    validation,
    digraphSteps
  };
}
