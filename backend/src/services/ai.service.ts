import dotenv from "dotenv"
dotenv.config()
import Groq from "groq-sdk"
import { ResumeAnalysis } from "../types"

const client = new Groq({ apiKey: process.env.GROQ_API_KEY || "" })

export async function analyzeResume(
  resumeText: string,
  jobDescription?: string,
  onProgress?: (step: string) => void
): Promise<ResumeAnalysis> {
  const hasJD = Boolean(jobDescription?.trim())

  const prompt = `You are an expert career coach. Analyze this resume and return ONLY valid JSON no markdown no code blocks.

RESUME:
${resumeText}

${hasJD ? "JOB DESCRIPTION:\n" + jobDescription : ""}

Return exactly this JSON with real analyzed values:
{
  "score": 75,
  "scoreBreakdown": { "clarity": 20, "impact": 18, "skills": 20, "formatting": 17 },
  "summary": "Two sentence professional summary.",
  "experienceLevel": "Mid",
  "technicalSkills": ["skill1", "skill2"],
  "softSkills": ["skill1", "skill2"],
  "missingSkills": ["skill1"],
  "suggestions": ["tip1", "tip2", "tip3", "tip4", "tip5"],
  "strengths": ["strength1", "strength2", "strength3"],
  "matchPercentage": ${hasJD ? "75" : "null"},
  "matchedKeywords": ${hasJD ? '["kw1"]' : "[]"},
  "missingKeywords": ${hasJD ? '["kw1"]' : "[]"}
}

Analyze the actual resume and fill real values. Return ONLY the JSON object.`

  try {
    onProgress?.("Sending to Groq AI...")
    const completion = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
      max_tokens: 2048
    })

    onProgress?.("Parsing response...")
    const raw = completion.choices[0]?.message?.content || ""
    const cleaned = raw.replace(/```json/g, "").replace(/```/g, "").trim()
    const parsed = JSON.parse(cleaned)

    onProgress?.("Analysis complete!")
    return parsed as ResumeAnalysis
  } catch (err) {
    console.error("AI analysis error:", err)
    throw new Error("Analysis failed: " + (err instanceof Error ? err.message : "Unknown"))
  }
}
