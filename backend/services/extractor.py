"""Text extraction from various file formats."""
import fitz  # PyMuPDF
import markdown
from bs4 import BeautifulSoup
from pathlib import Path


def extract_text(filepath: str) -> str:
    """
    Extract text from PDF, Markdown, or plain text files.
    
    Args:
        filepath: Path to the file
        
    Returns:
        Extracted text as string
        
    Raises:
        ValueError: If file type is not supported
    """
    filepath = Path(filepath)
    file_ext = filepath.suffix.lower()
    
    if file_ext == ".pdf":
        return _extract_pdf(filepath)
    elif file_ext == ".md":
        return _extract_markdown(filepath)
    elif file_ext == ".txt":
        return _extract_text(filepath)
    else:
        raise ValueError(f"Unsupported file type: {file_ext}. Allowed: .pdf, .md, .txt")


def _extract_pdf(filepath: Path) -> str:
    """Extract text from PDF using PyMuPDF."""
    text_parts = []
    try:
        doc = fitz.open(filepath)
        for page in doc:
            text_parts.append(page.get_text())
        doc.close()
    except Exception as e:
        raise ValueError(f"Failed to extract PDF: {str(e)}")
    
    text = "\n".join(text_parts)
    return _clean_text(text)


def _extract_markdown(filepath: Path) -> str:
    """Extract text from Markdown file."""
    with open(filepath, "r", encoding="utf-8") as f:
        md_text = f.read()
    
    html = markdown.markdown(md_text)
    soup = BeautifulSoup(html, "html.parser")
    text = soup.get_text()
    return _clean_text(text)


def _extract_text(filepath: Path) -> str:
    """Extract text from plain text file."""
    with open(filepath, "r", encoding="utf-8") as f:
        text = f.read()
    return _clean_text(text)


def _clean_text(text: str) -> str:
    """Clean and normalize text."""
    # Remove excessive whitespace
    lines = [line.strip() for line in text.split("\n") if line.strip()]
    text = "\n".join(lines)
    
    # Remove multiple consecutive newlines
    while "\n\n\n" in text:
        text = text.replace("\n\n\n", "\n\n")
    
    return text.strip()
