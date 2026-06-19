from pydantic import BaseModel
from typing import Optional


class UploadResponse(BaseModel):
    session_id: str
    jd_filename: str
    resume_filenames: list[str]


class ScoreResult(BaseModel):
    run_index: int
    score: int  # 0-100
    justification: str
    strengths: list[str]
    gaps: list[str]


class QAReport(BaseModel):
    is_consistent: bool
    score_variance: float
    min_score: int
    max_score: int
    mean_score: float
    contradiction_detected: bool
    contradiction_detail: Optional[str] = None
    flag_level: str  # "PASS", "WARN", "FAIL"


class CandidateResult(BaseModel):
    resume_filename: str
    semantic_score: float  # 0.0 to 1.0 from FAISS cosine sim
    llm_runs: list[ScoreResult]
    qa_report: QAReport
    final_score: float  # mean of LLM scores weighted with semantic score
    rank: int


class ScreeningResponse(BaseModel):
    session_id: str
    candidates: list[CandidateResult]
    audit_log_path: str
