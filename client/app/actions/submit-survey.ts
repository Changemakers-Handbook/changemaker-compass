'use server';

import type { Survey } from '@/types/survey';

const PAYLOAD_API_URL = process.env.PAYLOAD_API_URL ?? 'http://localhost:3001';

export async function calculateScore(
  survey: Survey,
  answers: Record<string, string | number | boolean>,
): Promise<{ score: number; resultLabel: string; resultDescription: string }> {
  let score = 0;

  for (const question of survey.questions) {
    const answer = answers[question.id];
    if (answer === undefined || answer === null || answer === '') continue;

    if (question.type === 'multiple_choice' && question.options) {
      const option = question.options.find((o) => o.id === answer);
      if (option) score += option.value;
    } else if (question.type === 'true_false') {
      const isTrue = answer === true || answer === 'true';
      score += isTrue ? (question.trueValue ?? 1) : (question.falseValue ?? 0);
    } else if (question.type === 'scale') {
      score += Number(answer);
    }
    // 'text' questions do not contribute to the score
  }

  const range = survey.resultRanges.find(
    (r) => score >= r.minScore && score <= r.maxScore,
  );

  return {
    score,
    resultLabel: range?.label ?? '',
    resultDescription: range?.description ?? '',
  };
}

export async function submitSurveyResponse(params: {
  surveyId: string;
  email: string;
  answers: Record<string, string | number | boolean>;
  score: number;
  resultLabel: string;
  receiveResults?: boolean;
  marketingOptIn?: boolean;
}): Promise<{ success: boolean; error?: string }> {
  const { surveyId, email, answers, score, resultLabel, receiveResults, marketingOptIn } = params;

  const res = await fetch(`${PAYLOAD_API_URL}/api/responses`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      survey: surveyId,
      email,
      answers,
      score,
      resultLabel,
      receiveResults: receiveResults ?? false,
      marketingOptIn: marketingOptIn ?? false,
    }),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({})) as { errors?: { message: string }[] };
    const message = body?.errors?.[0]?.message ?? `Request failed with status ${res.status}`;
    return { success: false, error: message };
  }

  return { success: true };
}
