"""Generate README.pdf from README.md using ReportLab.

This script is intentionally lightweight and has minimal dependencies. It parses a subset of Markdown
syntax (headings, paragraphs, bullet lists, and code blocks) and renders it to a PDF.

Usage:
    python scripts/generate_readme_pdf.py

Output:
    README.pdf (in the repo root)
"""

from __future__ import annotations

import html
import os
from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.platypus import (  # type: ignore
    ListFlowable,
    ListItem,
    Paragraph,
    Preformatted,
    SimpleDocTemplate,
    Spacer,
)


def build_story(markdown_text: str) -> list:
    """Convert a small subset of markdown into reportlab flowables."""
    styles = getSampleStyleSheet()
    heading_styles = {
        1: ParagraphStyle("Heading1", parent=styles["Heading1"], fontSize=24, leading=28),
        2: ParagraphStyle("Heading2", parent=styles["Heading2"], fontSize=18, leading=22),
        3: ParagraphStyle("Heading3", parent=styles["Heading3"], fontSize=14, leading=18),
    }
    body_style = ParagraphStyle("Body", parent=styles["BodyText"], leading=16)
    code_style = ParagraphStyle(
        "Code",
        parent=styles["Code"],
        fontName="Courier",
        fontSize=9,
        leading=12,
        textColor=colors.black,
        backColor=colors.whitesmoke,
    )

    lines = markdown_text.splitlines()
    story: list = []

    in_code = False
    code_lines: list[str] = []
    list_items: list[ListItem] | None = None

    def flush_list():
        nonlocal list_items
        if list_items:
            story.append(ListFlowable(list_items, bulletType="bullet", start="disc"))
            story.append(Spacer(1, 6))
            list_items = None

    def flush_code():
        nonlocal in_code, code_lines
        if in_code:
            story.append(Preformatted("\n".join(code_lines), code_style))
            story.append(Spacer(1, 8))
            in_code = False
            code_lines = []

    for line in lines:
        if line.strip().startswith("```"):
            if in_code:
                flush_code()
            else:
                in_code = True
                code_lines = []
            continue

        if in_code:
            code_lines.append(line)
            continue

        if not line.strip():
            flush_list()
            story.append(Spacer(1, 10))
            continue

        # Headings
        if line.startswith("### "):
            flush_list()
            story.append(Paragraph(line[4:], heading_styles[3]))
            story.append(Spacer(1, 8))
            continue
        if line.startswith("## "):
            flush_list()
            story.append(Paragraph(line[3:], heading_styles[2]))
            story.append(Spacer(1, 8))
            continue
        if line.startswith("# "):
            flush_list()
            story.append(Paragraph(line[2:], heading_styles[1]))
            story.append(Spacer(1, 10))
            continue

        # Bullet lists
        if line.strip().startswith("- ") or line.strip().startswith("* "):
            if list_items is None:
                list_items = []
            text = line.strip()[2:]
            list_items.append(ListItem(Paragraph(text, body_style), leftIndent=12))
            continue

        # Escape special characters that could be interpreted as HTML tags
        safe_line = html.escape(line)
        story.append(Paragraph(safe_line, body_style))
        story.append(Spacer(1, 4))

    flush_code()
    flush_list()

    return story


def main() -> None:
    repo_root = Path(__file__).resolve().parents[1]
    readme_path = repo_root / "README.md"
    output_pdf = repo_root / "README.pdf"

    if not readme_path.exists():
        raise FileNotFoundError(f"Could not find {readme_path}")

    markdown_text = readme_path.read_text(encoding="utf-8")
    story = build_story(markdown_text)

    doc = SimpleDocTemplate(
        str(output_pdf),
        pagesize=letter,
        leftMargin=40,
        rightMargin=40,
        topMargin=40,
        bottomMargin=40,
    )
    doc.build(story)

    print(f"Generated PDF: {output_pdf}")


if __name__ == "__main__":
    main()
