import { Container, Title, Text, Stack } from '@mantine/core';
import { getPublishedSurveys } from '@/lib/payload';
import { SurveyGrid } from './SurveyGrid';

export const revalidate = 60;

export default async function SurveysPage() {
  const surveys = await getPublishedSurveys();

  return (
    <Container size="md" py="xl">
      <Stack gap="lg">
        <Title>Surveys</Title>
        {surveys.length === 0 ? (
          <Text c="dimmed">No surveys are available yet. Check back soon.</Text>
        ) : (
          <SurveyGrid surveys={surveys} />
        )}
      </Stack>
    </Container>
  );
}
