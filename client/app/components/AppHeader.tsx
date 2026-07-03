'use client';

import { useState } from 'react';
import {
  Burger,
  Drawer,
  Stack,
  NavLink,
  Group,
  Text,
  ActionIcon,
  Divider,
  useComputedColorScheme,
  useMantineColorScheme,
} from '@mantine/core';
import { IconLogin, IconUserPlus, IconSun, IconMoon } from '@tabler/icons-react';
import Link from 'next/link';

const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Surveys', href: '/surveys' },
  { label: 'About', href: '/about' },
];

export function AppHeader() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { setColorScheme } = useMantineColorScheme();
  const colorScheme = useComputedColorScheme('light', { getInitialValueInEffect: true });

  const toggleColorScheme = () => {
    const next = colorScheme === 'dark' ? 'light' : 'dark';
    setColorScheme(next);
    document.cookie = `mantine-color-scheme=${next}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;
  };

  return (
    <>
      <header
        style={{
          borderBottom: '1px solid var(--mantine-color-gray-3)',
          padding: '0 24px',
          height: 60,
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Group justify="space-between" align="center" style={{ width: '100%' }}>
          <Burger
            opened={drawerOpen}
            onClick={() => setDrawerOpen(true)}
            size="sm"
            aria-label="Open navigation"
          />

          <Text
            component={Link}
            href="/"
            fw={700}
            size="lg"
            style={{ textDecoration: 'none', color: 'inherit', letterSpacing: '-0.01em' }}
          >
            Changemaker&apos;s Compass
          </Text>

          <ActionIcon
            variant="subtle"
            size="lg"
            radius="xl"
            onClick={toggleColorScheme}
            aria-label="Toggle color scheme"
          >
            {colorScheme === 'dark' ? <IconSun size={20} /> : <IconMoon size={20} />}
          </ActionIcon>
        </Group>
      </header>

      <Drawer
        opened={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={
          <Text fw={600} size="sm">
            Navigation
          </Text>
        }
        size="xs"
        overlayProps={{ opacity: 0.3 }}
      >
        <Divider mb="sm" />
        <Stack gap={4}>
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.href}
              component={Link}
              href={link.href}
              label={link.label}
              onClick={() => setDrawerOpen(false)}
            />
          ))}
        </Stack>

        <Divider my="sm" />
        <Text size="xs" fw={600} c="dimmed" px="sm" mb={4}>
          Account
        </Text>
        <Stack gap={4}>
          <NavLink leftSection={<IconLogin size={16} />} label="Sign in" />
          <NavLink leftSection={<IconUserPlus size={16} />} label="Create account" />
        </Stack>
      </Drawer>
    </>
  );
}
