// Express API Server for AI Resume Analyzer
// Integrates securely with Google Gemini REST endpoints and encapsulates system prompt logic

import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// Load local environment variables (.env file)
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS and JSON parsing middlewares
app.use(cors({ origin: "*" })); // Allow all origins for local scratch execution
app.use(express.json({ limit: "10mb" })); // Support large copy-pasted resumes/JDs

const BASE_URL = "https://generativelanguage.googleapis.com/v1beta/models";

// Helper to determine the API key to use
function resolveApiKey(req) {
  const headerKey = req.headers["x-gemini-api-key"];
  if (headerKey && headerKey.trim().length > 10) {
    return headerKey.trim();
  }
  return process.env.GEMINI_API_KEY || "";
}

// Helper to query Gemini via Native HTTP Fetch
async function fetchGemini(apiKey, model, systemInstruction, prompt) {
  const url = `${BASE_URL}/${model}:generateContent?key=${apiKey}`;
  
  const requestBody = {
    contents: [
      {
        parts: [{ text: prompt }]
      }
    ],
    generationConfig: {
      responseMimeType: "application/json",
      temperature: 0.15 // Strict analytical precision
    }
  };

  if (systemInstruction) {
    requestBody.systemInstruction = {
      parts: [{ text: systemInstruction }]
    };
  }

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(requestBody)
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const message = errorData.error?.message || `Gemini status error: ${response.status}`;
    throw new Error(message);
  }

  const data = await response.json();
  const textResponse = data.candidates[0].content.parts[0].text;
  
  // Parse and return raw JSON object from LLM output
  return JSON.parse(textResponse);
}

// --- Endpoints ---

// 1. Check server API Key and configurations
app.get("/api/status", (req, res) => {
  const hasServerKey = !!process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim().length > 10;
  res.json({
    hasKey: hasServerKey,
    model: "gemini-1.5-flash",
    port: PORT
  });
});

// 2. Validate API Key health
app.post("/api/test-connection", async (req, res) => {
  const apiKey = resolveApiKey(req);
  if (!apiKey) {
    return res.status(400).json({ error: "No API Key provided. Set GEMINI_API_KEY in .env or Settings." });
  }

  const model = req.body.model || "gemini-1.5-flash";
  const url = `${BASE_URL}/${model}:generateContent?key=${apiKey}`;
  
  const requestBody = {
    contents: [{ parts: [{ text: "Respond with JSON containing only: {'success': true}" }] }],
    generationConfig: { responseMimeType: "application/json" }
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody)
    });
    
    if (response.ok) {
      res.json({ success: true });
    } else {
      const err = await response.json().catch(() => ({}));
      res.status(400).json({ success: false, error: err.error?.message || "Invalid Key" });
    }
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// 3. Evaluate Resume ATS compatibility
app.post("/api/analyze", async (req, res) => {
  const apiKey = resolveApiKey(req);
  if (!apiKey) {
    return res.status(401).json({ error: "API Credentials missing. Add your Gemini API Key." });
  }

  const { resume, jobDescription, model = "gemini-1.5-flash" } = req.body;
  if (!resume || !jobDescription) {
    return res.status(400).json({ error: "Missing resume or job description content." });
  }

  const systemInstruction = `You are an expert ATS (Applicant Tracking System) scoring algorithm and professional recruiter. Your task is to perform an objective, strict, and extremely detailed compatibility audit of the candidate's resume against the target job description. 

You must evaluate and output the results as a single valid JSON object following this EXACT schema:
{
  "atsScore": number (overall score 0-100 based on fit),
  "breakdown": {
    "keywords": number (0-100 matches in hard/soft skills),
    "skills": number (0-100 technical alignment),
    "experience": number (0-100 seniority & depth matching),
    "formatting": number (0-100 estimated layout readability)
  },
  "summary": "a detailed 3-4 sentence professional summary of why the resume matches or falls short, focusing on high-level fit",
  "keywords": {
    "found": ["string array of major technical and soft skill keywords from the job description that are present in the resume"],
    "missing": ["string array of key technical, tool, or methodology keywords from the job description that are missing from the resume"]
  },
  "feedback": {
    "strengths": ["string array of 3-4 distinct strengths of the candidate relative to this job description"],
    "weaknesses": ["string array of 3-4 key skill gaps, missing qualifications, or lack of depth in specific areas"],
    "recommendations": ["string array of 4-5 actionable, highly specific recommendations. Each recommendation must be concrete, e.g., 'Rewrite bullet X to emphasize Y' or 'Add a section detail on tool Z'."]
  }
}`;

  const prompt = `Analyze this resume against the target job description.

TARGET JOB DESCRIPTION:
---
${jobDescription}
---

CANDIDATE RESUME:
---
${resume}
---`;

  try {
    const report = await fetchGemini(apiKey, model, systemInstruction, prompt);
    res.json(report);
  } catch (err) {
    console.error("Analysis Endpoint Failure:", err);
    res.status(500).json({ error: err.message });
  }
});

