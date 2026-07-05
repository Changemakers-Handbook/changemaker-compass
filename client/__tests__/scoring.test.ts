import { describe, it, expect } from 'vitest';
import { calculateScore } from '@/app/actions/submit-survey';
import type { Survey, ResultRule } from '@/types/survey';

function makeSurvey(overrides: Partial<Survey> = {}): Survey {
  return {
    id: 'survey-1',
    title: 'Test Survey',
    description: '',
    slug: 'test',
    scoringMode: 'numeric',
    questions: [],
    resultRanges: [],
    published: true,
    createdAt: '2024-01-01T00:00:00Z',
    ...overrides,
  };
}

// ─── Numeric scoring ──────────────────────────────────────────────────────────

describe('numeric scoring', () => {
  it('sums multiple choice option values', async () => {
    const survey = makeSurvey({
      questions: [
        {
          id: 'q1',
          text: 'Q1',
          type: 'multiple_choice',
          options: [
            { id: 'a', text: 'Option A', value: 3 },
            { id: 'b', text: 'Option B', value: 1 },
          ],
        },
      ],
    });
    const result = await calculateScore(survey, { q1: 'a' });
    expect(result.score).toBe(3);
  });

  it('accumulates scores across multiple questions', async () => {
    const survey = makeSurvey({
      questions: [
        {
          id: 'q1',
          text: 'Q1',
          type: 'multiple_choice',
          options: [{ id: 'a', text: 'A', value: 4 }],
        },
        {
          id: 'q2',
          text: 'Q2',
          type: 'multiple_choice',
          options: [{ id: 'b', text: 'B', value: 6 }],
        },
      ],
    });
    const result = await calculateScore(survey, { q1: 'a', q2: 'b' });
    expect(result.score).toBe(10);
  });

  it('uses trueValue when true_false answer is true', async () => {
    const survey = makeSurvey({
      questions: [{ id: 'q1', text: 'Q', type: 'true_false', trueValue: 5, falseValue: 0 }],
    });
    const result = await calculateScore(survey, { q1: 'true' });
    expect(result.score).toBe(5);
  });

  it('uses falseValue when true_false answer is false', async () => {
    const survey = makeSurvey({
      questions: [{ id: 'q1', text: 'Q', type: 'true_false', trueValue: 5, falseValue: 2 }],
    });
    const result = await calculateScore(survey, { q1: 'false' });
    expect(result.score).toBe(2);
  });

  it('adds scale value directly', async () => {
    const survey = makeSurvey({
      questions: [{ id: 'q1', text: 'Q', type: 'scale', scaleMin: 1, scaleMax: 10 }],
    });
    const result = await calculateScore(survey, { q1: 7 });
    expect(result.score).toBe(7);
  });

  it('skips unanswered questions', async () => {
    const survey = makeSurvey({
      questions: [
        {
          id: 'q1',
          text: 'Q1',
          type: 'multiple_choice',
          options: [{ id: 'a', text: 'A', value: 5 }],
        },
        {
          id: 'q2',
          text: 'Q2',
          type: 'multiple_choice',
          options: [{ id: 'b', text: 'B', value: 10 }],
        },
      ],
    });
    const result = await calculateScore(survey, { q1: 'a' }); // q2 unanswered
    expect(result.score).toBe(5);
  });
});

// ─── Result ranges ────────────────────────────────────────────────────────────

describe('result ranges', () => {
  const survey = makeSurvey({
    questions: [
      {
        id: 'q1',
        text: 'Q',
        type: 'multiple_choice',
        options: [{ id: 'a', text: 'A', value: 8 }],
      },
    ],
    resultRanges: [
      { label: 'Low', description: 'Low desc', minScore: 0, maxScore: 5 },
      { label: 'High', description: 'High desc', minScore: 6, maxScore: 10 },
    ],
  });

  it('returns the matching range label and description', async () => {
    const result = await calculateScore(survey, { q1: 'a' }); // score 8 → High
    expect(result.resultLabel).toBe('High');
    expect(result.resultDescription).toBe('High desc');
  });

  it('returns empty strings when no range matches', async () => {
    const noRangeSurvey = makeSurvey({
      resultRanges: [{ label: 'X', description: 'X', minScore: 10, maxScore: 20 }],
    });
    const result = await calculateScore(noRangeSurvey, {}); // score 0, no match
    expect(result.resultLabel).toBe('');
    expect(result.resultDescription).toBe('');
  });
});

// ─── Profile scoring ──────────────────────────────────────────────────────────

describe('profile scoring', () => {
  const survey = makeSurvey({
    scoringMode: 'profile',
    profiles: [
      { id: 'p1', key: 'red', label: 'Red' },
      { id: 'p2', key: 'blue', label: 'Blue' },
    ],
    questions: [
      {
        id: 'q1',
        text: 'Q1',
        type: 'multiple_choice',
        options: [
          { id: 'opt-r', text: 'Red answer', value: 6, profile: 'red' },
          { id: 'opt-b', text: 'Blue answer', value: 4, profile: 'blue' },
        ],
      },
      {
        id: 'q2',
        text: 'Q2',
        type: 'multiple_choice',
        options: [{ id: 'opt-r2', text: 'More red', value: 4, profile: 'red' }],
      },
    ],
  });

  it('accumulates points into their respective profiles', async () => {
    // q1 → red (+6), q2 → red (+4)  total red = 10, blue = 0
    const result = await calculateScore(survey, { q1: 'opt-r', q2: 'opt-r2' });
    const red = result.profileScores?.find((p) => p.key === 'red');
    expect(red?.score).toBe(10);
  });

  it('calculates correct percentages across profiles', async () => {
    // q1 → red 6, q2 → blue (skipped), only q1 answered with red
    const result = await calculateScore(survey, { q1: 'opt-r' });
    // red: 6 / 6 total = 100%
    const red = result.profileScores?.find((p) => p.key === 'red');
    const blue = result.profileScores?.find((p) => p.key === 'blue');
    expect(red?.percentage).toBeCloseTo(100);
    expect(blue?.percentage).toBeCloseTo(0);
  });

  it('splits percentages evenly when profiles are equal', async () => {
    // q1 → blue (4), q2 also answered with red (4) → 50/50
    const result = await calculateScore(survey, { q1: 'opt-b', q2: 'opt-r2' });
    const red = result.profileScores?.find((p) => p.key === 'red');
    const blue = result.profileScores?.find((p) => p.key === 'blue');
    expect(red?.percentage).toBeCloseTo(50);
    expect(blue?.percentage).toBeCloseTo(50);
  });

  it('returns zero percentages when no questions are answered', async () => {
    const result = await calculateScore(survey, {});
    expect(result.profileScores?.every((p) => p.percentage === 0)).toBe(true);
  });
});

