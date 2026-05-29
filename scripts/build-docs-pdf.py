from __future__ import annotations

import html
import re
from dataclasses import dataclass
from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.platypus import (
    HRFlowable,
    ListFlowable,
    ListItem,
    PageBreak,
    Paragraph,
    Preformatted,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)


ROOT = Path(__file__).resolve().parents[1]
DOCS = ROOT / "docs"
RUBRIC = DOCS / "rubrica-evaluacion"


@dataclass(frozen=True)
class PdfJob:
    sources: list[Path]
    output: Path
    title: str
    subtitle: str = "Copiloto Comercial - Protecciones Toledo"


RUBRIC_ORDER = [
    RUBRIC / "README.md",
    RUBRIC / "01-resumen-ejecutivo-objetivo.md",
    RUBRIC / "02-contexto-empresa-proceso-problema.md",
    RUBRIC / "03-alcance-entregables-kpis.md",
    RUBRIC / "04-diseno-solucion-ia.md",
    RUBRIC / "05-riesgos-etica-privacidad-implantacion.md",
    RUBRIC / "06-guion-presentacion-oral.md",
    RUBRIC / "07-valor-negocio-impacto.md",
    RUBRIC / "08-explicacion-solucion-end-to-end.md",
    RUBRIC / "09-soportes-demo-evidencias-tiempo.md",
    RUBRIC / "10-preguntas-defensa.md",
    RUBRIC / "11-checklist-10-sobre-10.md",
]


def main() -> None:
    jobs = [
        PdfJob(
            [DOCS / "memoria-proyecto-empresa-tutor.md"],
            DOCS / "memoria-proyecto-empresa-tutor.pdf",
            "Memoria del proyecto para empresa y tutor",
        ),
        PdfJob(
            [DOCS / "seguridad-privacidad.md"],
            DOCS / "seguridad-privacidad.pdf",
            "Seguridad y privacidad del proyecto",
        ),
        PdfJob(
            RUBRIC_ORDER,
            RUBRIC / "documentacion-rubrica-completa.pdf",
            "Documentacion completa segun rubrica",
            "Programa Superior en Inteligencia Artificial Aplicada a la Empresa",
        ),
        PdfJob(
            [DOCS / "memoria-proyecto-empresa-tutor.md", DOCS / "seguridad-privacidad.md", *RUBRIC_ORDER],
            DOCS / "documentacion-completa-proyecto.pdf",
            "Dossier completo del proyecto",
            "Protecciones Toledo - Practicas FEDETO",
        ),
    ]

    for markdown_file in RUBRIC_ORDER:
        jobs.append(
            PdfJob(
                [markdown_file],
                markdown_file.with_suffix(".pdf"),
                readable_title(markdown_file),
                "Documentacion de evaluacion segun rubrica",
            )
        )

    styles = make_styles()
    for job in jobs:
        build_pdf(job, styles)
        print(f"PDF generado: {job.output.relative_to(ROOT)}")


def build_pdf(job: PdfJob, styles: dict[str, ParagraphStyle]) -> None:
    job.output.parent.mkdir(parents=True, exist_ok=True)
    doc = SimpleDocTemplate(
        str(job.output),
        pagesize=A4,
        rightMargin=16 * mm,
        leftMargin=16 * mm,
        topMargin=16 * mm,
        bottomMargin=18 * mm,
        title=job.title,
        author="Proyecto FEDETO - Protecciones Toledo",
    )
    story = cover_page(job, styles)

    for index, source in enumerate(job.sources):
        story.append(PageBreak())
        story.extend(source_header(source, styles))
        story.extend(markdown_to_flowables(source.read_text(encoding="utf-8"), styles, doc.width))
        if index < len(job.sources) - 1:
            story.append(PageBreak())

    doc.build(story, onFirstPage=draw_footer, onLaterPages=draw_footer)


def cover_page(job: PdfJob, styles: dict[str, ParagraphStyle]):
    return [
        Spacer(1, 40 * mm),
        Paragraph("DOCUMENTACION TECNICA", styles["eyebrow"]),
        Spacer(1, 9 * mm),
        Paragraph(escape_inline(job.title), styles["cover_title"]),
        Spacer(1, 7 * mm),
        Paragraph(escape_inline(job.subtitle), styles["cover_subtitle"]),
        Spacer(1, 18 * mm),
        HRFlowable(width="42%", thickness=3, color=colors.HexColor("#b42318"), hAlign="LEFT"),
        Spacer(1, 10 * mm),
        Paragraph("Proyecto de practicas FEDETO · Protecciones Toledo S.L.", styles["cover_meta"]),
    ]


def source_header(source: Path, styles: dict[str, ParagraphStyle]):
    return [
        Paragraph(source.relative_to(ROOT).as_posix(), styles["source"]),
        HRFlowable(width="100%", thickness=0.6, color=colors.HexColor("#d7dee5")),
        Spacer(1, 6 * mm),
    ]


