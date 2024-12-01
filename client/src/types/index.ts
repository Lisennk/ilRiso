interface Detail {
  question: string;
  response: string;
}

interface AppState {
  prompt: string;
  details: Detail[];
}

interface APIResponse {
  type: 'question' | 'code';
  totalSteps: number;
  completedSteps: number;
  content: string;
} 