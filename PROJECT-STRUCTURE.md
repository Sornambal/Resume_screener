# Resume_screener — Project Structure

## Project Overview

Resume_screener is a recruiter-focused screening pipeline that evaluates candidate resumes against a job description using a hybrid approach:
- Semantic similarity (embeddings + FAISS)
- Deterministic LLM scoring (Groq) with 3 runs + QA checks (NLI)
- Audit logging and a React-based UI for review and inspection

This repository contains a FastAPI backend and a Vite + React frontend.

## High-level Architecture Flow

1. Frontend uploads Job Description (JD) and resumes to `POST /api/upload`.
2. Files are persisted under `backend/uploads/{session_id}`.
3. User triggers screening: `POST /api/screen/{session_id}`.
4. Backend extracts text (PDF/MD/TXT) via `backend/services/extractor.py`.
5. Semantic similarity: `backend/services/embedder.py` encodes texts with `sentence-transformers` and computes a FAISS score in [0,1].
6. LLM scoring: `backend/services/scorer.py` calls Groq `chat.completions.create` with a strict JSON prompt (3 runs by default) and parses `response.choices[0].message.content`.
7. QA checks: `backend/services/qa_checker.py` computes variance and runs a Cross-Encoder NLI model to detect contradictions.
8. Final score: weighted blend of mean LLM score and semantic score (see `backend/config.py`).
9. Results (full audit) are saved to `backend/results/{session_id}.json` and displayed by the frontend.

## Folder Structure

- `backend/` — FastAPI application and services
  - `main.py` — app bootstrap, model warmup on startup
  - `config.py` — configuration and secrets (reads `backend/.env`)
  - `routers/` — API endpoints
    - `upload.py` — `POST /api/upload`
    - `screen.py` — `POST /api/screen/{session_id}` pipeline
    - `results.py` — `GET /api/results/{session_id}`
  - `services/` — core pipeline modules
    - `extractor.py` — PDF/MD/TXT → plain text
    - `embedder.py` — sentence-transformers + FAISS similarity
    - `scorer.py` — Groq LLM prompting, parsing, and retries
    - `qa_checker.py` — variance checks + NLI contradiction detection
    - `storage.py` — session file handling and result persistence
  - `models/` — Pydantic request/response schemas
- `frontend/` — React + Vite UI
  - `src/components/` — CandidateCard.jsx, QABadge.jsx, AuditDrawer.jsx, etc.
  - `index.html`, `vite.config.js`, `tailwind.config.js`
- `.env` — local secrets (GROQ_API_KEY) — do NOT commit this file
- `README.md`, `RUN_COMMANDS.md`, `SETUP.md` — docs and run instructions

## Key Files to Inspect

- `backend/services/scorer.py` — prompt used and Groq parsing logic
- `backend/services/embedder.py` — embedding and FAISS usage
- `backend/services/qa_checker.py` — NLI check and variance thresholds
- `backend/routers/screen.py` — the screening orchestration
- `frontend/src/components/CandidateCard.jsx` — score display and audit trigger

## How it Works (technically)

- Extraction: uses PyMuPDF for PDFs and fallback markdown/html extraction for MD/TXT.
- Embeddings: `all-MiniLM-L6-v2` encodes texts and the code normalizes vectors; FAISS IndexFlatIP is used to compute cosine-like similarity.
- LLM Prompting: a strict system/user prompt asks the model to return ONLY JSON of the schema {score, justification, strengths, gaps}. The app runs multiple independent LLM calls to observe variance.
- QA: score variance and a `cross-encoder/nli-deberta-v3-small` model compare run justifications; contradictory or high-variance outputs are flagged in the UI.

## Running Locally

1. Install backend dependencies:

```powershell
cd backend
python -m pip install -r requirements.txt
```

2. Start backend (from repo root recommended):

```powershell
cd C:\Users\SORNAMBAL\Desktop\Resume_screener
python -m uvicorn backend.main:app --reload --host 127.0.0.1 --port 8000
```

If you prefer to run from `backend/`, set `PYTHONPATH` to repo root first:

```powershell
cd backend
$env:PYTHONPATH = ".."
python -m uvicorn backend.main:app --reload --host 127.0.0.1 --port 8000
```

3. Install & run frontend:

```bash
cd frontend
npm install
npm run dev
```

Open the frontend URL shown by Vite and upload JD + resumes.

## Converting to RAG (optional)

This project is not a RAG implementation out-of-the-box — it uses FAISS only for a semantic match score. To convert to RAG:

1. Chunk resumes and JD into smaller passages and index each passage with embeddings.
2. During screening, retrieve top-K passages for each resume (or JD query) with FAISS.
3. Inject retrieved passages into the LLM prompt (or use Groq's `documents` param) and ask the model to cite supporting passages.
4. Persist provenance (which passage/file produced each claim) in the audit JSON.

## Security & Privacy Notes

- Keep `GROQ_API_KEY` in `backend/.env` and out of source control. The code reads it in `backend/config.py`.
- Audit JSON should not store raw secrets or unredacted PII longer than necessary depending on your compliance needs.

## Where to look next / Suggested improvements

- Harden prompt parsing using Groq's structured-parsing option if available (avoid regex). See `backend/services/scorer.py`.
- Add caching for embeddings and reuse the same FAISS index for repeated JDs.
- Add more observability: timing and errors for each pipeline stage.

---

File created: `PROJECT-STRUCTURE.md`
