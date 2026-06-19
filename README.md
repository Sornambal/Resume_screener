# 🎯 Resume Screening QA System

> A production-grade recruitment QA tool that evaluates resumes with **consistency checking** and **LLM verification**

## 📖 Table of Contents
- [Overview](#overview)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [How to Use](#how-to-use)
- [Understanding QA Flags](#understanding-qa-flags)
- [API Documentation](#api-documentation)
- [Configuration](#configuration)
- [Troubleshooting](#troubleshooting)

---

## 🎯 Overview

This tool solves a critical recruitment problem: **ensuring LLM evaluations are consistent and trustworthy**.

### The Problem
- Single LLM scores can be unreliable, even with temperature=0
- Recruiters have no visibility into scoring confidence
- Contradictory evaluations slip through without detection

### The Solution
✅ **Runs evaluation 3 times** per candidate → detects variance  
✅ **Flags inconsistencies** with confidence bands → recruiters know what to trust  
✅ **Detects contradictions** via NLI → catches conflicting justifications  
✅ **Provides audit trails** → full transparency on all scoring runs  
✅ **Combines semantic + LLM** → robust ranking  

**Result**: High-quality candidate evaluations with built-in quality assurance.

---

## 🚀 Key Features

| Feature | Details |
|---------|---------|
| **Multi-Format Support** | PDF, Markdown, plain text resumes and JDs |
| **Local Semantic Search** | FAISS + sentence-transformers (no external API) |
| **3-Run LLM Scoring** | Groq API (LLaMA-3) with consistent prompting |
| **QA Flags** | PASS ✓ / WARN ⚠ / FAIL ✗ based on consistency |
| **Audit Logs** | Complete JSON trails with all 3 runs |
| **Contradiction Detection** | NLI model catches conflicting evaluations |
| **Confidence Bands** | Score ranges and variance visualization |
| **Ranked Results** | Candidates sorted by final composite score |

---

## 🛠️ Tech Stack

### Backend
- **Language**: Python 3.11
- **API Framework**: FastAPI + Uvicorn
- **Embeddings**: `sentence-transformers` (all-MiniLM-L6-v2)
- **Vector Search**: FAISS (CPU)
- **LLM Scoring**: Groq API (llama3-8b-8192)
- **Text Parsing**: PyMuPDF, markdown, BeautifulSoup4
- **Contradiction Detection**: cross-encoder/nli-deberta-v3-small

### Frontend
- **Framework**: React 18 + Vite
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Design System**: Dark theme with teal accents

### Storage
- **Local filesystem** (no database required)
- **Session-based** file organization
- **JSON audit logs** per screening

---

## ⚡ Quick Start

### Prerequisites
- Python 3.11+
- Node.js 18+
- Groq API key (free at [console.groq.com](https://console.groq.com))

### Step 1: Clone & Setup Backend

```bash
# Navigate to project
cd Resume_screener/backend

# Create .env file with your Groq API key
echo "GROQ_API_KEY=gsk_your_actual_key_here" > .env

# Install dependencies
pip install -r requirements.txt

# Start server
uvicorn main:app --reload
```

**Server runs at**: http://localhost:8000  
**API Docs**: http://localhost:8000/docs

### Step 2: Setup Frontend (new terminal)

```bash
cd frontend

# Install dependencies
npm install

# Start dev server
npm run dev
```

**Opens at**: http://localhost:5173

### Step 3: Use the System

1. Go to http://localhost:5173
2. Drag-drop a Job Description file (PDF/MD/TXT)
3. Drag-drop one or more Resume files
4. Click **"Start Screening"**
5. View ranked candidates with QA flags and audit logs

---

## 📁 Project Structure

```
resume-qa-system/
├── backend/
│   ├── main.py                    # FastAPI app entry point
│   ├── config.py                  # Configuration & constants
│   ├── routers/
│   │   ├── upload.py             # POST /api/upload
│   │   ├── screen.py             # POST /api/screen/{session_id}
│   │   └── results.py            # GET /api/results/{session_id}
│   ├── services/
│   │   ├── extractor.py          # Text extraction (PDF/MD/TXT)
│   │   ├── embedder.py           # FAISS semantic search
│   │   ├── scorer.py             # Groq LLM scoring (3x runs)
│   │   ├── qa_checker.py         # Consistency + NLI checks
│   │   └── storage.py            # File/session management
│   ├── models/
│   │   └── schemas.py            # Pydantic models
│   ├── uploads/                  # Session files (auto-created)
│   ├── results/                  # Audit logs (auto-created)
│   ├── requirements.txt
│   └── .env                       # (Not tracked - add your key)
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx               # Main app container
│   │   ├── main.jsx              # React entry
│   │   ├── index.css             # Theme & tailwind
│   │   ├── components/
│   │   │   ├── FileUpload.jsx        # Drag-drop zones
│   │   │   ├── CandidateCard.jsx     # Score display + QA badge
│   │   │   ├── QABadge.jsx          # PASS/WARN/FAIL badge
│   │   │   ├── AuditDrawer.jsx      # Full run details (slide-in)
│   │   │   └── LoadingScreen.jsx    # Progress animation
│   │   ├── api/
│   │   │   └── client.js         # Axios + API calls
│   │   └── assets/
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.cjs
│   ├── package.json
│   └── .env                       # (Not tracked - optional)
│
├── README.md                      # This file
├── SETUP.md                       # Alternative setup guide
└── .gitignore
```

---

## 📖 How to Use

### Workflow

```
Upload Files
    ↓
Extraction & Embeddings
    ↓
Run 3 LLM Scoring Passes
    ↓
QA Consistency Checks
    ↓
Rank & Display Results
```

### Step-by-Step

#### 1️⃣ Upload Phase
- Upload **1 Job Description** (JD) file
- Upload **1+ Resume** files
- Supported formats: `.pdf`, `.md`, `.txt`
- Click **"Start Screening"**

#### 2️⃣ Processing Phase (Automatic)
- Extract text from all files
- Generate embeddings (FAISS index)
- Run LLM scorer 3 times per candidate
- Compute semantic similarity
- Perform QA consistency checks
- Rank candidates by composite score

#### 3️⃣ Results Phase
View each candidate:
- **Rank** (#1, #2, etc.)
- **Final Score** (0-100, circular progress ring)
- **Semantic Match** (0-100%, horizontal bar)
- **QA Badge** (consistency status)
- **3 LLM Run Scores** (expandable details)
- **View Audit Log** button (full transparency)

#### 4️⃣ Audit Log (Click "View Audit Log")
See:
- All 3 scoring runs with full justifications
- Score variance & range
- Contradiction detection results
- Score distribution chart
- NLI analysis details

---

## 🚦 Understanding QA Flags

### ✅ PASS (Green Badge)
```
Status: Consistent & reliable
Criteria:
  • Score variance ≤ 10 points
  • No contradictions detected
Meaning: High confidence in this evaluation
Action: Trust this score for hiring decisions
```

### ⚠️ WARN (Amber Badge)
```
Status: Borderline/uncertain
Criteria:
  • Variance > 10 points OR contradictions (not both)
Meaning: LLM had some uncertainty
Action: Review manually; likely a borderline candidate
```

### ✗ FAIL (Red Badge)
```
Status: Unreliable
Criteria:
  • BOTH variance > 10 points AND contradictions
Meaning: Major inconsistency detected
Action: Do NOT use this score; get human review
```

---

## 📊 Scoring Formula

```
final_score = (mean_llm_score × 0.6) + (semantic_score × 100 × 0.4)
              └─ LLM dominates ─┘      └─ Semantic match ─┘
```

- **LLM Score** (60%): Mean of 3 runs (0–100)
- **Semantic Score** (40%): FAISS cosine similarity (0–1, scaled to 100)
- **Variance Detection**: Flags if max–min > 10 across 3 runs

---

## 🔌 API Documentation

### 1. Upload Files
```
POST /api/upload
Content-Type: multipart/form-data

Request:
  jd_file: File (required, single)
  resume_files: File[] (required, 1+)

Response (200):
{
  "session_id": "a1b2c3d4",
  "jd_filename": "job_description.pdf",
  "resume_filenames": ["alice.pdf", "bob.md"]
}

Error (400):
  Invalid file type or missing files
```

### 2. Run Screening
```
POST /api/screen/{session_id}

Response (200): ScreeningResponse
{
  "session_id": "a1b2c3d4",
  "candidates": [
    {
      "resume_filename": "alice.pdf",
      "rank": 1,
      "semantic_score": 0.78,
      "final_score": 82.4,
      "llm_runs": [...],
      "qa_report": {...}
    }
  ],
  "audit_log_path": "./results/a1b2c3d4.json"
}

Error (404):
  Session not found
Error (500):
  Processing error (check logs)
```

### 3. Get Results
```
GET /api/results/{session_id}

Response (200):
  Full JSON audit log from screening

Error (404):
  Results not found
```

---

## ⚙️ Configuration

Edit `backend/config.py`:

| Variable | Default | Purpose |
|----------|---------|---------|
| `SCORE_RUNS` | 3 | Number of LLM scoring passes |
| `VARIANCE_THRESHOLD` | 10 | Max allowed score variance |
| `EMBEDDING_MODEL` | all-MiniLM-L6-v2 | Lightweight embeddings |
| `LLM_MODEL` | llama3-8b-8192 | Groq model |
| `LLM_TEMPERATURE` | 0 | For reproducibility |
| `LLM_MAX_TOKENS` | 600 | Response limit |
| `NLI_MODEL` | cross-encoder/nli-deberta-v3-small | Contradiction detection |
| `SEMANTIC_WEIGHT` | 0.4 | Semantic score weight |
| `LLM_WEIGHT` | 0.6 | LLM score weight |

---

## 🔧 Troubleshooting

### ❌ "GROQ_API_KEY not found"
**Solution:**
```bash
# backend/.env
GROQ_API_KEY=gsk_your_actual_key_here
```
- Restart backend after updating
- Get free key at https://console.groq.com

### ❌ Models downloading on startup (slow first run)
**Normal behavior:**
- First run downloads embeddings & NLI models (~1-2 GB)
- Cached in `~/.cache/huggingface/`
- Subsequent runs are much faster

### ❌ CORS errors in browser console
**Solution:** Backend CORS is enabled for dev. For production, edit `backend/main.py`:
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://yourdomain.com"],  # Add your domain
    ...
)
```

### ❌ "Connection refused" when accessing http://localhost:8000
**Check:**
1. Backend running? `uvicorn main:app --reload`
2. Port 8000 available? `netstat -an | grep 8000`
3. Firewall blocking? Check Windows Defender

### ❌ Frontend shows "Error during screening"
**Check logs:**
- Backend terminal for error messages
- Check `/results/{session_id}.json` for details
- Ensure files are valid (not corrupted PDFs)

### ❌ "FAISS library not found"
**Solution:**
```bash
pip install --force-reinstall faiss-cpu
```

---

## 🔒 Security & Privacy

- ✅ **Local Processing**: Text extraction happens locally — no files sent externally
- ✅ **Embeddings**: all-MiniLM runs on your machine
- ✅ **Groq API**: Only LLM scoring calls Groq; no PII logging
- ✅ **File Storage**: `./uploads/{session_id}/` — clean up after use
- ✅ **No Database**: Everything is JSON files
- ✅ **No Tracking**: Not sending telemetry

---

## 📝 Results JSON Structure

Saved to `./results/{session_id}.json`:

```json
{
  "session_id": "a1b2c3d4",
  "jd_filename": "job_description.pdf",
  "candidates": [
    {
      "resume_filename": "alice.pdf",
      "rank": 1,
      "semantic_score": 0.78,
      "final_score": 82.4,
      "llm_runs": [
        {
          "run_index": 0,
          "score": 85,
          "justification": "Strong match with 5+ years experience",
          "strengths": ["Expert in Python", "Leadership experience"],
          "gaps": ["No ML background"]
        }
      ],
      "qa_report": {
        "is_consistent": true,
        "score_variance": 3.0,
        "min_score": 84,
        "max_score": 87,
        "mean_score": 85.3,
        "contradiction_detected": false,
        "flag_level": "PASS"
      }
    }
  ]
}
```

---

## 🎨 UI Design System

**Colors:**
- Background: `#0D1117` (dark navy)
- Cards: `#161B22` (slightly lighter)
- Accent: `#64FFDA` (teal/cyan)
- Borders: `#30363D` (subtle gray)

**Typography:**
- Scores & labels: JetBrains Mono (monospace)
- Body text: System sans-serif

**Components:**
- Dark theme for recruiter eye comfort
- Circular progress rings for scores
- Horizontal bars for semantic match
- Slide-in audit drawer (GitHub PR style)
- PASS/WARN/FAIL color-coded badges

---

## 🚢 Deployment

### Local Development
```bash
# Terminal 1 - Backend
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# Terminal 2 - Frontend
cd frontend
npm install
npm run dev
```

### Production Build
```bash
# Frontend
cd frontend
npm run build  # Creates ./dist folder

# Backend (use production ASGI server)
pip install gunicorn
gunicorn -w 4 -k uvicorn.workers.UvicornWorker main:app
```

### Docker (Optional)
```dockerfile
FROM python:3.11
WORKDIR /app
COPY backend/requirements.txt .
RUN pip install -r requirements.txt
COPY backend .
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

---

## 📚 Additional Resources

- **Groq API Docs**: https://console.groq.com/docs
- **sentence-transformers**: https://huggingface.co/sentence-transformers
- **FAISS Documentation**: https://github.com/facebookresearch/faiss
- **FastAPI**: https://fastapi.tiangolo.com
- **React**: https://react.dev

---

## 📄 License

MIT License - feel free to use and modify

## 🤝 Contributing

Issues and PRs welcome. Please open an issue for feature requests.

---

**Built with transparency in mind.** Every score comes with its audit trail. 🔍