def markdown_to_flowables(text: str, styles: dict[str, ParagraphStyle], available_width: float):
    flowables = []
    lines = text.splitlines()
    i = 0
    paragraph_buffer: list[str] = []

    def flush_paragraph():
        if paragraph_buffer:
            paragraph = " ".join(line.strip() for line in paragraph_buffer).strip()
            if paragraph:
                flowables.append(Paragraph(inline_markup(paragraph), styles["body"]))
                flowables.append(Spacer(1, 2.4 * mm))
            paragraph_buffer.clear()

    while i < len(lines):
        line = lines[i].rstrip()

        if not line.strip():
            flush_paragraph()
            i += 1
            continue

        if line.startswith("```"):
            flush_paragraph()
            code_lines = []
            i += 1
            while i < len(lines) and not lines[i].startswith("```"):
                code_lines.append(lines[i])
                i += 1
            i += 1
            flowables.append(Preformatted("\n".join(code_lines), styles["code"]))
            flowables.append(Spacer(1, 4 * mm))
            continue

        if line.startswith("|") and "|" in line[1:]:
            flush_paragraph()
            table_lines = []
            while i < len(lines) and lines[i].strip().startswith("|"):
                table_lines.append(lines[i].strip())
                i += 1
            flowables.append(build_table(table_lines, styles, available_width))
            flowables.append(Spacer(1, 4 * mm))
            continue

        heading_match = re.match(r"^(#{1,3})\s+(.+)$", line)
        if heading_match:
            flush_paragraph()
            level = len(heading_match.group(1))
            content = inline_markup(heading_match.group(2))
            style_name = {1: "h1", 2: "h2", 3: "h3"}[level]
            flowables.append(Paragraph(content, styles[style_name]))
            flowables.append(Spacer(1, 2.3 * mm))
            i += 1
            continue

        if line.startswith(">"):
            flush_paragraph()
            quote_lines = []
            while i < len(lines) and lines[i].startswith(">"):
                quote_lines.append(lines[i].lstrip(">").strip())
                i += 1
            quote = " ".join(quote_lines)
            flowables.append(Paragraph(inline_markup(quote), styles["quote"]))
            flowables.append(Spacer(1, 3 * mm))
            continue

        unordered = collect_list(lines, i, unordered=True)
        if unordered:
            flush_paragraph()
            items, i = unordered
            flowables.append(build_list(items, styles, ordered=False))
            flowables.append(Spacer(1, 3 * mm))
            continue

        ordered = collect_list(lines, i, unordered=False)
        if ordered:
            flush_paragraph()
            items, i = ordered
            flowables.append(build_list(items, styles, ordered=True))
            flowables.append(Spacer(1, 3 * mm))
            continue

        paragraph_buffer.append(line)
        i += 1

    flush_paragraph()
    return flowables


def collect_list(lines: list[str], start: int, unordered: bool):
    pattern = r"^\s*-\s+(.+)$" if unordered else r"^\s*\d+\.\s+(.+)$"
    if not re.match(pattern, lines[start]):
        return None

    items = []
    i = start
    while i < len(lines):
        match = re.match(pattern, lines[i])
        if not match:
            break
        items.append(match.group(1).strip())
        i += 1
    return items, i


def build_list(items: list[str], styles: dict[str, ParagraphStyle], ordered: bool):
    list_items = [
        ListItem(Paragraph(inline_markup(item), styles["list_item"]), leftIndent=3 * mm)
        for item in items
    ]
    return ListFlowable(
        list_items,
        bulletType="1" if ordered else "bullet",
        start="1",
        leftIndent=6 * mm,
        bulletFontName="Helvetica",
        bulletFontSize=8.8,
    )


def build_table(lines: list[str], styles: dict[str, ParagraphStyle], available_width: float):
    rows = []
    for line in lines:
        cells = [cell.strip() for cell in line.strip("|").split("|")]
        if all(re.fullmatch(r":?-{3,}:?", cell) for cell in cells):
            continue
        rows.append([Paragraph(inline_markup(cell), styles["table_cell"]) for cell in cells])

    if not rows:
        return Spacer(1, 0)

    column_count = max(len(row) for row in rows)
    for row in rows:
        while len(row) < column_count:
            row.append(Paragraph("", styles["table_cell"]))

    widths = [available_width / column_count] * column_count
    table = Table(rows, colWidths=widths, repeatRows=1, splitByRow=True)
    table.setStyle(
        TableStyle(
            [
                ("GRID", (0, 0), (-1, -1), 0.4, colors.HexColor("#d7dee5")),
                ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#edf2f5")),
                ("TEXTCOLOR", (0, 0), (-1, 0), colors.HexColor("#111827")),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("LEFTPADDING", (0, 0), (-1, -1), 5),
                ("RIGHTPADDING", (0, 0), (-1, -1), 5),
                ("TOPPADDING", (0, 0), (-1, -1), 4),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
            ]
        )
    )
    return table


