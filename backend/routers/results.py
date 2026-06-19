"""Results router for retrieving screening results."""
from fastapi import APIRouter, HTTPException, status
from ..services import storage

router = APIRouter(prefix="/api", tags=["results"])


@router.get("/results/{session_id}")
async def get_results(session_id: str):
    """
    Retrieve screening results for a session.
    """
    try:
        results = storage.load_results(session_id)
        return results
    except FileNotFoundError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Results not found for session {session_id}",
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to load results: {str(e)}",
        )
