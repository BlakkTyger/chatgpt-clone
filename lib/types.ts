export enum AIModel {
    GPT4 = "gpt-4.1-nano-2025-04-14",
    GeminiFlash = "gemini-2.5-flash",
  }
  
  export interface Profile {
    id: string;
    model: AIModel;
    endsOn?: number;
  }