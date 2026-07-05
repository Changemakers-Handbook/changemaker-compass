'use client';

import { useState, useMemo } from 'react';
import { useForm, Controller, type FieldError } from 'react-hook-form';
import {
  Stack,
  TextInput,
  Checkbox,
  Button,
  Radio,
  Textarea,
  Slider,
  Title,
  Text,
  Paper,
  Badge,
  Divider,
  Group,
  Card,
  Alert,
  Progress,
} from '@mantine/core';
import Link from 'next/link';
import { MarkdownContent } from '@/app/components/MarkdownContent';
import type { Survey } from '@/types/survey';
import {
  calculateScore,
  submitSurveyResponse,
  type ScoreResult,
} from '@/app/actions/submit-survey';

type AnswerValue = string | number;

interface FormValues {
  answers: Record<string, AnswerValue>;
  email: string;
  receiveResults: boolean;
  marketingOptIn: boolean;
}

type ResultState = ScoreResult;

function scaleMarks(min: number, max: number) {
  const range = max - min;
  if (range <= 10) {
    return Array.from({ length: range + 1 }, (_, i) => ({
      value: min + i,
      label: String(min + i),
    }));
  }
  return [
    { value: min, label: String(min) },
    { value: max, label: String(max) },
  ];
}

export function SurveyForm({ survey }: { survey: Survey }) {
  const [result, setResult] = useState<ResultState | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const defaultValues = useMemo<FormValues>(() => {
    const answers: Record<string, AnswerValue> = {};
    for (const q of survey.questions) {
      if (q.type === 'scale') answers[q.id] = q.scaleMin ?? 1;
    }
    return { answers, email: '', receiveResults: true, marketingOptIn: false };
  }, [survey.questions]);

  const {
    control,
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>({ defaultValues });

  // eslint-disable-next-line react-hooks/incompatible-library
  const email = watch('email');
  const answerErrors = errors.answers as Record<string, FieldError> | undefined;

  const onSubmit = async (data: FormValues) => {
    setSubmitting(true);
    setSubmitError(null);
    try {
      const scored = await calculateScore(
        survey,
        data.answers as Record<string, string | number | boolean>,
      );
      if (data.email) {
        await submitSurveyResponse({
          surveyId: survey.id,
          email: data.email,
          answers: data.answers as Record<string, string | number | boolean>,
          score: scored.score,
          resultLabel: scored.resultLabel,
          receiveResults: data.receiveResults,
          marketingOptIn: data.marketingOptIn,
        });
      }
      setResult(scored);
    } catch {
      setSubmitError('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (result) {
    const isProfile = survey.scoringMode === 'profile' && result.profileScores?.length;

    return (
      <Stack gap="xl">
        <Paper withBorder p="xl" radius="md">
          <Stack gap="lg">
            {isProfile ? (
              <>
                <Title order={2}>Your profile breakdown</Title>
                <Stack gap="md">
                  {result.profileScores!.map((ps) => (
                    <Stack key={ps.key} gap={6}>
                      <Group justify="space-between">
                        <Text fw={500}>{ps.label}</Text>
                        <Badge variant="light" color={ps.color ?? 'blue'}>
                          {Math.round(ps.percentage)}%
                        </Badge>
                      </Group>
                      <Progress
                        value={ps.percentage}
                        color={ps.color ?? 'blue'}
                        size="lg"
                        radius="xl"
                      />
                    </Stack>
                  ))}
                </Stack>
              </>
            ) : (
              <>
                {survey.resultRanges?.length > 0 && (
                  <Group>
                    <Badge size="lg" variant="filled">
                      Score: {result.score}
                    </Badge>
                  </Group>
                )}
                {result.resultLabel && <Title order={2}>{result.resultLabel}</Title>}
                {result.resultDescription ? (
                  <MarkdownContent>{result.resultDescription}</MarkdownContent>
                ) : (
                  <Text c="dimmed">Thank you for completing the survey!</Text>
                )}
              </>
            )}
          </Stack>
        </Paper>

        {survey.defaultResultText && (
          <Paper withBorder p="lg" radius="md">
            <MarkdownContent>{survey.defaultResultText}</MarkdownContent>
          </Paper>
        )}

        {result.ruleMatches && result.ruleMatches.length > 0 && (
          <Stack gap="md">
            {result.ruleMatches.map((match, i) => (
              <Paper key={i} withBorder p="lg" radius="md">
                {match.title && (
                  <Text fw={600} mb={6}>
                    {match.title}
                  </Text>
                )}
                <MarkdownContent>{match.text}</MarkdownContent>
              </Paper>
            ))}
          </Stack>
        )}

        {survey.suggestedSurvey && (
          <Stack gap="xs">
            <Text fw={600} size="sm" c="dimmed" tt="uppercase">
              You might also like
            </Text>
            <Link
              href={`/surveys/${survey.suggestedSurvey.slug}`}
              style={{ textDecoration: 'none' }}
            >
              <Card withBorder p="lg" radius="md">
                <Text fw={600}>{survey.suggestedSurvey.title}</Text>
                {survey.suggestedSurvey.description && (
                  <Text size="sm" c="dimmed" mt={4}>
                    {survey.suggestedSurvey.description}
                  </Text>
                )}
              </Card>
            </Link>
          </Stack>
        )}
      </Stack>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack gap="xl">
        {survey.questions.map((question, i) => (
          <Paper key={question.id} withBorder p="lg" radius="md">
            <Stack gap="md">
              <Text fw={500}>
                {i + 1}. {question.text}
              </Text>

              {question.type === 'multiple_choice' && question.options && (
                <Controller
                  name={`answers.${question.id}`}
                  control={control}
                  rules={{ required: 'Please select an answer' }}
                  render={({ field }) => (
                    <Radio.Group
                      value={(field.value as string) ?? ''}
                      onChange={field.onChange}
                      error={answerErrors?.[question.id]?.message}
                    >
                      <Stack gap="xs" mt="xs">
                        {question.options!.map((opt) => (
                          <Radio key={opt.id} value={opt.id} label={opt.text} />
                        ))}
                      </Stack>
                    </Radio.Group>
                  )}
                />
              )}

              {question.type === 'true_false' && (
                <Controller
                  name={`answers.${question.id}`}
                  control={control}
                  rules={{ required: 'Please select an answer' }}
                  render={({ field }) => (
                    <Radio.Group
                      value={(field.value as string) ?? ''}
                      onChange={field.onChange}
                      error={answerErrors?.[question.id]?.message}
                    >
                      <Stack gap="xs" mt="xs">
                        <Radio value="true" label="True" />
                        <Radio value="false" label="False" />
                      </Stack>
                    </Radio.Group>
                  )}
                />
              )}

              {question.type === 'text' && (
                <Textarea
                  {...register(`answers.${question.id}`)}
                  placeholder="Your answer…"
                  autosize
                  minRows={3}
                />
              )}

              {question.type === 'scale' && (
                <Controller
                  name={`answers.${question.id}`}
                  control={control}
                  render={({ field }) => (
                    <Slider
                      value={field.value as number}
                      onChange={field.onChange}
                      min={question.scaleMin ?? 1}
                      max={question.scaleMax ?? 10}
                      marks={scaleMarks(question.scaleMin ?? 1, question.scaleMax ?? 10)}
                      mb="xl"
                    />
                  )}
                />
              )}
            </Stack>
          </Paper>
        ))}

        <Divider />

        <Stack gap="md">
          <Stack gap={4}>
            <Text fw={600}>Get your results by email</Text>
            <Text size="sm" c="dimmed">
              Optional — your results are shown on screen either way.
            </Text>
          </Stack>
          <TextInput
            {...register('email')}
            type="email"
            placeholder="you@example.com"
            label="Email address"
          />
          {email && (
            <Stack gap="xs">
              <Controller
                name="receiveResults"
                control={control}
                render={({ field }) => (
                  <Checkbox
                    checked={field.value}
                    onChange={(e) => field.onChange(e.currentTarget.checked)}
                    label="Email me my results"
                  />
                )}
              />
              <Controller
                name="marketingOptIn"
                control={control}
                render={({ field }) => (
                  <Checkbox
                    checked={field.value}
                    onChange={(e) => field.onChange(e.currentTarget.checked)}
                    label="I'd like to receive occasional updates from Compass (you can unsubscribe anytime)"
                  />
                )}
              />
            </Stack>
          )}
        </Stack>

        {submitError && (
          <Alert color="red" title="Error">
            {submitError}
          </Alert>
        )}

        <Button type="submit" size="lg" loading={submitting}>
          See my results
        </Button>
      </Stack>
    </form>
  );
}
