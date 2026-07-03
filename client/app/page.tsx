import {
  Container,
  Title,
  Text,
  Button,
  Stack,
  Group,
  SimpleGrid,
  Card,
  ThemeIcon,
  Divider,
  Box,
} from '@mantine/core';
import {
  IconSparkles,
  IconBulb,
  IconUsers,
  IconArrowRight,
  IconMail,
  IconInfoCircle,
  IconClipboardList,
} from '@tabler/icons-react';
import Link from 'next/link';

const PROFILES = [
  {
    icon: IconSparkles,
    color: 'violet',
    title: 'The Visionary',
    body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Visionaries see the big picture and inspire others toward ambitious futures. They thrive on possibility and push boundaries others consider fixed.',
  },
  {
    icon: IconBulb,
    color: 'yellow',
    title: 'The Catalyst',
    body: 'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Catalysts spark action in the people around them, turning ideas into momentum and energy into results.',
  },
  {
    icon: IconUsers,
    color: 'teal',
    title: 'The Connector',
    body: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris. Connectors build the relationships and coalitions that make lasting change possible in communities and organizations.',
  },
];

const LINKS = [
  { icon: IconClipboardList, label: 'Browse Surveys', href: '/surveys', description: 'Take a survey and discover your changemaker profile.' },
  { icon: IconInfoCircle, label: 'About', href: '/about', description: 'Learn more about the Changemaker\'s Compass project.' },
  { icon: IconMail, label: 'Contact', href: '/contact', description: 'Get in touch with questions or feedback.' },
];

export default function Home() {
  return (
    <Box>
      {/* Hero */}
      <Box
        style={{
          background: 'linear-gradient(135deg, var(--mantine-color-blue-6), var(--mantine-color-violet-6))',
          color: 'white',
          padding: '80px 24px',
        }}
      >
        <Container size="md">
          <Stack gap="lg" align="center">
            <Title order={1} ta="center" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', color: 'white' }}>
              Changemaker&apos;s Compass
            </Title>
            <Text size="xl" ta="center" maw={560} style={{ color: 'rgba(255,255,255,0.85)' }}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Discover your unique changemaker style and find the direction that drives your greatest impact.
            </Text>
            <Group mt="sm">
              <Link href="/surveys">
                <Button size="lg" radius="md" variant="white" color="blue" rightSection={<IconArrowRight size={18} />}>
                  Take a Survey
                </Button>
              </Link>
              <Link href="/about">
                <Button size="lg" radius="md" variant="outline" style={{ color: 'white', borderColor: 'rgba(255,255,255,0.5)' }}>
                  Learn More
                </Button>
              </Link>
            </Group>
          </Stack>
        </Container>
      </Box>

      {/* Core concept */}
      <Container size="md" py={72}>
        <Stack gap="xl">
          <Stack gap="sm" align="center">
            <Text size="sm" fw={600} tt="uppercase" c="blue" style={{ letterSpacing: 1 }}>
              What Is the Compass?
            </Text>
            <Title order={2} ta="center">
              Understand how you create change
            </Title>
            <Text size="lg" c="dimmed" ta="center" maw={600}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
              incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
              exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </Text>
          </Stack>

          <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="lg">
            {[
              { step: '01', heading: 'Take a Survey', body: 'Answer a short series of questions about how you approach challenges, people, and ideas.' },
              { step: '02', heading: 'See Your Profile', body: 'Get a personalised breakdown of your changemaker strengths and tendencies across key dimensions.' },
              { step: '03', heading: 'Find Your Direction', body: 'Use your results to lean into your strengths, understand your blind spots, and collaborate more effectively.' },
            ].map(({ step, heading, body }) => (
              <Stack key={step} gap="xs">
                <Text fw={800} size="xl" c="blue">{step}</Text>
                <Text fw={600} size="md">{heading}</Text>
                <Text size="sm" c="dimmed">{body}</Text>
              </Stack>
            ))}
          </SimpleGrid>
        </Stack>
      </Container>

      <Divider />

      {/* Profiles */}
      <Container size="md" py={72}>
        <Stack gap="xl">
          <Stack gap="sm" align="center">
            <Text size="sm" fw={600} tt="uppercase" c="blue" style={{ letterSpacing: 1 }}>
              Changemaker Profiles
            </Text>
            <Title order={2} ta="center">
              Which one sounds like you?
            </Title>
            <Text size="lg" c="dimmed" ta="center" maw={540}>
              Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat
              nulla pariatur. Most people are a blend — the Compass shows you your unique mix.
            </Text>
          </Stack>

          <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="lg">
            {PROFILES.map(({ icon: Icon, color, title, body }) => (
              <Card key={title} withBorder padding="xl" radius="md">
                <Stack gap="md">
                  <ThemeIcon size={48} radius="md" color={color} variant="light">
                    <Icon size={26} />
                  </ThemeIcon>
                  <Title order={3} size="h4">{title}</Title>
                  <Text size="sm" c="dimmed">{body}</Text>
                </Stack>
              </Card>
            ))}
          </SimpleGrid>

          <Group justify="center">
            <Link href="/surveys">
              <Button variant="light" size="md" rightSection={<IconArrowRight size={16} />}>
                Discover your profile
              </Button>
            </Link>
          </Group>
        </Stack>
      </Container>

      <Divider />

      {/* Links */}
      <Container size="md" py={72}>
        <Stack gap="xl">
          <Stack gap="sm" align="center">
            <Title order={2} ta="center">Explore</Title>
            <Text c="dimmed" ta="center">Everything you need to get started.</Text>
          </Stack>

          <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="lg">
            {LINKS.map(({ icon: Icon, label, href, description }) => (
              <Link key={href} href={href} style={{ textDecoration: 'none', color: 'inherit' }}>
                <Card withBorder padding="lg" radius="md" h="100%">
                  <Stack gap="sm">
                    <ThemeIcon size={40} radius="md" variant="light">
                      <Icon size={22} />
                    </ThemeIcon>
                    <Text fw={600}>{label}</Text>
                    <Text size="sm" c="dimmed">{description}</Text>
                  </Stack>
                </Card>
              </Link>
            ))}
          </SimpleGrid>
        </Stack>
      </Container>
    </Box>
  );
}
