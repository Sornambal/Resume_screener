"""LLM scoring using Groq API."""
import json
import re
from groq import Groq
from ..config import GROQ_API_KEY, LLM_MODEL, LLM_TEMPERATURE, LLM_MAX_TOKENS
from ..models.schemas import ScoreResult

# Initialize Groq client
client = Groq(api_key=GROQ_API_KEY)


def score_candidate(jd_text: str, resume_text: str, run_index: int) -> ScoreResult:
    """
    Score a candidate resume against job description using Groq LLM.
    
    Args:
        jd_text: Job description text
        resume_text: Resume text
        run_index: Which run this is (0, 1, or 2)
        
    Returns:
        ScoreResult with score, justification, strengths, gaps
        
    Raises:
        ValueError: If response parsing fails after retry
    """
    prompt = f"""System: You are a technical recruiter assistant. Evaluate the candidate resume against the job description. 
Return ONLY valid JSON with this exact schema:
{{
  "score": <integer 0-100>,
  "justification": "<2-3 sentence explanation>",
  "strengths": ["<strength 1>", "<strength 2>", "<strength 3>"],
  "gaps": ["<gap 1>", "<gap 2>"]
}}
Do not include any text outside the JSON object.

User: 
JD:
{jd_text}

RESUME:
{resume_text}"""

    # Try to get response and parse JSON
    for attempt in range(2):
        try:
            response = client.chat.completions.create(
                model=LLM_MODEL,
                messages=[{"role": "user", "content": prompt}],
                temperature=LLM_TEMPERATURE,
                max_tokens=LLM_MAX_TOKENS,
            )
            
            # Groq chat completion returns a response object with choices[0].message.content
            response_text = ""
            if hasattr(response, "choices") and response.choices:
                choice = response.choices[0]
                if hasattr(choice, "message") and hasattr(choice.message, "content"):
                    response_text = str(choice.message.content).strip()
                elif hasattr(choice, "content"):
                    response_text = str(choice.content).strip()
            if not response_text and hasattr(response, "content"):
                response_text = str(response.content).strip()
            
            # Try to extract JSON if there's extra text
            json_match = re.search(r"\{.*\}", response_text, re.DOTALL)
            if json_match:
                response_text = json_match.group()
            
            result = json.loads(response_text)
            
            # Validate required fields
            required_fields = ["score", "justification", "strengths", "gaps"]
            if not all(field in result for field in required_fields):
                raise ValueError(f"Missing required fields in JSON response")
            
            # Ensure score is int and in range [0, 100]
            score = int(result["score"])
            if not (0 <= score <= 100):
                score = max(0, min(100, score))
            
            return ScoreResult(
                run_index=run_index,
                score=score,
                justification=str(result["justification"]),
                strengths=list(result["strengths"])[:3],  # Limit to 3
                gaps=list(result["gaps"])[:2],  # Limit to 2
            )
        
        except json.JSONDecodeError as e:
            if attempt == 0:
                continue  # Retry once
            raise ValueError(f"Failed to parse LLM response as JSON: {str(e)}")
        except Exception as e:
            if attempt == 0:
                continue
            raise ValueError(f"Error scoring candidate: {str(e)}")
    
    raise ValueError("Failed to score candidate after 2 attempts")
