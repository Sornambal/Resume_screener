"""Screening router for running candidate evaluation."""
from fastapi import APIRouter, HTTPException, status
from pathlib import Path
from ..services import storage, extractor, embedder, scorer, qa_checker
from ..models.schemas import ScreeningResponse, CandidateResult
from ..config import SCORE_RUNS, SEMANTIC_WEIGHT, LLM_WEIGHT, UPLOAD_DIR

router = APIRouter(prefix="/api", tags=["screening"])


@router.post("/screen/{session_id}", response_model=ScreeningResponse)
async def run_screening(session_id: str):
    """
    Run screening evaluation on uploaded resumes against JD.
    
    Process:
    1. Extract text from JD and resumes
    2. Calculate semantic similarity for each resume
    3. Run LLM scoring 3 times for each candidate
    4. Run QA checks on consistency
    5. Rank candidates by final score
    """
    session_dir = UPLOAD_DIR / session_id
    
    if not session_dir.exists():
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Session {session_id} not found",
        )
    
    files = list(session_dir.iterdir())
    if not files:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No files found in session",
        )
    
    # Find JD and resume files
    jd_file = None
    resume_files = []
    
    for file_path in files:
        if file_path.is_file():
            if jd_file is None:
                jd_file = file_path
            else:
                resume_files.append(file_path)
    
    if not jd_file:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No job description file found",
        )
    
    if not resume_files:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No resume files found",
        )
    
    # Extract text from JD
    try:
        jd_text = extractor.extract_text(str(jd_file))
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to extract JD text: {str(e)}",
        )
    
    # Process each resume
    candidates = []
    
    for resume_path in resume_files:
        try:
            # Extract resume text
            resume_text = extractor.extract_text(str(resume_path))
            
            # Calculate semantic similarity
            semantic_sim = embedder.semantic_score(jd_text, resume_text)
            
            # Run LLM scoring SCORE_RUNS times
            score_results = []
            for run_idx in range(SCORE_RUNS):
                score_result = scorer.score_candidate(jd_text, resume_text, run_idx)
                score_results.append(score_result)
            
            # Run QA checks
            qa_report = qa_checker.run_qa(score_results)
            
            # Calculate final score
            mean_llm_score = sum(r.score for r in score_results) / len(score_results)
            final_score = (mean_llm_score * LLM_WEIGHT) + (semantic_sim * 100 * SEMANTIC_WEIGHT)
            
            candidate = CandidateResult(
                resume_filename=resume_path.name,
                semantic_score=semantic_sim,
                llm_runs=score_results,
                qa_report=qa_report,
                final_score=final_score,
                rank=0,  # Will be set after sorting
            )
            candidates.append(candidate)
        
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to screen resume {resume_path.name}: {str(e)}",
            )
    
    # Sort by final score descending and assign ranks
    candidates.sort(key=lambda x: x.final_score, reverse=True)
    for rank, candidate in enumerate(candidates, 1):
        candidate.rank = rank
    
    # Save results
    try:
        results_data = {
            "session_id": session_id,
            "jd_filename": jd_file.name,
            "candidates": [c.model_dump() for c in candidates],
        }
        results_path = storage.save_results(session_id, results_data)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to save results: {str(e)}",
        )
    
    return ScreeningResponse(
        session_id=session_id,
        candidates=candidates,
        audit_log_path=str(results_path),
    )
