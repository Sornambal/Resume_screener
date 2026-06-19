"""Embeddings and FAISS semantic search."""
import numpy as np
from sentence_transformers import SentenceTransformer
import faiss
from ..config import EMBEDDING_MODEL

# Global model cache
_model = None


def load_model():
    """Load and cache the embedding model."""
    global _model
    if _model is None:
        _model = SentenceTransformer(EMBEDDING_MODEL)
    return _model


def embed(text: str) -> np.ndarray:
    """
    Encode text to embedding vector.
    
    Args:
        text: Input text
        
    Returns:
        Normalized embedding vector
    """
    model = load_model()
    embedding = model.encode(text, normalize_embeddings=True)
    return np.array(embedding, dtype=np.float32)


def semantic_score(jd_text: str, resume_text: str) -> float:
    """
    Calculate semantic similarity between JD and resume using FAISS.
    
    Args:
        jd_text: Job description text
        resume_text: Resume text
        
    Returns:
        Similarity score 0.0 to 1.0
    """
    # Embed both texts
    jd_embedding = embed(jd_text)
    resume_embedding = embed(resume_text)
    
    # Create FAISS index with inner product (cosine similarity on normalized vectors)
    dimension = len(jd_embedding)
    index = faiss.IndexFlatIP(dimension)
    
    # Add JD embedding to index
    index.add(np.array([jd_embedding], dtype=np.float32))
    
    # Query with resume embedding
    distances, _ = index.search(np.array([resume_embedding], dtype=np.float32), 1)
    
    # Score is in range [0, 1] for normalized vectors
    score = float(distances[0][0])
    return max(0.0, min(1.0, score))  # Clamp to [0, 1]