def inline_markup(text: str) -> str:
    text = escape_inline(text)
    text = re.sub(r"\*\*(.+?)\*\*", r"<b>\1</b>", text)
    text = re.sub(r"`([^`]+)`", r"<font name='Courier'>\1</font>", text)
    text = re.sub(r"\[([^\]]+)\]\(([^)]+)\)", r"\1 (\2)", text)
    return text


def escape_inline(text: str) -> str:
    return html.escape(text, quote=False).replace("\n", "<br/>")


def readable_title(path: Path) -> str:
    stem = re.sub(r"^\d+-", "", path.stem)
    stem = stem.replace("-", " ")
    return stem.capitalize()


def draw_footer(canvas, doc):
    canvas.saveState()
    canvas.setFont("Helvetica", 8)
    canvas.setFillColor(colors.HexColor("#6b7280"))
    canvas.drawString(16 * mm, 10 * mm, "Copiloto Comercial - Protecciones Toledo")
    canvas.drawRightString(A4[0] - 16 * mm, 10 * mm, f"Pagina {doc.page}")
    canvas.restoreState()


def make_styles() -> dict[str, ParagraphStyle]:
    base = getSampleStyleSheet()
    return {
        "eyebrow": ParagraphStyle(
            "eyebrow",
            parent=base["Normal"],
            fontName="Helvetica-Bold",
            fontSize=8.2,
            textColor=colors.HexColor("#b42318"),
            alignment=TA_LEFT,
            leading=10,
        ),
        "cover_title": ParagraphStyle(
            "cover_title",
            parent=base["Title"],
            fontName="Helvetica-Bold",
            fontSize=29,
            leading=32,
            textColor=colors.HexColor("#111827"),
            alignment=TA_LEFT,
        ),
        "cover_subtitle": ParagraphStyle(
            "cover_subtitle",
            parent=base["Normal"],
            fontName="Helvetica-Bold",
            fontSize=13,
            leading=18,
            textColor=colors.HexColor("#334155"),
            alignment=TA_LEFT,
        ),
        "cover_meta": ParagraphStyle(
            "cover_meta",
            parent=base["Normal"],
            fontSize=10,
            leading=14,
            textColor=colors.HexColor("#657281"),
        ),
        "source": ParagraphStyle(
            "source",
            parent=base["Normal"],
            fontName="Helvetica-Bold",
            fontSize=8,
            leading=10,
            textColor=colors.HexColor("#b42318"),
        ),
        "h1": ParagraphStyle(
            "h1",
            parent=base["Heading1"],
            fontName="Helvetica-Bold",
            fontSize=22,
            leading=25,
            textColor=colors.HexColor("#111827"),
            spaceBefore=0,
            spaceAfter=4,
        ),
        "h2": ParagraphStyle(
            "h2",
            parent=base["Heading2"],
            fontName="Helvetica-Bold",
            fontSize=15,
            leading=18,
            textColor=colors.HexColor("#1d4f7a"),
            spaceBefore=10,
            spaceAfter=3,
        ),
        "h3": ParagraphStyle(
            "h3",
            parent=base["Heading3"],
            fontName="Helvetica-Bold",
            fontSize=12,
            leading=15,
            textColor=colors.HexColor("#334155"),
            spaceBefore=8,
            spaceAfter=2,
        ),
        "body": ParagraphStyle(
            "body",
            parent=base["BodyText"],
            fontName="Helvetica",
            fontSize=10,
            leading=14,
            textColor=colors.HexColor("#17202a"),
        ),
        "list_item": ParagraphStyle(
            "list_item",
            parent=base["BodyText"],
            fontName="Helvetica",
            fontSize=9.6,
            leading=13,
            textColor=colors.HexColor("#17202a"),
        ),
        "table_cell": ParagraphStyle(
            "table_cell",
            parent=base["BodyText"],
            fontName="Helvetica",
            fontSize=7.8,
            leading=9.4,
            textColor=colors.HexColor("#17202a"),
        ),
        "quote": ParagraphStyle(
            "quote",
            parent=base["BodyText"],
            fontName="Helvetica-Oblique",
            fontSize=9.5,
            leading=13,
            leftIndent=6 * mm,
            rightIndent=4 * mm,
            borderColor=colors.HexColor("#b42318"),
            borderWidth=0,
            borderPadding=6,
            textColor=colors.HexColor("#334155"),
        ),
        "code": ParagraphStyle(
            "code",
            parent=base["Code"],
            fontName="Courier",
            fontSize=8,
            leading=10,
            leftIndent=2 * mm,
            textColor=colors.HexColor("#111827"),
            backColor=colors.HexColor("#eef2f4"),
        ),
    }


if __name__ == "__main__":
    main()
