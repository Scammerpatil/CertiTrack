# Function to convert docx to pdf
from docx2pdf import convert
import locale
import sys
import os

sys.stdout.reconfigure(encoding='utf-8')
os.environ["PYTHONIOENCODING"] = "utf-8"
locale.setlocale(category=locale.LC_ALL, locale="en_GB.UTF-8")

def convert_docx_to_pdf(docx_path, pdf_path):
    convert(docx_path, pdf_path)


if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python docxtopdf.py <input.docx> <output.pdf>")
        sys.exit(1)

    input_docx = sys.argv[1]
    output_pdf = sys.argv[2]

    convert_docx_to_pdf(input_docx, output_pdf)
    print(f"Converted {input_docx} to {output_pdf}")