"""Upload router for JD and resumes."""
from fastapi import APIRouter, UploadFile, File, HTTPException, status
from typing import Annotated
from pathlib import Path
import tempfile
from ..services import storage, extractor
from ..models.schemas import UploadResponse
from ..config import ALLOWED_EXTENSIONS

router = APIRouter(prefix="/api", tags=["upload"])


@router.post("/upload", response_model=UploadResponse)
async def upload_files(
    jd_file: UploadFile = File(...),
    resume_files: Annotated[list[UploadFile], File(...)] = [],
):
    """
    Upload job description and resume files.
    
    Validates file types and saves them to session directory.
    """
    if not jd_file:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Job description file is required",
        )
    
    if not resume_files:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="At least one resume file is required",
        )
    
    # Validate JD file
    jd_ext = Path(jd_file.filename).suffix.lower()
    if jd_ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid JD file type. Allowed: {', '.join(ALLOWED_EXTENSIONS)}",
        )
    
    # Validate resume files
    for resume in resume_files:
        resume_ext = Path(resume.filename).suffix.lower()
        if resume_ext not in ALLOWED_EXTENSIONS:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid resume file type: {resume.filename}. Allowed: {', '.join(ALLOWED_EXTENSIONS)}",
            )
    
    # Generate session ID
    session_id = storage.generate_session_id()
    
    # Save JD file
    try:
        with tempfile.NamedTemporaryFile(delete=False) as tmp:
            content = await jd_file.read()
            tmp.write(content)
            tmp.flush()
            storage.save_upload(session_id, Path(tmp.name), jd_file.filename)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to save JD file: {str(e)}",
        )
    
    # Save resume files
    resume_filenames = []
    try:
        for resume in resume_files:
            with tempfile.NamedTemporaryFile(delete=False) as tmp:
                content = await resume.read()
                tmp.write(content)
                tmp.flush()
                storage.save_upload(session_id, Path(tmp.name), resume.filename)
                resume_filenames.append(resume.filename)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to save resume file: {str(e)}",
        )
    
    return UploadResponse(
        session_id=session_id,
        jd_filename=jd_file.filename,
        resume_filenames=resume_filenames,
    )