// 4. Tailor Resume Summary and Work Bullets
app.post("/api/tailor", async (req, res) => {
  const apiKey = resolveApiKey(req);
  if (!apiKey) {
    return res.status(401).json({ error: "API Credentials missing. Add your Gemini API Key." });
  }

  const { resume, jobDescription, model = "gemini-1.5-flash" } = req.body;
  if (!resume || !jobDescription) {
    return res.status(400).json({ error: "Missing inputs." });
  }

  const systemInstruction = `You are a professional resume writer and career coach. Your task is to re-engineer the provided resume to optimize its impact for the target job description.
  
Generate the results as a single valid JSON object following this EXACT schema:
{
  "summary": "a highly compelling, tailored, modern professional summary (3-4 sentences) that highlights the candidate's matching strengths and targets the job description directly, incorporating crucial keywords.",
  "bullets": [
    {
      "original": "copy of an original bullet point or experience sentence from the candidate's resume that has room for improvement",
      "tailored": "completely rewritten bullet point using the STAR method (Situation, Task, Action, Result) with strong action verbs, highlighting specific technologies or metrics from the job description, showing strong alignment."
    }
  ]
}

Provide 3 to 5 optimized bullet point suggestions.`;

  const prompt = `Generate tailoring suggestions for this resume to fit the job description. Select the 3-5 most important or standard bullet points from the work experience and rewrite them to maximize impact.

TARGET JOB DESCRIPTION:
---
${jobDescription}
---

CANDIDATE RESUME:
---
${resume}
---`;

  try {
    const tailored = await fetchGemini(apiKey, model, systemInstruction, prompt);
    res.json(tailored);
  } catch (err) {
    console.error("Tailoring Endpoint Failure:", err);
    res.status(500).json({ error: err.message });
  }
});

// 5. Generate custom Interview Prep
app.post("/api/interview", async (req, res) => {
  const apiKey = resolveApiKey(req);
  if (!apiKey) {
    return res.status(401).json({ error: "API Credentials missing. Add your Gemini API Key." });
  }

  const { resume, jobDescription, model = "gemini-1.5-flash" } = req.body;
  if (!resume || !jobDescription) {
    return res.status(400).json({ error: "Missing inputs." });
  }

  const systemInstruction = `You are an elite hiring manager and interviewer. You must analyze the candidate's resume and the job description, identify critical skills gaps or high-value requirements, and design 5 custom interview questions.

You must output an array of 5 objects matching this EXACT JSON schema:
[
  {
    "type": "Technical" or "Behavioral",
    "question": "A highly specific, contextualized interview question tailored to the candidate's resume and the target job description (avoid generic questions)",
    "approach": "A 2-3 sentence coaching guide explaining what the interviewer is looking for and how the candidate should structure their answer, specifically using the STAR method for behavioral questions or specifying critical technical details for technical ones."
  }
]`;

  const prompt = `Generate 5 custom interview questions for this candidate based on their resume and the target job description. Make them challenging and tailored to their specific background and gaps.

TARGET JOB DESCRIPTION:
---
${jobDescription}
---

CANDIDATE RESUME:
---
${resume}
---`;

  try {
    const prep = await fetchGemini(apiKey, model, systemInstruction, prompt);
    res.json(prep);
  } catch (err) {
    console.error("Interview Prep Endpoint Failure:", err);
    res.status(500).json({ error: err.message });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`===========================================`);
  console.log(`ResumeAI Express API Server active!`);
  console.log(`Listening on: http://localhost:${PORT}`);
  console.log(`Default Model: gemini-1.5-flash`);
  console.log(`===========================================`);
});
