// Reorganized File Parsing Module for AI Resume Analyzer Frontend
// Handles client-side PDF and DOCX extraction using PDF.js and Mammoth.js

export async function parseFile(file) {
  const fileType = file.type;
  const fileName = file.name.toLowerCase();

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    if (fileType === "application/pdf" || fileName.endsWith(".pdf")) {
      reader.onload = async (e) => {
        try {
          const arrayBuffer = e.target.result;
          const text = await parsePDF(arrayBuffer);
          if (!text.trim()) {
            reject(new Error("No readable text found in the PDF. It might be scanned. Please copy-paste the text instead."));
          } else {
            resolve(text);
          }
        } catch (err) {
          console.error("PDF Parsing Error:", err);
          reject(new Error("Failed to parse PDF file. Ensure it is not corrupted."));
        }
      };
      reader.onerror = () => reject(new Error("Error reading file buffer."));
      reader.readAsArrayBuffer(file);

    } else if (
      fileType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" || 
      fileName.endsWith(".docx")
    ) {
      reader.onload = async (e) => {
        try {
          const arrayBuffer = e.target.result;
          const text = await parseDOCX(arrayBuffer);
          if (!text.trim()) {
            reject(new Error("No readable text found in the DOCX file."));
          } else {
            resolve(text);
          }
        } catch (err) {
          console.error("DOCX Parsing Error:", err);
          reject(new Error("Failed to parse DOCX file."));
        }
      };
      reader.onerror = () => reject(new Error("Error reading file buffer."));
      reader.readAsArrayBuffer(file);

    } else if (fileType === "text/plain" || fileName.endsWith(".txt")) {
      reader.onload = (e) => {
        const text = e.target.result;
        resolve(text);
      };
      reader.onerror = () => reject(new Error("Error reading text file."));
      reader.readAsText(file);

    } else {
      reject(new Error("Unsupported file format. Please upload a PDF, DOCX, or TXT file."));
    }
  });
}

async function parsePDF(arrayBuffer) {
  const pdfjsLib = window["pdfjs-dist/build/pdf"];
  if (!pdfjsLib) {
    throw new Error("PDF.js library is not loaded. Check internet connection.");
  }
  
  pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

  const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) });
  const pdf = await loadingTask.promise;
  let text = "";

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const pageText = textContent.items.map(item => item.str).join(" ");
    text += pageText + "\n\n";
  }

  return text;
}

async function parseDOCX(arrayBuffer) {
  const mammoth = window.mammoth;
  if (!mammoth) {
    throw new Error("Mammoth.js library is not loaded. Check internet connection.");
  }

  const result = await mammoth.extractRawText({ arrayBuffer: arrayBuffer });
  return result.value;
}
