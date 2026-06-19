# Resume Screening QA System - Setup Complete

This directory contains a complete, production-ready resume screening system with built-in QA consistency checking.

## Quick Start

### 1. Backend Setup
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

Visit `http://localhost:5173` when both are running.

## What You Have

✅ Backend: FastAPI server with semantic + LLM scoring  
✅ Frontend: React UI with dark theme and audit trails  
✅ QA Layer: 3-run consistency detection + NLI contradiction checking  
✅ Full Documentation: See README.md

## Key Features

- **Semantic Search**: FAISS + sentence-transformers (local, no API)
- **LLM Scoring**: Groq API with 3 runs for QA
- **Consistency Flags**: PASS/WARN/FAIL based on variance and contradictions
- **Audit Logs**: Full transparency on all scoring decisions
- **File Support**: PDF, Markdown, plain text

## First Run

The backend will download models on first startup (~1-2 GB):
- `all-MiniLM-L6-v2` (embeddings)
- `cross-encoder/nli-deberta-v3-small` (contradiction detection)

Subsequent runs are much faster.

## Environment

Both `.env` files are already configured:
- `backend/.env` has your Groq API key
- `frontend/.env` points to localhost:8000

Enjoy the QA system! 🚀
