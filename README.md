# Secure Text Encryption and Decryption using Hill Cipher
> **Cryptography and Network Security (CNS) College Micro Project**

A complete, modern, responsive web application implementing the 2×2 Hill Cipher algorithm with real-time key matrix invertibility validation, step-by-step mathematical execution breakdowns, and a built-in Viva Preparation Guide.

---

## 📌 Project Overview & Abstract

**Project Title:** Secure Text Encryption and Decryption using Hill Cipher  
**Domain:** Cryptography and Network Security (CNS) / Information Security  

### Abstract
Information security is a fundamental pillar of modern computing. The Hill Cipher, invented by Lester S. Hill in 1929, is a polygraphic substitution cipher rooted in linear algebra and modulo arithmetic. Unlike classical monoalphabetic ciphers, the Hill Cipher encrypts groups of letters (digraphs or trigraphs) simultaneously using matrix multiplication modulo 26, effectively disguising single-letter frequency distribution. 

This micro-project delivers an interactive, modern web application designed for students and educators. It implements the 2×2 Hill Cipher cipher engine with live invertibility validation ($\gcd(\text{det}(K), 26) = 1$), step-by-step mathematical calculations, customizable key matrix inputs, preset matrices, and an integrated Viva Preparation Guide for academic evaluation.

---

## 🎯 Objectives

1. **Algorithm Implementation:** Correctly implement 2×2 Hill Cipher encryption and decryption using linear matrix transformations modulo 26.
2. **Matrix Validation:** Validate key matrices in real-time by checking determinant non-zeroness and coprimality with 26 ($\gcd(\text{det}(K), 26) = 1$).
3. **Step-by-Step Educational Renderer:** Provide a transparent, line-by-line mathematical breakdown showing vector conversions, matrix multiplication, modular arithmetic, adjugate matrix derivation, and inverse matrix generation for viva demonstrations.
4. **User Experience:** Build a responsive, cyber-themed UI (Obsidian dark mode, glassmorphism, neon cyan accents) accessible on laptops, tablets, and mobile devices.

---

## ✨ Features

- **2×2 Matrix Encryption & Decryption:** Fast, accurate modulo 26 matrix calculations.
- **Real-Time Key Matrix Validator:** Live diagnostic badge showing determinant $\text{det}(K)$, coprimality status, modular inverse $\text{det}^{-1}(K)$, and inverse key matrix $K^{-1}$.
- **Random Valid Key Generator:** Instantly generate mathematically valid 2×2 matrices with a single click.
- **Quick Preset Selector:** Load pre-configured valid key matrices (e.g., "HILL", "GYBN", "BACK", "CODE").
- **4-Letter Word Input:** Option to input 4-letter key strings (e.g., "HILL" $\to \begin{pmatrix} 7 & 8 \\ 11 & 11 \end{pmatrix}$).
- **Automatic Text Processing:** Strips non-alphabetic characters, converts to uppercase, and automatically pads odd-length texts with 'X'.
- **Interactive Step-by-Step Viva Solver:** Displays the complete mathematical execution path for classroom & viva presentations.
- **Built-in Viva Prep Guide:** Modal popup containing Project Abstract, Mathematical Theory, Solved Example, and Top 10 Viva Questions & Answers.
- **Responsive Cyber UI:** Built with CSS Grid/Flexbox and glassmorphism styling.

---

## 🛠️ Technologies Used

| Category | Technology | Usage / Description |
| :--- | :--- | :--- |
| **Frontend UI** | HTML5 | Semantic structure & accessible UI controls |
| **Styling** | CSS3 (Vanilla Design System) | Modern cybersecurity dark theme, CSS variables, glassmorphism |
| **Core Logic & Math** | JavaScript (ES6 Modules) | Matrix math, Extended Euclidean algorithm, Hill Cipher engine |
| **Dev Tooling** | Vite.js | Fast development server & module bundler |
| **Runtime** | Node.js / npm | Project script execution & dependency manager |

---

## 📁 Project Folder Structure

```
CNS/
├── index.html                 # Main web application layout & Viva Modal
├── package.json               # Dependencies & build scripts
├── vite.config.js             # Vite configuration file
├── README.md                  # Complete project documentation & viva guide
└── src/
    ├── style.css              # Cyber-themed CSS design system (Dark mode)
    └── js/
        ├── matrixUtils.js     # Matrix arithmetic, determinant, GCD, mod inverse, validation
        ├── hillCipher.js      # Hill Cipher encryption, decryption & step generator
        ├── ui.js              # DOM event handlers, live key status, viva solver
        └── app.js             # Application entry point
```

