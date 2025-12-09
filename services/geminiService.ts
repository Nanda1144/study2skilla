import { GoogleGenAI, Type } from "@google/genai";
import { RoadmapData, ResumeAnalysis, InterviewFeedback, IndustryTrend, UserProfile } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

// Helper to check if API key exists
export const hasApiKey = () => !!apiKey;

export const generateRoadmap = async (domain: string): Promise<RoadmapData | null> => {
  if (!apiKey) throw new Error("API Key missing");

  const prompt = `Create a detailed 4-year (8-semester) engineering learning roadmap for the domain: "${domain}". 
  For each semester, provide a focus area, list of technical skills to learn, 1-2 key projects to build, and recommended resource types (e.g., 'Coursera course on X', 'Official Docs').`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
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

export const getMarketInsights = async (domain: string): Promise<IndustryTrend[]> => {
  if (!apiKey) return [];

  const prompt = `Generate a JSON list of top 5 trending technologies/tools specifically within the "${domain}" industry right now. 
  For each, provide an estimated demand score (0-100) and year-over-year growth percentage estimate.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              demand: { type: Type.INTEGER },
              growth: { type: Type.NUMBER }
            }
          }
        }
      }
    });
    return JSON.parse(response.text) as IndustryTrend[];
  } catch (e) {
    return [];
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