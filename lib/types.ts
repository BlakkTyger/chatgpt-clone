// lib/types.ts

// ✨ Renamed to AIModel to be more inclusive
export enum AIModel {
    GPT3 = "gpt-3.5-turbo",
    GPT4 = "gpt-4",
    GeminiFlash = "gemini-1.5-flash-latest", // ✨ Added Gemini model
  }
  
  export interface Profile {
    id: string;
    model: AIModel; // Use the renamed enum
    endsOn?: number;
  }