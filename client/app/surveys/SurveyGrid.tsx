'use client';

import { useState } from 'react';
import { SimpleGrid, Card, Stack, Text, Group, Button, Modal } from '@mantine/core';
import Link from 'next/link';
import type { Survey } from '@/types/survey';

export function SurveyGrid({ surveys }: { surveys: Survey[] }) {
  const [preview, setPreview] = useState<Survey | null>(null);

  return (
    <>
      <SimpleGrid cols={{ base: 1, sm: 2 }}>
        {surveys.map((survey) => (
          <Card key={survey.id} withBorder padding="lg" radius="md" h={200}>
            <Stack gap="sm" h="100%">
              <Text fw={600} size="lg" style={{ flexShrink: 0 }}>
                {survey.title}
              </Text>
              <Text
                size="sm"
                c="dimmed"
                lineClamp={3}
                style={{ flex: 1, overflow: 'hidden' }}
              >
                {survey.description}
              </Text>
              <Group gap="xs" style={{ flexShrink: 0 }}>
                {survey.description && (
                  <Button
                    variant="subtle"
                    size="xs"
                    onClick={() => setPreview(survey)}
                  >
                    More
                  </Button>
                )}
                <Link href={`/surveys/${survey.slug}`} style={{ textDecoration: 'none' }}>
                  <Button variant="light" size="xs">
                    Take Survey
                  </Button>
                </Link>
              </Group>
            </Stack>
          </Card>
        ))}
      </SimpleGrid>

      <Modal
        opened={preview !== null}
        onClose={() => setPreview(null)}
        title={preview?.title}
        size="lg"
        padding="xl"
        styles={{ title: { fontSize: 'var(--mantine-font-size-xl)', fontWeight: 700 } }}
      >
        <Stack gap="xl" mt="xs">
          <Text size="md" style={{ lineHeight: 1.7 }}>{preview?.description}</Text>
          <Link href={`/surveys/${preview?.slug}`} style={{ textDecoration: 'none' }}>
            <Button fullWidth size="md" onClick={() => setPreview(null)}>
              Take Survey
            </Button>
          </Link>
        </Stack>
      </Modal>
    </>
  );
}
