'use server';

import type { Survey, ProfileScore, ResultRule, RuleCondition } from '@/types/survey';

const PAYLOAD_API_URL = process.env.PAYLOAD_API_URL ?? 'http://localhost:3001';

export interface RuleMatch {
  title?: string;
  text: string;
}

export interface ScoreResult {
  score: number;
  resultLabel: string;
  resultDescription: string;
  profileScores?: ProfileScore[];
  ruleMatches?: RuleMatch[];
}

function evaluateCondition(
  cond: RuleCondition,
  profileScores: ProfileScore[],
  totalScore: number,
  dominantKey: string | undefined,
): boolean {
  const ps = cond.profile ? profileScores.find((p) => p.key === cond.profile) : undefined;
  const t = cond.threshold ?? 0;

  switch (cond.operator) {
    case 'profile_score_above':
      return !!ps && ps.score > t;
    case 'profile_score_below':
      return !!ps && ps.score < t;
    case 'profile_pct_above':
      return !!ps && ps.percentage > t;
    case 'profile_pct_below':
      return !!ps && ps.percentage < t;
    case 'is_highest':
      return !!cond.profile && cond.profile === dominantKey;
    case 'total_above':
      return totalScore > t;
    case 'total_below':
      return totalScore < t;
    default:
      return false;
  }
}

function evaluateRules(
  rules: ResultRule[],
  profileScores: ProfileScore[],
  totalScore: number,
): RuleMatch[] {
  const dominantKey = [...profileScores].sort((a, b) => b.score - a.score)[0]?.key;
  const matches: RuleMatch[] = [];

  for (const rule of rules) {
    const check = rule.conditionOperator === 'or' ? 'some' : 'every';
    const met = rule.conditions[check]((cond) =>
      evaluateCondition(cond, profileScores, totalScore, dominantKey),
    );
    if (met) matches.push({ title: rule.title ?? undefined, text: rule.text });
  }

  return matches;
}

export async function calculateScore(
  survey: Survey,
  answers: Record<string, string | number | boolean | string[]>,
): Promise<ScoreResult> {
  if (survey.scoringMode === 'profile' && survey.profiles?.length) {
    const totals: Record<string, number> = {};
    for (const p of survey.profiles) totals[p.key] = 0;

    for (const question of survey.questions) {
      const answer = answers[question.id];
      if (answer === undefined || answer === null || answer === '') continue;
      if (Array.isArray(answer) && answer.length === 0) continue;

      if (question.type === 'multiple_choice' && question.options) {
        const option = question.options.find((o) => o.id === answer);
        if (option?.profile && totals[option.profile] !== undefined) {
          totals[option.profile] += option.value ?? 0;
        }
      } else if (question.type === 'multi_select' && question.options && Array.isArray(answer)) {
        for (const selectedId of answer) {
          const option = question.options.find((o) => o.id === selectedId);
          if (option?.profile && totals[option.profile] !== undefined) {
            totals[option.profile] += option.value ?? 0;
          }
        }
      }
    }

    const grandTotal = Object.values(totals).reduce((a, b) => a + b, 0);

    const profileScores: ProfileScore[] = survey.profiles
      .map((p) => ({
        key: p.key,
        label: p.label,
        color: p.color,
        score: totals[p.key] ?? 0,
        percentage: grandTotal > 0 ? ((totals[p.key] ?? 0) / grandTotal) * 100 : 0,
      }))
      .sort((a, b) => b.score - a.score);

    const ruleMatches = survey.resultRules?.length
      ? evaluateRules(survey.resultRules, profileScores, grandTotal)
      : undefined;

    return {
      score: grandTotal,
      resultLabel: '',
      resultDescription: '',
      profileScores,
      ruleMatches,
    };
  }

  // Numeric mode
  let score = 0;
  for (const question of survey.questions) {
    const answer = answers[question.id];
    if (answer === undefined || answer === null || answer === '') continue;
    if (Array.isArray(answer) && answer.length === 0) continue;

    if (question.type === 'multiple_choice' && question.options) {
      const option = question.options.find((o) => o.id === answer);
      if (option) score += option.value;
    } else if (question.type === 'multi_select' && question.options && Array.isArray(answer)) {
      for (const selectedId of answer) {
        const option = question.options.find((o) => o.id === selectedId);
        if (option) score += option.value;
      }
    } else if (question.type === 'true_false') {
      const isTrue = answer === true || answer === 'true';
      score += isTrue ? (question.trueValue ?? 1) : (question.falseValue ?? 0);
    } else if (question.type === 'scale') {
      score += Number(answer);
    }
  }

  const range = survey.resultRanges?.find((r) => score >= r.minScore && score <= r.maxScore);

  const ruleMatches = survey.resultRules?.length
    ? evaluateRules(survey.resultRules, [], score)
    : undefined;

  return {
    score,
    resultLabel: range?.label ?? '',
    resultDescription: range?.description ?? '',
    ruleMatches,
  };
}

export async function submitSurveyResponse(params: {
  surveyId: string;
  email: string;
  answers: Record<string, string | number | boolean | string[]>;
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
    const body = (await res.json().catch(() => ({}))) as { errors?: { message: string }[] };
    const message = body?.errors?.[0]?.message ?? `Request failed with status ${res.status}`;
    return { success: false, error: message };
  }

  return { success: true };
}
