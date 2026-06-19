"""File storage and session management."""
import json
from uuid import uuid4
from pathlib import Path
from ..config import UPLOAD_DIR, RESULTS_DIR


def generate_session_id() -> str:
    """Generate a unique session ID."""
    return str(uuid4())[:8]


def save_upload(session_id: str, file_path: Path, file_name: str) -> Path:
    """
    Save an uploaded file to the uploads directory.
    
    Args:
        session_id: Session identifier
        file_path: Path to the uploaded file
        file_name: Name of the file
        
    Returns:
        Path where file was saved
    """
    session_dir = UPLOAD_DIR / session_id
    session_dir.mkdir(parents=True, exist_ok=True)
    
    dest_path = session_dir / file_name
    
    # Copy file to destination
    with open(file_path, "rb") as src:
        with open(dest_path, "wb") as dst:
            dst.write(src.read())
    
    return dest_path


def save_results(session_id: str, data: dict) -> Path:
    """
    Save screening results to JSON file.
    
    Args:
        session_id: Session identifier
        data: Results data dictionary
        
    Returns:
        Path where results were saved
    """
    RESULTS_DIR.mkdir(parents=True, exist_ok=True)
    results_path = RESULTS_DIR / f"{session_id}.json"
    
    with open(results_path, "w") as f:
        json.dump(data, f, indent=2)
    
    return results_path


def load_results(session_id: str) -> dict:
    """
    Load screening results from JSON file.
    
    Args:
        session_id: Session identifier
        
    Returns:
        Results data dictionary
        
    Raises:
        FileNotFoundError: If results file doesn't exist
    """
    results_path = RESULTS_DIR / f"{session_id}.json"
    
    if not results_path.exists():
        raise FileNotFoundError(f"Results not found for session {session_id}")
    
    with open(results_path, "r") as f:
        return json.load(f)


def get_session_files(session_id: str) -> list[Path]:
    """
    Get all files in a session directory.
    
    Args:
        session_id: Session identifier
        
    Returns:
        List of file paths
    """
    session_dir = UPLOAD_DIR / session_id
    
    if not session_dir.exists():
        return []
    
    return list(session_dir.iterdir())
