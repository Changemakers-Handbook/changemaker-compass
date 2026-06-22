export type QuestionType = 'multiple_choice' | 'text' | 'scale';

export interface QuestionOption {
  id: string;
  text: string;
  value: number;
}

export interface Question {
  id: string;
  text: string;
  type: QuestionType;
  options?: QuestionOption[];
  scaleMin?: number;
  scaleMax?: number;
}

export interface ResultRange {
  label: string;
  description: string;
  minScore: number;
  maxScore: number;
}

export interface Survey {
  id: string;
  title: string;
  description: string;
  slug: string;
  questions: Question[];
  resultRanges: ResultRange[];
  published: boolean;
  createdAt: string;
}

export interface SurveyResponse {
  id: string;
  surveyId: string;
  email: string;
  answers: Record<string, string | number>;
  score: number;
  resultLabel: string;
  createdAt: string;
}
