export type QuestionType = 'multiple_choice' | 'true_false' | 'text' | 'scale';

export type ScoringMode = 'numeric' | 'profile';

export interface QuestionOption {
  id: string;
  text: string;
  value: number;
  profile?: string;
}

export interface Question {
  id: string;
  text: string;
  type: QuestionType;
  options?: QuestionOption[];
  trueValue?: number;
  falseValue?: number;
  scaleMin?: number;
  scaleMax?: number;
}

export interface ResultRange {
  label: string;
  description: string;
  minScore: number;
  maxScore: number;
}

export interface ScoringProfile {
  id: string;
  key: string;
  label: string;
  color?: string;
}

export interface ProfileScore {
  key: string;
  label: string;
  color?: string;
  score: number;
  percentage: number;
}

export type RuleOperator =
  | 'profile_score_above'
  | 'profile_score_below'
  | 'profile_pct_above'
  | 'profile_pct_below'
  | 'is_highest'
  | 'total_above'
  | 'total_below';

export interface RuleCondition {
  id: string;
  profile?: string;
  operator: RuleOperator;
  threshold?: number;
}

export interface ResultRule {
  id: string;
  blockType: 'result-rule';
  title?: string;
  conditions: RuleCondition[];
  text: string;
}

export interface SuggestedSurvey {
  id: string;
  title: string;
  slug: string;
  description?: string;
}

export interface Survey {
  id: string;
  title: string;
  description: string;
  slug: string;
  scoringMode?: ScoringMode;
  profiles?: ScoringProfile[];
  questions: Question[];
  resultRanges: ResultRange[];
  defaultResultText?: string;
  resultRules?: ResultRule[];
  suggestedSurvey?: SuggestedSurvey;
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
