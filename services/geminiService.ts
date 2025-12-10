import { GoogleGenAI, Type } from "@google/genai";
import { RoadmapData, ResumeAnalysis, InterviewFeedback, InsightsResponse, UserProfile } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

// Helper to check if API key exists
export const hasApiKey = () => !!apiKey;

export const generateRoadmap = async (domain: string): Promise<RoadmapData | null> => {
  if (!apiKey) throw new Error("API Key missing");

  const prompt = `Create a detailed 4-year (8-semester) engineering learning roadmap for the domain: "${domain}". 
  For each semester, provide a focus area, list of technical skills to learn, 1-2 key projects to build, and recommended resource types (e.g., 'Coursera course on X', 'Official Docs').`;

  try {
    // Using gemini-3-pro-preview with Thinking Mode for complex curriculum planning
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 32768 }, // Max thinking budget for deep reasoning
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            domain: { type: Type.STRING },
            roadmap: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  semester: { type: Type.INTEGER },
                  focus: { type: Type.STRING },
                  skills: { type: Type.ARRAY, items: { type: Type.STRING } },
                  projects: { type: Type.ARRAY, items: { type: Type.STRING } },
                  resources: { type: Type.ARRAY, items: { type: Type.STRING } }
                }
              }
            }
          }
        }
      }
    });
    
    return JSON.parse(response.text) as RoadmapData;
  } catch (error) {
    console.error("Roadmap generation failed:", error);
    return null;
  }
};

export const analyzeResume = async (input: string, isFile: boolean = false, mimeType: string = ''): Promise<ResumeAnalysis | null> => {
  if (!apiKey) throw new Error("API Key missing");

  let contents: any[] = [];
  
  if (isFile) {
    contents = [
      {
        inlineData: {
          mimeType: mimeType,
          data: input // Base64 string
        }
      },
      { text: "Analyze this resume image/PDF. Determine the domain, score (0-100), strengths, missing skills, and improvement plan." }
    ];
  } else {
    contents = [{ text: `Analyze the following student resume text. Determine domain, score, strengths, missing skills, and plan.\n\n${input.substring(0, 5000)}` }];
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: { parts: contents },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            matchedDomain: { type: Type.STRING },
            score: { type: Type.INTEGER },
            strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
            missingSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
            improvementPlan: { type: Type.ARRAY, items: { type: Type.STRING } }
          }
        }
      }
    });

    return JSON.parse(response.text) as ResumeAnalysis;
  } catch (error) {
    console.error("Resume analysis failed:", error);
    return null;
  }
};

export const generateResumeContent = async (profile: UserProfile): Promise<string> => {
    if (!apiKey) return "API Key missing";

    const prompt = `Create a professional resume content for a student with these details:
    Name: ${profile.name}
    University: ${profile.university}
    Target Domain: ${profile.domain}
    Skills: ${profile.skills.join(', ')}
    Bio: ${profile.bio}

    Structure it with Summary, Education, Skills, and Generated Project Descriptions based on the domain. Return in Markdown format.`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt
        });
        return response.text;
    } catch (e) {
        return "Failed to generate resume.";
    }
}

