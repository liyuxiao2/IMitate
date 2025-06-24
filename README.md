<h1>🧠 IMitate – AI-Powered Medical Education Assistant</h1>

<p><strong>IMitate</strong> is a voice-enabled medical chatbot that simulates virtual patient interactions. Designed for medical students, it offers a realistic, AI-driven environment to practice clinical reasoning, interviewing, and diagnostic skills.</p>

<hr />

<h2>🚀 Getting Started</h2>

<p>This is a <a href="https://nextjs.org" target="_blank">Next.js</a> project for the frontend, with a <a href="https://fastapi.tiangolo.com" target="_blank">FastAPI</a> backend and <a href="https://deepmind.google/technologies/gemini" target="_blank">Google Gemini</a> LLM integration.</p>

<h3>1. Clone the repository</h3>
<pre><code>git clone https://github.com/your-username/imitate.git
cd imitate
</code></pre>

<h3>2. Install dependencies</h3>
<pre><code>npm install
# or
yarn install
</code></pre>

<h3>3. Start the development server</h3>
<pre><code>npm run dev</code></pre>
<p>Visit <a href="http://localhost:3000" target="_blank">http://localhost:3000</a> to view the app.</p>

<h3>4. Run the backend (FastAPI)</h3>
<pre><code>cd backend
uvicorn src.api.main:app --reload
</code></pre>

<p>Make sure to set your environment variable for the Gemini API key in <code>.env</code>:</p>
<pre><code>GEMINI_API_KEY=your-key-here</code></pre>

<hr />

<h2>🛠️ Tech Stack</h2>
<ul>
  <li><strong>Frontend</strong>: Next.js 14, TypeScript, Tailwind CSS, shadcn/ui</li>
  <li><strong>Backend</strong>: FastAPI (Python)</li>
  <li><strong>Database</strong>: SQLite (seeded with patient data)</li>
  <li><strong>LLM</strong>: Google Gemini API</li>
  <li><strong>Voice Input</strong>: react-speech-recognition</li>
</ul>

<hr />

<h2>✨ Features</h2>
<ul>
  <li>🔄 Dynamic chatbot powered by LLM</li>
  <li>🎙️ Voice-to-text interaction</li>
  <li>🩺 Simulated patients with realistic personalities, symptoms, and medical history</li>
  <li>📚 Structured prompt generation with personality-guided dialogue</li>
  <li>🧠 Clinical reasoning support for early-stage medical learners</li>
</ul>

<hr />

<h2>🧩 Project Structure</h2>
<pre><code>
imitate/
├── app/                  # Next.js frontend
├── backend/              # FastAPI backend
│   ├── src/api/          # API routes and logic
│   ├── database.py       # SQLite access
│   └── .env              # API key and config
├── public/               # Static files
├── README.md
└── package.json
</code></pre>

<hr />

<h2>🧪 Sample Prompt</h2>
<pre><code>
You are a patient simulator for a medical student. Respond in first person based on the provided details.

--- PATIENT DETAILS ---
Name: Alice Kim
Age: 34
Primary Complaint: Severe headache
Symptoms: Throbbing pain, nausea, sensitivity to light
Personality: Quiet and observant
Medical History: Occasional migraines
--- END DETAILS ---

Medical Student's Question: "How long have you had this headache?"
</code></pre>

<hr />

<hr />

<h2>🤝 Contributors</h2>
<ul>
  <li><a href="https://github.com/liyuxiao2" target="_blank">Liyu Xiao</a></li>
  <li><a href="https://github.com/jeffguo-06" target="_blank">Jeff Guo</a></li>
  <li> Arian Emamjomeh, </li>
  <li> Chris Zhu</li>
</ul>

<hr />

<h2>📜 License</h2>
<p>This project is licensed under the MIT License.</p>