// ─── Result rules ─────────────────────────────────────────────────────────────

describe('result rules', () => {
  function surveyWithRules(rules: ResultRule[]) {
    return makeSurvey({
      scoringMode: 'profile',
      profiles: [
        { id: 'p1', key: 'red', label: 'Red' },
        { id: 'p2', key: 'blue', label: 'Blue' },
      ],
      questions: [
        {
          id: 'q1',
          text: 'Q',
          type: 'multiple_choice',
          options: [
            { id: 'opt-r', text: 'Red', value: 10, profile: 'red' },
            { id: 'opt-b', text: 'Blue', value: 5, profile: 'blue' },
          ],
        },
      ],
      resultRules: rules,
    });
  }

  it('AND rule fires when all conditions are met', async () => {
    const survey = surveyWithRules([
      {
        id: 'r1',
        blockType: 'result-rule',
        conditionOperator: 'and',
        conditions: [
          { id: 'c1', profile: 'red', operator: 'profile_score_above', threshold: 5 },
          { id: 'c2', profile: 'red', operator: 'is_highest' },
        ],
        text: 'Red wins',
      },
    ]);
    const result = await calculateScore(survey, { q1: 'opt-r' }); // red: 10
    expect(result.ruleMatches).toHaveLength(1);
    expect(result.ruleMatches?.[0].text).toBe('Red wins');
  });

  it('AND rule does not fire when any condition fails', async () => {
    const survey = surveyWithRules([
      {
        id: 'r1',
        blockType: 'result-rule',
        conditionOperator: 'and',
        conditions: [
          { id: 'c1', profile: 'red', operator: 'profile_score_above', threshold: 5 },
          { id: 'c2', profile: 'blue', operator: 'profile_score_above', threshold: 5 }, // blue gets 0
        ],
        text: 'Both high',
      },
    ]);
    const result = await calculateScore(survey, { q1: 'opt-r' }); // blue: 0
    expect(result.ruleMatches).toHaveLength(0);
  });

  it('OR rule fires when at least one condition is met', async () => {
    const survey = surveyWithRules([
      {
        id: 'r1',
        blockType: 'result-rule',
        conditionOperator: 'or',
        conditions: [
          { id: 'c1', profile: 'blue', operator: 'profile_score_above', threshold: 20 }, // false
          { id: 'c2', profile: 'red', operator: 'profile_score_above', threshold: 5 }, // true
        ],
        text: 'At least one matches',
      },
    ]);
    const result = await calculateScore(survey, { q1: 'opt-r' }); // red: 10
    expect(result.ruleMatches).toHaveLength(1);
  });

  it('OR rule does not fire when no conditions are met', async () => {
    const survey = surveyWithRules([
      {
        id: 'r1',
        blockType: 'result-rule',
        conditionOperator: 'or',
        conditions: [
          { id: 'c1', profile: 'red', operator: 'profile_score_above', threshold: 20 },
          { id: 'c2', profile: 'blue', operator: 'profile_score_above', threshold: 20 },
        ],
        text: 'Neither',
      },
    ]);
    const result = await calculateScore(survey, { q1: 'opt-r' }); // red: 10, blue: 0
    expect(result.ruleMatches).toHaveLength(0);
  });

  it('is_highest condition identifies the dominant profile', async () => {
    const survey = surveyWithRules([
      {
        id: 'r1',
        blockType: 'result-rule',
        conditions: [{ id: 'c1', profile: 'blue', operator: 'is_highest' }],
        text: 'Blue is top',
      },
    ]);
    const result = await calculateScore(survey, { q1: 'opt-b' }); // blue: 5, red: 0
    expect(result.ruleMatches).toHaveLength(1);
  });

  it('total_above and total_below work in numeric mode', async () => {
    const numericSurvey = makeSurvey({
      questions: [
        {
          id: 'q1',
          text: 'Q',
          type: 'multiple_choice',
          options: [{ id: 'a', text: 'A', value: 8 }],
        },
      ],
      resultRules: [
        {
          id: 'r1',
          blockType: 'result-rule',
          conditions: [{ id: 'c1', operator: 'total_above', threshold: 5 }],
          text: 'High scorer',
        },
        {
          id: 'r2',
          blockType: 'result-rule',
          conditions: [{ id: 'c2', operator: 'total_below', threshold: 5 }],
          text: 'Low scorer',
        },
      ],
    });
    const result = await calculateScore(numericSurvey, { q1: 'a' }); // score 8
    expect(result.ruleMatches?.map((m) => m.text)).toEqual(['High scorer']);
  });
});
