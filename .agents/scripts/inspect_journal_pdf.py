from pathlib import Path
import fitz

source = Path("attached_assets/Jurnal_preportif_1790604351708.pdf")
output_dir = Path(".agents/outputs/jurnal-preportif")
output_dir.mkdir(parents=True, exist_ok=True)

document = fitz.open(source)
print(f"pages={document.page_count}")
print(f"metadata={document.metadata}")

all_text = []
for page_number, page in enumerate(document):
    text = page.get_text("text")
    all_text.append(f"\n--- PAGE {page_number + 1} ---\n{text}")
    if page_number < 8:
        pixmap = page.get_pixmap(matrix=fitz.Matrix(1.5, 1.5), alpha=False)
        image_path = output_dir / f"page-{page_number + 1:03d}.png"
        pixmap.save(image_path)
        print(f"rendered={image_path}")

text_path = output_dir / "extracted-text.txt"
text_path.write_text("".join(all_text), encoding="utf-8")
print(f"text={text_path}")