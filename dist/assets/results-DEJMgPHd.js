import{v as D,m as P,a as k,g as N,c as Z}from"./storage-_tKUODWT.js";function j(o,i="X"){const a=o.toUpperCase().replace(/[^A-Z]/g,"");let e=!1,d=a;return d.length%2!==0&&(d+=i,e=!0),{cleaned:d,padded:e,rawLength:a.length}}function z(o,i){const a=D(i);if(!a.isValid)return{success:!1,error:a.errorMessage,ciphertext:"",steps:null};const{cleaned:e,padded:d}=j(o);if(e.length===0)return{success:!1,error:"Please enter valid text (letters A-Z) to encrypt.",ciphertext:"",steps:null};const s=[],v=[],[[C,b],[n,$]]=i;for(let c=0;c<e.length;c+=2){const h=e[c],f=e[c+1],l=h.charCodeAt(0)-65,r=f.charCodeAt(0)-65,m=C*l+b*r,p=k(m,26),u=n*l+$*r,g=k(u,26),x=String.fromCharCode(p+65),y=String.fromCharCode(g+65);s.push(x,y),v.push({pairIndex:c/2+1,pairText:`${h}${f}`,p1:l,p2:r,calc1:`(${C} × ${l}) + (${b} × ${r}) = ${m} ≡ ${p} (mod 26)`,calc2:`(${n} × ${l}) + (${$} × ${r}) = ${u} ≡ ${g} (mod 26)`,c1:p,c2:g,outText:`${x}${y}`})}const I=s.join("");return{success:!0,mode:"Encryption",plaintextCleaned:e,ciphertext:I,padded:d,keyMatrix:i,keyString:P(i),validation:a,digraphSteps:v}}function X(o,i){const a=D(i);if(!a.isValid)return{success:!1,error:a.errorMessage,plaintext:"",steps:null};const{cleaned:e}=j(o);if(e.length===0)return{success:!1,error:"Please enter valid ciphertext (letters A-Z) to decrypt.",plaintext:"",steps:null};const d=a.inverseMatrix,[[s,v],[C,b]]=d,n=[],$=[];for(let c=0;c<e.length;c+=2){const h=e[c],f=e[c+1],l=h.charCodeAt(0)-65,r=f.charCodeAt(0)-65,m=s*l+v*r,p=k(m,26),u=C*l+b*r,g=k(u,26),x=String.fromCharCode(p+65),y=String.fromCharCode(g+65);n.push(x,y),$.push({pairIndex:c/2+1,pairText:`${h}${f}`,c1:l,c2:r,calc1:`(${s} × ${l}) + (${v} × ${r}) = ${m} ≡ ${p} (mod 26)`,calc2:`(${C} × ${l}) + (${b} × ${r}) = ${u} ≡ ${g} (mod 26)`,p1:p,p2:g,outText:`${x}${y}`})}const I=n.join("");return{success:!0,mode:"Decryption",ciphertextCleaned:e,plaintext:I,keyMatrix:i,invMatrix:d,keyString:P(i),validation:a,digraphSteps:$}}function U(){const o=N(),i=document.getElementById("results-content");if(!o||!o.inputText||!o.matrix||!o.operation){window.location.replace("index.html");return}const{operation:a,inputText:e,matrix:d}=o,s=a==="encrypt",v=s?z(e,d):X(e,d);if(!v.success){i.innerHTML=`
      <div class="card error-card">
        <h3>Calculation Error</h3>
        <p>${v.error}</p>
        <div class="margin-top-md">
          <a href="index.html" class="btn btn-primary">← Return to Input Page</a>
        </div>
      </div>
    `;return}const{mode:C,keyMatrix:b,validation:n,digraphSteps:$,padded:I,plaintextCleaned:c,ciphertextCleaned:h,ciphertext:f,plaintext:l}=v,[[r,m],[p,u]]=b,[[g,x],[y,L]]=n.inverseMatrix,H=s?f:l;document.getElementById("summary-operation-badge").textContent=C,document.getElementById("summary-operation-badge").className=`badge mode-badge ${s?"badge-encrypt":"badge-decrypt"}`,document.getElementById("summary-original-text").textContent=e,document.getElementById("summary-cleaned-text").textContent=s?c:h,document.getElementById("summary-matrix-display").innerHTML=`
    <div class="matrix-bracket">
      <div><span>${r}</span><span>${m}</span></div>
      <div><span>${p}</span><span>${u}</span></div>
    </div>
  `;const A=document.getElementById("step1-container");let S=`
    <p class="step-explanation">
      Each character is mapped to its standard modular alphabet index: 
      <code>A = 0, B = 1, C = 2, &hellip;, Z = 25</code>.
      All non-alphabetic characters are stripped and remaining letters are converted to uppercase.
    </p>
    <div class="step-box">
      <div><strong>Original Input:</strong> <code>${G(e)}</code></div>
      <div><strong>Cleaned Alphabet Text:</strong> <code>${s?c:h}</code></div>
      ${I?`
        <div class="pad-alert">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          <span><strong>Odd-Length Padding Applied:</strong> The original input contained an odd number of letters. 'X' was appended at the end to form complete 2-letter digraph blocks for the 2×2 matrix.</span>
        </div>
      `:""}
      <div><strong>Divided into 2-Letter Digraphs:</strong> [ ${$.map(t=>`"${t.pairText}"`).join(", ")} ]</div>
      <div><strong>Digraph Numerical Vector Pairs:</strong> [ ${$.map(t=>`[${s?`${t.p1}, ${t.p2}`:`${t.c1}, ${t.c2}`}]ᵀ`).join(", ")} ]</div>
    </div>
  `;A.innerHTML=S;const F=document.getElementById("step2-container"),w=u,M=k(-m,26),B=k(-p,26),K=r;let O=`
    <p class="step-explanation">
      For a 2×2 matrix to be valid in the Hill Cipher modulo 26, its determinant must be non-zero and coprime to 26 (<code>gcd(det(K), 26) = 1</code>).
    </p>

    <div class="math-box">
      <div><strong>1. Determinant Calculation:</strong></div>
      <div>det(K) = (k₁₁ × k₂₂ &minus; k₁₂ × k₂₁) = (${r} × ${u} &minus; ${m} × ${p}) = ${n.rawDet}</div>
      <div>det(K) mod 26 = ${n.rawDet} mod 26 = <strong>${n.modDet}</strong></div>
      
      <div class="margin-top-sm"><strong>2. Coprimality & Invertibility Check:</strong></div>
      <div>gcd(det(K), 26) = gcd(${n.modDet}, 26) = <strong>${n.gcd}</strong> &rarr; Valid (coprime with 26)</div>
      
      <div class="margin-top-sm"><strong>3. Modular Multiplicative Inverse of Determinant:</strong></div>
      <div>Find integer x such that (${n.modDet} &times; x) &equiv; 1 (mod 26):</div>
      <div>det⁻¹(K) &equiv; <strong>${n.detInv}</strong> (mod 26), since (${n.modDet} &times; ${n.detInv}) = ${n.modDet*n.detInv} &equiv; 1 (mod 26)</div>
      
      <div class="margin-top-sm"><strong>4. Adjugate Matrix adj(K) mod 26:</strong></div>
      <div>adj(K) = [[k₂₂, -k₁₂], [-k₂₁, k₁₁]] mod 26 = [[${u}, ${-m}], [${-p}, ${r}]] mod 26 = [[${w}, ${M}], [${B}, ${K}]]</div>
      
      <div class="margin-top-sm"><strong>5. Inverse Key Matrix K⁻¹ mod 26:</strong></div>
      <div>K⁻¹ = (det⁻¹(K) &times; adj(K)) mod 26 = (${n.detInv} &times; [[${w}, ${M}], [${B}, ${K}]]) mod 26 = <strong>[[${g}, ${x}], [${y}, ${L}]]</strong></div>
    </div>

    <div class="matrix-grid-display">
      <div class="matrix-unit">
        <label>Entered Key Matrix K:</label>
        <div class="matrix-bracket">
          <div><span>${r}</span><span>${m}</span></div>
          <div><span>${p}</span><span>${u}</span></div>
        </div>
      </div>

      <div class="matrix-unit">
        <label>Adjugate Matrix adj(K) mod 26:</label>
        <div class="matrix-bracket">
          <div><span>${w}</span><span>${M}</span></div>
          <div><span>${B}</span><span>${K}</span></div>
        </div>
      </div>

      <div class="matrix-unit">
        <label>Inverse Key Matrix K⁻¹ mod 26:</label>
        <div class="matrix-bracket inverse">
          <div><span>${g}</span><span>${x}</span></div>
          <div><span>${y}</span><span>${L}</span></div>
        </div>
      </div>
    </div>

    <p class="matrix-note margin-top-sm">
      ${s?"<em>Note:</em> For encryption, the Key Matrix <strong>K</strong> is applied directly to plaintext vectors.":"<em>Note:</em> For decryption, the Inverse Key Matrix <strong>K⁻¹ mod 26</strong> is applied to ciphertext vectors to recover the plaintext."}
    </p>
  `;F.innerHTML=O;const V=document.getElementById("step3-container");let T=`
    <div class="formula-banner">
      <strong>Formula Applied:</strong> 
      <code>${s?"C = (K × P) mod 26":"P = (K⁻¹ × C) mod 26"}</code>
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
  `;$.forEach(t=>{s?T+=`
        <tr>
          <td><strong>#${t.pairIndex}</strong></td>
          <td><span class="pair-badge">${t.pairText}</span></td>
          <td><code>[ ${t.p1}, ${t.p2} ]ᵀ</code></td>
          <td class="calc-cell">
            C₁ = ${t.calc1}<br>
            C₂ = ${t.calc2}
          </td>
          <td><code>[ ${t.c1}, ${t.c2} ]</code></td>
          <td><span class="out-letters">${t.outText}</span></td>
        </tr>
      `:T+=`
        <tr>
          <td><strong>#${t.pairIndex}</strong></td>
          <td><span class="pair-badge">${t.pairText}</span></td>
          <td><code>[ ${t.c1}, ${t.c2} ]ᵀ</code></td>
          <td class="calc-cell">
            P₁ = ${t.calc1}<br>
            P₂ = ${t.calc2}
          </td>
          <td><code>[ ${t.p1}, ${t.p2} ]</code></td>
          <td><span class="out-letters">${t.outText}</span></td>
        </tr>
      `}),T+=`
        </tbody>
      </table>
    </div>
  `,V.innerHTML=T;const R=document.getElementById("result-title"),q=document.getElementById("final-result-text");R.textContent=s?"Final Ciphertext Output:":"Final Recovered Plaintext Output:",q.textContent=H;const E=document.getElementById("btn-copy-result");E&&(E.onclick=()=>{navigator.clipboard.writeText(H).then(()=>{const t=E.innerHTML;E.innerHTML=`
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          <span>✓ Copied!</span>
        `,setTimeout(()=>{E.innerHTML=t},2e3)})})}function G(o){const i={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"};return o.replace(/[&<>"']/g,a=>i[a])}document.addEventListener("DOMContentLoaded",()=>{U();const o=document.getElementById("btn-back");o&&o.addEventListener("click",()=>{window.location.href="index.html"});const i=document.getElementById("btn-back-bottom");i&&i.addEventListener("click",()=>{window.location.href="index.html"});const a=()=>{Z(),window.location.href="index.html"},e=document.getElementById("btn-reset-top");e&&e.addEventListener("click",a);const d=document.getElementById("btn-reset-bottom");d&&d.addEventListener("click",a),console.log("Hill Cipher Page 2 (Calculation & Results) initialized.")});
