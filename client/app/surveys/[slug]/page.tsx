import { Container, Title, Text, Stack } from '@mantine/core';
import { notFound } from 'next/navigation';
import { getSurveyBySlug } from '@/lib/payload';
import { SurveyForm } from './SurveyForm';

export const revalidate = 60;

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function SurveyPage({ params }: Props) {
  const { slug } = await params;
  const survey = await getSurveyBySlug(slug);

  if (!survey) notFound();

  return (
    <Container size="sm" py="xl">
      <Stack gap="xl">
        <Stack gap="xs">
          <Title>{survey.title}</Title>
          {survey.description && (
            <Text size="lg" c="dimmed">{survey.description}</Text>
          )}
        </Stack>
        <SurveyForm survey={survey} />
      </Stack>
    </Container>
  );
}