---

## 🚀 Installation & Running Locally

### Prerequisites
- [Node.js](https://nodejs.org/) (v16.0.0 or higher recommended)
- `npm` package manager

### Steps to Run

1. **Open Terminal / PowerShell** in the project directory:
   ```bash
   cd d:\Project\CNS
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Start Local Development Server:**
   ```bash
   npm run dev
   ```

4. **Access Application:**
   Open your browser and navigate to: `http://localhost:3000`

5. **Build for Production (Optional):**
   ```bash
   npm run build
   ```

---

## 📐 How Hill Cipher Works

### 1. Alphabet Mapping
Each letter of the English alphabet is assigned a numerical value from 0 to 25:
$$A=0, B=1, C=2, \dots, Z=25$$

### 2. Encryption Process
1. Plaintext is stripped of non-alphabetic characters and converted to uppercase.
2. If plaintext length is odd, a dummy letter ('X') is appended.
3. Plaintext is divided into pairs (digraphs) represented as column vectors:
   $$P = \begin{bmatrix} P_1 \\ P_2 \end{bmatrix}$$
4. Given a 2×2 Key Matrix $K = \begin{bmatrix} k_{11} & k_{12} \\ k_{21} & k_{22} \end{bmatrix}$, ciphertext vector $C$ is computed via:
   $$C = (K \times P) \pmod{26}$$
   $$C_1 = (k_{11} \cdot P_1 + k_{12} \cdot P_2) \pmod{26}$$
   $$C_2 = (k_{21} \cdot P_1 + k_{22} \cdot P_2) \pmod{26}$$
5. Values $C_1, C_2$ are mapped back to letters to form the ciphertext.

### 3. Decryption Process
1. Ciphertext is divided into digraph pairs $C = \begin{bmatrix} C_1 \\ C_2 \end{bmatrix}$.
2. To decrypt, we compute the inverse key matrix $K^{-1} \pmod{26}$:
   $$K^{-1} = \text{det}^{-1}(K) \cdot \text{adj}(K) \pmod{26}$$
   where $\text{adj}(K) = \begin{bmatrix} k_{22} & -k_{12} \\ -k_{21} & k_{11} \end{bmatrix} \pmod{26}$.
3. Plaintext vector $P$ is calculated as:
   $$P = (K^{-1} \times C) \pmod{26}$$
   $$P_1 = (k^{-1}_{11} \cdot C_1 + k^{-1}_{12} \cdot C_2) \pmod{26}$$
   $$P_2 = (k^{-1}_{21} \cdot C_1 + k^{-1}_{22} \cdot C_2) \pmod{26}$$

---

## 📝 Solved Step-by-Step Example (For Viva Demo)

### Problem
Encrypt plaintext **"ACT"** using Key Matrix **"HILL"** = $\begin{bmatrix} 7 & 8 \\ 11 & 11 \end{bmatrix}$.

#### Step 1: Text Digraph Pair Preparation
Length of "ACT" is 3 (odd). Append 'X' $\implies$ **"ACTX"**.
- Digraph 1: **"AC"** $\implies P_1 = \begin{bmatrix} 0 \\ 2 \end{bmatrix}$ (A=0, C=2)
- Digraph 2: **"TX"** $\implies P_2 = \begin{bmatrix} 19 \\ 23 \end{bmatrix}$ (T=19, X=23)

#### Step 2: Key Matrix Determinant & Inversion Check
$$\text{det}(K) = (7 \cdot 11 - 8 \cdot 11) = 77 - 88 = -11 \equiv 15 \pmod{26}$$
$$\gcd(15, 26) = 1 \implies \text{Valid & Coprime!}$$
Modular Inverse of 15 mod 26:
$$(15 \times 7) = 105 \equiv 1 \pmod{26} \implies \text{det}^{-1}(K) = 7$$

Inverse Matrix $K^{-1} \pmod{26}$:
$$\text{adj}(K) = \begin{bmatrix} 11 & -8 \\ -11 & 7 \end{bmatrix} \equiv \begin{bmatrix} 11 & 18 \\ 15 & 7 \end{bmatrix} \pmod{26}$$
$$K^{-1} = 7 \cdot \begin{bmatrix} 11 & 18 \\ 15 & 7 \end{bmatrix} = \begin{bmatrix} 77 & 126 \\ 105 & 49 \end{bmatrix} \equiv \begin{bmatrix} 25 & 22 \\ 1 & 23 \end{bmatrix} \pmod{26}$$

#### Step 3: Digraph Encryption Calculations
- **Pair 1 ("AC" $\implies [0, 2]^T$):**
  $$C_1 = (7 \times 0 + 8 \times 2) = 16 \equiv 16 \pmod{26} \implies \text{'Q'}$$
  $$C_2 = (11 \times 0 + 11 \times 2) = 22 \equiv 22 \pmod{26} \implies \text{'W'}$$
  Result = **"QW"**

- **Pair 2 ("TX" $\implies [19, 23]^T$):**
  $$C_1 = (7 \times 19 + 8 \times 23) = 133 + 184 = 317 \equiv 5 \pmod{26} \implies \text{'F'}$$
  $$C_2 = (11 \times 19 + 11 \times 23) = 209 + 253 = 462 \equiv 20 \pmod{26} \implies \text{'U'}$$
  Result = **"FU"**

**Final Encrypted Ciphertext = "QWFU"**

#### Step 4: Decryption Verification ("QWFU" $\to$ "ACTX")
Using $K^{-1} = \begin{bmatrix} 25 & 22 \\ 1 & 23 \end{bmatrix}$:
- **Pair 1 ("QW" $\implies [16, 22]^T$):**
  $$P_1 = (25 \times 16 + 22 \times 22) = 400 + 484 = 884 \equiv 0 \pmod{26} \implies \text{'A'}$$
  $$P_2 = (1 \times 16 + 23 \times 22) = 16 + 506 = 522 \equiv 2 \pmod{26} \implies \text{'C'}$$
  Result = **"AC"** ✅

---

## ❓ Top 10 Common Viva Questions & Answers

1. **Q: What type of cipher is the Hill Cipher?**  
   *Ans:* It is a polygraphic block substitution cipher based on linear algebra.

2. **Q: Why is arithmetic performed modulo 26?**  
   *Ans:* Because the English alphabet has 26 letters (mapped 0 to 25). Modulo 26 ensures generated numbers map back to valid characters.

3. **Q: What is the condition for a key matrix to be valid for decryption?**  
   *Ans:* The matrix determinant must be non-zero and coprime to 26 ($\gcd(\text{det}(K), 26) = 1$).

4. **Q: Why can't an even determinant be used?**  
   *Ans:* 26 is even ($26 = 2 \times 13$). Any even number shares a factor of 2 with 26, meaning no integer inverse $\text{det}^{-1} \pmod{26}$ exists.

5. **Q: How does Hill Cipher handle odd-length text?**  
   *Ans:* Plaintext is padded with a dummy character (e.g., 'X') to form complete digraph blocks.

6. **Q: How does Hill Cipher resist frequency analysis?**  
   *Ans:* By encrypting multi-letter blocks simultaneously, identical letters in different positions produce different ciphertext letters depending on their pair partner.

7. **Q: How is the modular inverse of the determinant calculated?**  
   *Ans:* Using the Extended Euclidean Algorithm or testing integers $x \in \{1..25\}$ such that $(\text{det} \times x) \equiv 1 \pmod{26}$.

8. **Q: What is the main weakness of the Hill Cipher?**  
   *Ans:* It is vulnerable to Known-Plaintext Attacks because an attacker with enough plaintext-ciphertext pairs can solve the linear matrix equations.

9. **Q: How does Hill Cipher differ from Caesar Cipher?**  
   *Ans:* Caesar cipher is monoalphabetic ($C = (P + k) \bmod 26$), shifting single letters. Hill cipher transforms letter vectors via matrix multiplication ($C = (K \times P) \bmod 26$).

10. **Q: Can Hill Cipher be extended to 3×3 or larger matrices?**  
    *Ans:* Yes, Hill Cipher can be generalized to $N \times N$ matrices acting on $N$-letter blocks, provided the $N \times N$ matrix is invertible mod 26.

---

## 🔮 Future Scope

1. **Support for $N \times N$ Matrices:** Extend matrix dimensions to 3×3, 4×4, and variable sizes.
2. **Extended Character Sets:** Support ASCII / UTF-8 characters using modulo 256 or modulo 95.
3. **Cryptanalysis & Attack Solver:** Implement an interactive Known-Plaintext Attack module demonstrating matrix cryptanalysis.
4. **File Encryption:** Enable encryption and decryption of `.txt` files.

---

## 📄 License
This project is open-source and intended for academic demonstration and learning purposes.
