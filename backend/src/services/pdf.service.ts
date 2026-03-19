import pdfParse from "pdf-parse"
import fs from "fs"

export async function extractTextFromPDF(filePath: string): Promise<{ text: string; numPages: number }> {
  const buffer = fs.readFileSync(filePath)
  const data = await pdfParse(buffer)

  if (!data.text || data.text.trim().length < 50) {
    throw new Error("Could not extract text from PDF. File may be scanned or image-based.")
  }

  return {
    text: data.text.trim(),
    numPages: data.numpages
  }
}

export function deleteFile(filePath: string): void {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath)
    }
  } catch (err) {
    console.warn("Could not delete file:", filePath)
  }
}