export const generateJobApplication = async (profile: UserProfile, jobRole: string, company: string): Promise<{ coverLetter: string, tailoredSummary: string } | null> => {
  if (!apiKey) throw new Error("API Key missing");

  const prompt = `
  Role: ${jobRole} at ${company}
  Candidate: ${profile.name}
  Skills: ${profile.skills.join(', ')}
  Bio: ${profile.bio}

  Task:
  1. Write a professional, persuasive cover letter for this specific role.
  2. Write a tailored 2-sentence resume summary highlighting relevant skills for this job.

  Output JSON.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            coverLetter: { type: Type.STRING },
            tailoredSummary: { type: Type.STRING }
          }
        }
      }
    });
    return JSON.parse(response.text) as { coverLetter: string, tailoredSummary: string };
  } catch (e) {
    console.error("Job application generation failed", e);
    return null;
  }
};

export const getInterviewFeedback = async (question: string, answer: string, type: string): Promise<InterviewFeedback | null> => {
  if (!apiKey) throw new Error("API Key missing");

  const prompt = `I am a student practicing for a ${type} interview.
  Question: "${question}"
  My Answer: "${answer}"
  
  Provide feedback in JSON format:
  1. Score (0-100)
  2. Feedback (Constructive criticism)
  3. Better Answer (How a senior engineer would answer)`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.INTEGER },
            feedback: { type: Type.STRING },
            betterAnswer: { type: Type.STRING }
          }
        }
      }
    });
    return JSON.parse(response.text) as InterviewFeedback;
  } catch (e) {
    console.error(e);
    return null;
  }
};

export const generateInterviewQuestion = async (domain: string, type: string): Promise<string> => {
   if (!apiKey) return "Describe a challenging project you worked on.";

   let systemInstruction = "You are a technical interviewer.";
   if (type === "Skeptical CTO") {
     systemInstruction = "You are a grumpy, skeptical CTO. You doubt the candidate's skills. Ask a hard, architectural or 'why' question that tests deep understanding, not just syntax. Be brief.";
   }

   const prompt = `Generate a single, unique interview question for a ${domain} role. Type: ${type}.`;
   
   try {
     const response = await ai.models.generateContent({
       model: "gemini-2.5-flash",
       contents: prompt,
       config: { systemInstruction }
     });
     return response.text.trim();
   } catch (e) {
     return "Tell me about yourself.";
   }
}

export const getMarketInsights = async (domain: string): Promise<InsightsResponse> => {
  if (!apiKey) return { trends: [], sources: [] };

  const prompt = `Identify top 5 trending technologies/tools specifically within the "${domain}" industry right now. 
  For each, provide an estimated demand score (0-100) and year-over-year growth percentage estimate.
  Output strictly in JSON format with a list of trends under the key "trends". Example: {"trends": [{"name": "Tech", "demand": 80, "growth": 10}]}`;

  try {
    // Using Google Search Grounding to get real-time data
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        // responseMimeType cannot be used with googleSearch
      }
    });
    
    // Extract Grounding Metadata
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks
      ?.map((chunk: any) => {
          if (chunk.web) {
              return { title: chunk.web.title, uri: chunk.web.uri };
          }
          return null;
      })
      .filter((s: any) => s !== null) || [];

    // Parse JSON Text
    let trends: any = [];
    try {
        // Remove markdown code blocks if present
        const cleanText = response.text.replace(/```json/g, '').replace(/```/g, '').trim();
        trends = JSON.parse(cleanText);
        
        if (Array.isArray(trends)) {
           // handled
        } else if (trends.trends) {
           trends = trends.trends;
        } else {
            // Fallback parsing if structure varies
             const values = Object.values(trends);
             if (values.length > 0 && Array.isArray(values[0])) {
                 trends = values[0];
             }
        }
    } catch (e) {
        console.warn("Failed to parse JSON directly, attempting regex extraction");
        const jsonMatch = response.text.match(/\[.*\]/s) || response.text.match(/\{.*\}/s);
        if (jsonMatch) {
            try {
                const parsed = JSON.parse(jsonMatch[0]);
                trends = Array.isArray(parsed) ? parsed : (parsed.trends || []);
            } catch (innerE) {
                console.error("Regex parsing failed", innerE);
            }
        }
    }

    return {
        trends: Array.isArray(trends) ? trends : [],
        sources: sources as { title: string; uri: string }[]
    };
  } catch (e) {
    console.error("Market insights error:", e);
    return { trends: [], sources: [] };
  }
}

export const chatWithMentor = async (history: {role: string, parts: {text: string}[]}[], message: string) => {
  if (!apiKey) throw new Error("API Key missing");

  const chat = ai.chats.create({
    model: "gemini-2.5-flash",
    history: history,
    config: {
      systemInstruction: "You are a wise and encouraging engineering career mentor. Keep answers concise, practical, and inspiring."
    }
  });

  return chat.sendMessageStream({ message });
};

// Edit Profile Image using Nano Banana (Gemini 2.5 Flash Image)
export const editProfileImage = async (base64Image: string, prompt: string): Promise<string | null> => {
    if (!apiKey) throw new Error("API Key missing");

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-image",
            contents: {
                parts: [
                    {
                        inlineData: {
                            mimeType: "image/png",
                            data: base64Image
                        }
                    },
                    { text: prompt }
                ]
            }
        });

        // Extract image from response
        for (const part of response.candidates?.[0]?.content?.parts || []) {
            if (part.inlineData) {
                return part.inlineData.data;
            }
        }
        return null;
    } catch (error) {
        console.error("Image editing failed:", error);
        return null;
    }
}