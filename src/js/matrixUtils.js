/**
 * Matrix & Modular Arithmetic Utilities for 2x2 Hill Cipher
 */

// Helper to compute standard mathematical modulo (always positive in range 0..m-1)
export function mod(n, m) {
  return ((n % m) + m) % m;
}

// Compute Greatest Common Divisor (GCD) using Euclidean Algorithm
export function gcd(a, b) {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) {
    let t = b;
    b = a % b;
    a = t;
  }
  return a;
}

// Compute 2x2 Matrix Determinant: (a*d - b*c) mod 26
export function determinant2x2(matrix) {
  const [[a, b], [c, d]] = matrix;
  const rawDet = a * d - b * c;
  const modDet = mod(rawDet, 26);
  return { rawDet, modDet };
}

// Find Modular Multiplicative Inverse of a modulo 26 (1 <= x < 26 s.t. (a * x) % 26 === 1)
export function modInverse26(a) {
  const aMod = mod(a, 26);
  if (gcd(aMod, 26) !== 1) {
    return null; // No inverse exists if not coprime with 26
  }
  for (let x = 1; x < 26; x++) {
    if ((aMod * x) % 26 === 1) {
      return x;
    }
  }
  return null;
}

// Compute 2x2 Adjugate Matrix mod 26
// adj([[a, b], [c, d]]) = [[d, -b], [-c, a]] mod 26
export function adjugate2x2(matrix) {
  const [[a, b], [c, d]] = matrix;
  return [
    [mod(d, 26), mod(-b, 26)],
    [mod(-c, 26), mod(a, 26)]
  ];
}

// Compute 2x2 Inverse Matrix mod 26
// K^-1 = (det^-1 * adj(K)) mod 26
export function inverseMatrix2x2(matrix) {
  const { modDet } = determinant2x2(matrix);
  const detInv = modInverse26(modDet);

  if (detInv === null) {
    return null;
  }

  const adj = adjugate2x2(matrix);
  return [
    [mod(detInv * adj[0][0], 26), mod(detInv * adj[0][1], 26)],
    [mod(detInv * adj[1][0], 26), mod(detInv * adj[1][1], 26)]
  ];
}

// Full key matrix validation function with diagnostic feedback
export function validateMatrix(matrix) {
  const { rawDet, modDet } = determinant2x2(matrix);
  const detGcd = gcd(modDet, 26);
  const detInv = modInverse26(modDet);
  const invMatrix = detInv !== null ? inverseMatrix2x2(matrix) : null;

  let isValid = true;
  let errorMessage = '';

  if (modDet === 0) {
    isValid = false;
    errorMessage = 'Determinant is 0 mod 26. Matrix is singular and has no inverse.';
  } else if (detGcd !== 1) {
    isValid = false;
    errorMessage = `Determinant (${modDet}) shares a common factor with 26 (GCD = ${detGcd}). It is not invertible mod 26.`;
  }

  return {
    isValid,
    rawDet,
    modDet,
    gcd: detGcd,
    detInv,
    inverseMatrix: invMatrix,
    errorMessage
  };
}

// Generate a random valid 2x2 key matrix mod 26
export function generateValidKey() {
  let matrix;
  let validation;
  do {
    matrix = [
      [Math.floor(Math.random() * 26), Math.floor(Math.random() * 26)],
      [Math.floor(Math.random() * 26), Math.floor(Math.random() * 26)]
    ];
    validation = validateMatrix(matrix);
  } while (!validation.isValid);
  return matrix;
}

// Convert 4-letter string to 2x2 Matrix (A=0, B=1, ..., Z=25)
export function keyStringToMatrix(str) {
  const cleaned = str.toUpperCase().replace(/[^A-Z]/g, '');
  if (cleaned.length !== 4) return null;
  return [
    [cleaned.charCodeAt(0) - 65, cleaned.charCodeAt(1) - 65],
    [cleaned.charCodeAt(2) - 65, cleaned.charCodeAt(3) - 65]
  ];
}

// Convert 2x2 Matrix back to 4-letter string
export function matrixToKeyString(matrix) {
  const [[a, b], [c, d]] = matrix;
  return (
    String.fromCharCode(mod(a, 26) + 65) +
    String.fromCharCode(mod(b, 26) + 65) +
    String.fromCharCode(mod(c, 26) + 65) +
    String.fromCharCode(mod(d, 26) + 65)
  );
}
