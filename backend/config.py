import os
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

# API Configuration
GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")
if not GROQ_API_KEY:
    raise ValueError("GROQ_API_KEY not found in environment variables")

# File Storage
UPLOAD_DIR = Path("./uploads")
RESULTS_DIR = Path("./results")

UPLOAD_DIR.mkdir(exist_ok=True)
RESULTS_DIR.mkdir(exist_ok=True)

# QA Configuration
SCORE_RUNS = 3
VARIANCE_THRESHOLD = 10  # Flag if score range > 10 points

# Model Configuration
EMBEDDING_MODEL = "all-MiniLM-L6-v2"
LLM_MODEL = "llama-3.1-8b-instant"
NLI_MODEL = "cross-encoder/nli-deberta-v3-small"

# Allowed file extensions
ALLOWED_EXTENSIONS = {".pdf", ".md", ".txt"}

# Scoring weights
SEMANTIC_WEIGHT = 0.4
LLM_WEIGHT = 0.6

# LLM Parameters
LLM_TEMPERATURE = 0
LLM_MAX_TOKENS = 600
