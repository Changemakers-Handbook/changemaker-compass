import { Container, Title, Text, Button, Stack, Group } from '@mantine/core';
import Link from 'next/link';

export default function Home() {
  return (
    <Container size="md" py="xl">
      <Stack gap="xl" align="center" mt="20vh">
        <Title order={1} ta="center" size="3rem">
          Compass
        </Title>
        <Text size="xl" c="dimmed" ta="center" maw={480}>
          Find your direction. Take a survey to discover insights about yourself
          and get personalized results.
        </Text>
        <Group>
          <Link href="/surveys">
            <Button size="lg" radius="md">
              Browse Surveys
            </Button>
          </Link>
        </Group>
      </Stack>
    </Container>
  );
}
