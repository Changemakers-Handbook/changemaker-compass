'use client';

import { Group, Text, Anchor, Divider, Container } from '@mantine/core';
import Link from 'next/link';

export function AppFooter() {
  return (
    <footer>
      <Divider />
      <Container size="lg" py="md">
        <Group justify="space-between" align="center">
          <Group gap="lg">
            <Anchor component={Link} href="/about" c="dimmed" size="sm">
              About
            </Anchor>
            <Anchor component={Link} href="/contact" c="dimmed" size="sm">
              Contact
            </Anchor>
          </Group>
          <Text size="sm" c="dimmed">
            &copy; {new Date().getFullYear()} Elena Bondareva
          </Text>
        </Group>
      </Container>
    </footer>
  );
}
