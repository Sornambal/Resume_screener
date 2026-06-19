# 🚀 Run Commands - Resume Screening QA System

## Quick Reference

This document provides all the commands needed to run the project.

---

## 📋 Prerequisites

Before running, ensure you have:
- ✅ Python 3.11+ installed (`python --version`)
- ✅ Node.js 18+ installed (`node --version`)
- ✅ Groq API key (get free at https://console.groq.com)

---

## 🔧 Setup (One-Time)

### 1. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create .env file with your API key
# On Windows PowerShell:
@"
GROQ_API_KEY=gsk_your_actual_key_here
"@ | Out-File -Encoding UTF8 .env

# Or manually create backend/.env and add:
# GROQ_API_KEY=gsk_your_actual_key_here

# Install Python dependencies
pip install -r requirements.txt
```

### 2. Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install Node dependencies
npm install
```

---

## ▶️ Run Commands

### Option 1: Run Both (Recommended for Development)

**Terminal 1 - Backend:**
```bash
cd backend
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

Then open: **http://localhost:5173**

---

### Option 2: Run Backend Only (API Server)

```bash
cd backend
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

**Access:**
- API: http://localhost:8000
- Swagger Docs: http://localhost:8000/docs
- ReDoc Docs: http://localhost:8000/redoc

---

### Option 3: Run Frontend Only (Connect to External Backend)

```bash
cd frontend
npm run dev
```

**Note:** Update `frontend/.env` if backend is on different host:
```
VITE_API_URL=http://your-backend-url:8000
```

---

## 📊 What Each Command Does

### Backend Commands

| Command | Purpose |
|---------|---------|
| `uvicorn main:app --reload` | Start dev server with auto-reload on code changes |
| `uvicorn main:app --reload --host 0.0.0.0 --port 8000` | Start on port 8000, accessible from any IP |
| `uvicorn main:app` | Start production server (no auto-reload) |
| `python main.py` | Alternative startup method |

### Frontend Commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start Vite dev server with hot reload |
| `npm run build` | Build for production (creates `dist/` folder) |
| `npm run preview` | Preview production build locally |

---

## 🎯 Complete Workflow

### Step 1: First Time Setup
```bash
# Backend
cd backend
pip install -r requirements.txt

# Frontend
cd frontend
npm install
```

### Step 2: Configure API Key
```bash
# Edit backend/.env
# Add: GROQ_API_KEY=gsk_your_actual_key_here
```

### Step 3: Run Backend (Terminal 1)
```bash
cd backend
uvicorn main:app --reload
```

**Wait for:**
```
INFO:     Uvicorn running on http://0.0.0.0:8000
```

### Step 4: Run Frontend (Terminal 2)
```bash
cd frontend
npm run dev
```

**Wait for:**
```
  VITE v5.0.8  ready in 245 ms

  ➜  Local:   http://localhost:5173/
```

### Step 5: Use the System
- Open http://localhost:5173 in browser
- Upload JD and resume files
- Click "Start Screening"

---

## 🔄 Development Workflow

### Modify Backend Code
1. Edit `backend/services/` or `backend/routers/`
2. Backend auto-reloads (thanks to `--reload`)
3. Refresh browser if needed

### Modify Frontend Code
1. Edit `frontend/src/components/` or `frontend/src/`
2. Frontend hot-reloads automatically
3. Changes appear instantly in browser

### Update Dependencies
```bash
# Backend
cd backend
pip install -r requirements.txt

# Frontend
cd frontend
npm install
```

---

## 🛑 Stop Running Services

### Windows PowerShell
```bash
# Stop backend (in Terminal 1)
Ctrl + C

# Stop frontend (in Terminal 2)
Ctrl + C
```

### Linux/Mac
```bash
# Same as above
Ctrl + C
```

---

## 🐛 Common Issues & Fixes

### ❌ "Port 8000 already in use"
```bash
# Use different port
uvicorn main:app --reload --port 8001
```

### ❌ "GROQ_API_KEY not found"
```bash
# Check backend/.env exists and has correct key
cat backend/.env

# Or set as environment variable
$env:GROQ_API_KEY = "gsk_your_key_here"
uvicorn main:app --reload
```

### ❌ "npm command not found"
```bash
# Install Node.js from https://nodejs.org
node --version  # Should show v18+
```

### ❌ "pip command not found"
```bash
# Install Python from https://python.org
python --version  # Should show 3.11+
```

### ❌ Models downloading on first run (slow)
```
✓ Normal behavior - ~1-2 GB download
✓ Cached for future runs
✓ Continue waiting...
```

---

## 📊 Verify Everything Works

### Backend Health Check
```bash
# After backend starts, in another terminal:
curl http://localhost:8000/health
# Expected response: {"status":"healthy"}

# Or visit http://localhost:8000/docs in browser
```

### Frontend Connection
```bash
# Frontend should show in console:
# [3:11:23 PM] [vite] connected
```

---

## 🚢 Production Commands

### Build Frontend
```bash
cd frontend
npm run build
```
Creates optimized `frontend/dist/` folder for deployment.

### Run Production Backend
```bash
cd backend

# Using Gunicorn (production-grade)
pip install gunicorn
gunicorn -w 4 -k uvicorn.workers.UvicornWorker main:app --bind 0.0.0.0:8000

# Or use uvicorn without reload
uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4
```

---

## 📚 Useful Commands Reference

```bash
# Check Python version
python --version

# Check Node version
node --version

# List installed Python packages
pip list

# List installed Node packages
npm list

# View backend logs in real-time
# (Already shown in terminal running uvicorn)

# Clear frontend cache
rm -r frontend/node_modules
npm install

# Reset backend
rm -r backend/uploads/*
rm -r backend/results/*
```

---

## ✅ Quick Copy-Paste Setup

### For Windows PowerShell:

```powershell
# Terminal 1
cd backend
python -m pip install -r requirements.txt
uvicorn main:app --reload

# Terminal 2
cd frontend
npm install
npm run dev
```

### For Linux/Mac:

```bash
# Terminal 1
cd backend
pip install -r requirements.txt
uvicorn main:app --reload

# Terminal 2
cd frontend
npm install
npm run dev
```

---

## 🎯 Summary

| Task | Command |
|------|---------|
| **First Time Setup** | `pip install -r requirements.txt` + `npm install` |
| **Run Backend** | `cd backend && uvicorn main:app --reload` |
| **Run Frontend** | `cd frontend && npm run dev` |
| **Check Backend** | http://localhost:8000/docs |
| **Use App** | http://localhost:5173 |
| **Build for Production** | `npm run build` |
| **Stop Services** | `Ctrl + C` |

---

**You're all set! Happy screening! 🚀**
