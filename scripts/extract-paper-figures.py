"""Regenerate the committed SVG figures from versioned paper PDFs.

Install PyMuPDF 1.28.2 in a separate Python environment, then run:
  python scripts/extract-paper-figures.py /path/to/pdfs
PDFs must be named after the versioned arXiv IDs in paper-figures.json.
Normal website builds do not need Python or the source PDFs.
"""
from pathlib import Path
import hashlib
import json
import sys
import pymupdf

root = Path(__file__).resolve().parents[1]
sources = Path(sys.argv[1])
for figure in json.loads((root / 'scripts/paper-figures.json').read_text()):
    source = sources / (figure['arxiv'] + '.pdf')
    if hashlib.sha256(source.read_bytes()).hexdigest() != figure['sha256']:
        raise ValueError(f'Unexpected PDF version: {source}')
    with pymupdf.open(source) as document, pymupdf.open() as cropped:
        rect = pymupdf.Rect(figure['crop'])
        original = document[figure['page'] - 1]
        w, h = original.rect.width, original.rect.height
        for margin in [(0, 0, w, rect.y0), (0, rect.y1, w, h),
                       (0, rect.y0, rect.x0, rect.y1),
                       (rect.x1, rect.y0, w, rect.y1)]:
            original.add_redact_annot(margin, fill=False)
        original.apply_redactions(images=1, graphics=2, text=0)
        page = cropped.new_page(width=rect.width, height=rect.height)
        page.show_pdf_page(page.rect, document, figure['page'] - 1, clip=rect)
        svg = page.get_svg_image(text_as_path=True)
        if '<image' in svg:
            raise ValueError(f"Raster content in {figure['name']}")
        (root / 'public/figures' / (figure['name'] + '.svg')).write_text(svg)
