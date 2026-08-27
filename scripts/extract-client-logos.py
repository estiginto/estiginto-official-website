"""Extract and normalize the complete client-logo inventory from the Canva PDF."""

from __future__ import annotations

import argparse
import json
import subprocess
import tempfile
from collections import deque
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont
from pypdf import PdfReader


CANVAS_SIZE = (960, 480)
CONTENT_SIZE = (816, 336)
REFERENCE_SIZE = (3000, 1688)

# Prefer original embedded images for fidelity. Six Canva compositions combine
# raster art with vector text and therefore use a high-resolution page crop.
EMBEDDED_LOGOS = {
    "X79.png": ("marketech", "Marketech International Corp."),
    "X78.png": ("ezoom", "eZoom Information, Inc."),
    "X76.png": ("tradevan", "Trade-Van Information"),
    "X131.png": ("ey", "EY 安永"),
    "X132.png": ("lotus", "Lotus 美時化學製藥"),
    "X119.png": ("spg", "SPG 冠亞資產管理顧問"),
    "X99.png": ("kyl-auction", "高雄永樂拍賣 KYL Auction"),
    "X85.png": ("evco-creative-home", "EVCO Creative Home 美國生活用品百貨"),
    "X110.png": ("merica", "Merica"),
    "X70.png": ("after-school-nest", "放學窩"),
    "X35.png": ("commonwealth", "天下雜誌 CommonWealth Magazine"),
    "X72.png": ("bureau-foreign-trade", "經濟部國際貿易局"),
    "X74.png": ("trade-negotiations", "行政院經貿談判辦公室"),
    "X117.png": ("taiwan-stock-exchange", "臺灣證券交易所 Taiwan Stock Exchange"),
    "X111.png": ("taipei-architects", "臺北市建築師公會"),
    "X7.png": ("morinaga", "森永 Morinaga"),
    "X9.png": ("jung-kwan-jang", "正官庄 Jung Kwan Jang"),
    "X48.png": ("conflux", "Conflux 樂浪遊艇俱樂部"),
    "X34.png": ("fable", "fable"),
    "X32.png": ("tainan-airport", "臺南航空站 Tainan Airport"),
    "X40.png": ("archi-5", "ARCHI-5"),
    "X38.png": ("mca-creative-industries", "MCA Creative Industries 韓國文創"),
    "X31.png": ("taiwan-psychoanalytic", "臺灣精神分析學會"),
    "X59.png": ("beyond-amazing", "Beyond Amazing 國際高端旅遊"),
    "X96.png": ("sleekstrip", "SleekStrip"),
    "X15.png": ("jing-he-medical", "景賀醫美"),
    "X30.png": ("a-plus-dermatology", "A+ Beauty 極緻皮膚專科診所"),
    "X36.png": ("bauer-group", "BauerGroup SmartVending"),
    "X14.png": ("lecoln-keysight", "立肯科技 Lecoln Technology / Keysight Technologies"),
    "X16.png": ("mj-color", "MJ. Color"),
    "X41.png": ("bcfbw", "BCFBW"),
    "X97.png": ("vantage", "Vantage"),
    "X46.png": ("worthbee", "滿誠蜂蜜 Worthbee"),
}

COMPOSITE_LOGOS = [
    ("taiwan-mainstream-coop", "台灣主婦聯盟生活消費合作社", (155, 715, 525, 830)),
    ("eighteen-tea", "御用高級單本茶 十八味", (950, 715, 1285, 835)),
    ("kyce", "國裕建設 KYCE", (565, 990, 920, 1135)),
    ("wealthylife", "中華財富人生財商推廣協會 WealthyLife", (565, 1160, 950, 1285)),
    ("king-life", "King Life 徠福文具", (1340, 1160, 1770, 1285)),
    ("fvs", "FVS 黃金數位憑證", (1700, 1500, 1990, 1675)),
]

CLIENT_ORDER = [
    "marketech", "ezoom", "tradevan", "ey", "lotus", "spg",
    "taiwan-mainstream-coop", "kyl-auction", "eighteen-tea", "evco-creative-home", "merica", "after-school-nest",
    "commonwealth", "bureau-foreign-trade", "trade-negotiations", "taiwan-stock-exchange", "taipei-architects",
    "morinaga", "jung-kwan-jang", "kyce", "conflux", "fable", "tainan-airport", "archi-5", "mca-creative-industries",
    "taiwan-psychoanalytic", "wealthylife", "beyond-amazing", "sleekstrip", "king-life",
    "jing-he-medical", "a-plus-dermatology", "bauer-group", "lecoln-keysight", "mj-color",
    "bcfbw", "vantage", "worthbee", "fvs",
]


def render_page(pdf_path: Path, output_path: Path) -> Image.Image:
    subprocess.run(
        ["pdftoppm", "-png", "-r", "450", "-singlefile", str(pdf_path), str(output_path.with_suffix(""))],
        check=True,
    )
    return Image.open(output_path).convert("RGBA")


