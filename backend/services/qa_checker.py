"""QA checking and contradiction detection."""
from sentence_transformers import CrossEncoder
from ..models.schemas import ScoreResult, QAReport
from ..config import VARIANCE_THRESHOLD, NLI_MODEL

# Global NLI model cache
_nli_model = None


def load_nli_model():
    """Load and cache the NLI cross-encoder model."""
    global _nli_model
    if _nli_model is None:
        _nli_model = CrossEncoder(NLI_MODEL)
    return _nli_model


def run_qa(score_results: list[ScoreResult]) -> QAReport:
    """
    Run QA checks on scoring results from multiple runs.
    
    Checks:
    1. Score variance detection
    2. Contradiction detection between first and last run justifications
    
    Args:
        score_results: List of ScoreResult from 3 runs
        
    Returns:
        QAReport with consistency flags
    """
    if len(score_results) < 2:
        raise ValueError("Need at least 2 score results for QA checking")
    
    scores = [result.score for result in score_results]
    min_score = min(scores)
    max_score = max(scores)
    mean_score = sum(scores) / len(scores)
    variance = max_score - min_score
    
    # Variance check
    is_consistent = variance <= VARIANCE_THRESHOLD
    
    # Contradiction detection
    contradiction_detected = False
    contradiction_detail = None
    
    if len(score_results) >= 2:
        try:
            nli_model = load_nli_model()
            
            # Compare first and last run justifications
            justification_1 = score_results[0].justification
            justification_2 = score_results[-1].justification
            
            # Use NLI model to check for contradictions
            sentence_pairs = [[justification_1, justification_2]]
            nli_scores = nli_model.predict(sentence_pairs)
            
            # Get prediction: 0=contradiction, 1=entailment, 2=neutral
            label_mapping = {0: "contradiction", 1: "entailment", 2: "neutral"}
            predicted_label_idx = nli_scores[0].argmax()
            predicted_label = label_mapping.get(predicted_label_idx, "unknown")
            score_value = float(nli_scores[0][predicted_label_idx])
            
            if predicted_label == "contradiction" and score_value > 0.7:
                contradiction_detected = True
                contradiction_detail = f"Contradiction detected between run 1 and run 3 justifications (confidence: {score_value:.2f})"
        
        except Exception as e:
            # Log but don't fail if NLI check fails
            contradiction_detail = f"NLI check failed: {str(e)}"
    
    # Determine flag level
    flag_level = "PASS"
    if is_consistent and contradiction_detected:
        flag_level = "FAIL"
    elif (not is_consistent) and contradiction_detected:
        flag_level = "FAIL"
    elif (not is_consistent) or contradiction_detected:
        flag_level = "WARN"
    
    return QAReport(
        is_consistent=is_consistent and not contradiction_detected,
        score_variance=variance,
        min_score=min_score,
        max_score=max_score,
        mean_score=round(mean_score, 2),
        contradiction_detected=contradiction_detected,
        contradiction_detail=contradiction_detail,
        flag_level=flag_level,
    )
