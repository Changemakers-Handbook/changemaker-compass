import { Container, Title, Text, SimpleGrid, Card, Button, Stack } from '@mantine/core';
import Link from 'next/link';
import { getPublishedSurveys } from '@/lib/payload';

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
          <SimpleGrid cols={{ base: 1, sm: 2 }}>
            {surveys.map((survey) => (
              <Card key={survey.id} withBorder padding="lg" radius="md">
                <Stack gap="sm" style={{ height: '100%' }}>
                  <Text fw={600} size="lg">{survey.title}</Text>
                  {survey.description && (
                    <Text size="sm" c="dimmed" style={{ flex: 1 }}>
                      {survey.description}
                    </Text>
                  )}
                  <Link href={`/surveys/${survey.slug}`} style={{ textDecoration: 'none' }}>
                    <Button variant="light" size="sm" mt="xs">
                      Take survey
                    </Button>
                  </Link>
                </Stack>
              </Card>
            ))}
          </SimpleGrid>
        )}
      </Stack>
    </Container>
  );
}