def remove_edge_white(image: Image.Image) -> Image.Image:
    rgba = image.convert("RGBA")
    pixels = rgba.load()
    width, height = rgba.size
    visited = bytearray(width * height)
    queue: deque[tuple[int, int]] = deque()

    def is_background(x: int, y: int) -> bool:
        red, green, blue, alpha = pixels[x, y]
        return alpha == 0 or (alpha > 0 and min(red, green, blue) >= 242)

    for x in range(width):
        queue.extend(((x, 0), (x, height - 1)))
    for y in range(height):
        queue.extend(((0, y), (width - 1, y)))

    while queue:
        x, y = queue.popleft()
        index = y * width + x
        if visited[index] or not is_background(x, y):
            continue
        visited[index] = 1
        red, green, blue, _ = pixels[x, y]
        pixels[x, y] = (red, green, blue, 0)
        if x:
            queue.append((x - 1, y))
        if x + 1 < width:
            queue.append((x + 1, y))
        if y:
            queue.append((x, y - 1))
        if y + 1 < height:
            queue.append((x, y + 1))
    return rgba


def normalize_logo(image: Image.Image) -> tuple[Image.Image, tuple[int, int]]:
    prepared = remove_edge_white(image)
    content_box = prepared.getchannel("A").getbbox()
    if content_box is None:
        raise ValueError("Logo contains no visible pixels")
    cropped = prepared.crop(content_box)
    ratio = min(CONTENT_SIZE[0] / cropped.width, CONTENT_SIZE[1] / cropped.height)
    rendered_size = (max(1, round(cropped.width * ratio)), max(1, round(cropped.height * ratio)))
    rendered = cropped.resize(rendered_size, Image.Resampling.LANCZOS)
    rendered = rendered.filter(ImageFilter.UnsharpMask(radius=1.2, percent=110, threshold=2))
    canvas = Image.new("RGBA", CANVAS_SIZE, (255, 255, 255, 0))
    canvas.alpha_composite(rendered, ((CANVAS_SIZE[0] - rendered.width) // 2, (CANVAS_SIZE[1] - rendered.height) // 2))
    return canvas, rendered_size


def create_contact_sheet(records: list[dict], output_dir: Path) -> None:
    columns, cell_width, cell_height = 4, 360, 220
    rows = (len(records) + columns - 1) // columns
    sheet = Image.new("RGB", (columns * cell_width, rows * cell_height), "#eeeae1")
    draw = ImageDraw.Draw(sheet)
    font = ImageFont.load_default(size=16)
    for index, record in enumerate(records):
        x, y = (index % columns) * cell_width, (index // columns) * cell_height
        logo = Image.open(output_dir / record["file"]).convert("RGBA").resize((320, 160), Image.Resampling.LANCZOS)
        preview = Image.new("RGB", CANVAS_SIZE, "#ffffff")
        preview.paste(logo, mask=logo.getchannel("A"))
        sheet.paste(preview, (x + 20, y + 16))
        draw.rectangle((x + 20, y + 16, x + 340, y + 176), outline="#c7c1b7")
        draw.text((x + 20, y + 184), f'{index + 1:02d}  {record["id"]}', fill="#211d18", font=font)
    sheet.save(output_dir / "contact-sheet.jpg", quality=92, optimize=True)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("input", type=Path)
    parser.add_argument("output", type=Path)
    args = parser.parse_args()
    args.output.mkdir(parents=True, exist_ok=True)
    extracted: dict[str, tuple[str, Image.Image]] = {}

    for embedded in PdfReader(str(args.input)).pages[0].images:
        definition = EMBEDDED_LOGOS.get(embedded.name)
        if definition:
            slug, alt = definition
            extracted[slug] = (alt, embedded.image)

    with tempfile.TemporaryDirectory(prefix="estiginto-client-logos-") as temp_dir:
        page = render_page(args.input, Path(temp_dir) / "page.png")
        scale_x, scale_y = page.width / REFERENCE_SIZE[0], page.height / REFERENCE_SIZE[1]
        for slug, alt, bounds in COMPOSITE_LOGOS:
            scaled = (
                round(bounds[0] * scale_x), round(bounds[1] * scale_y),
                round(bounds[2] * scale_x), round(bounds[3] * scale_y),
            )
            extracted[slug] = (alt, page.crop(scaled))

    if set(extracted) != set(CLIENT_ORDER):
        raise ValueError(f"Logo inventory mismatch: {sorted(set(CLIENT_ORDER) - set(extracted))}")

    records = []
    for slug in CLIENT_ORDER:
        alt, image = extracted[slug]
        normalized, content_size = normalize_logo(image)
        filename = f"{slug}.webp"
        normalized.save(args.output / filename, "WEBP", lossless=True, method=6)
        records.append({"id": slug, "alt": alt, "file": filename, "canvas": list(CANVAS_SIZE), "content": list(content_size)})

    (args.output / "manifest.json").write_text(json.dumps(records, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    create_contact_sheet(records, args.output)
    print(f"Extracted {len(records)} complete logos to {args.output}")


if __name__ == "__main__":
    main()
