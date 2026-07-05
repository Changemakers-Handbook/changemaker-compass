'use client';

import { useState, useEffect } from 'react';
import { Group, Text, ActionIcon, Anchor } from '@mantine/core';
import { IconX } from '@tabler/icons-react';

const STORAGE_KEY = 'banner-handguide-dismissed';

export function AnnouncementBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (localStorage.getItem(STORAGE_KEY) !== 'true') {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setVisible(true);
    }
  }, []);

  const dismiss = () => {
    localStorage.setItem(STORAGE_KEY, 'true');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      style={{
        background: 'var(--mantine-color-blue-6)',
        color: 'white',
        padding: '10px 16px',
      }}
    >
      <Group justify="center" gap="xs" wrap="nowrap">
        <Text size="sm" ta="center" style={{ color: 'white' }}>
          Check out the Changemaker&apos;s handguide at{' '}
          <Anchor href="#" style={{ color: 'white', fontWeight: 600 }}>
            [link coming soon]
          </Anchor>
        </Text>
        <ActionIcon
          variant="transparent"
          size="sm"
          aria-label="Dismiss"
          onClick={dismiss}
          style={{ color: 'white', flexShrink: 0 }}
        >
          <IconX size={16} />
        </ActionIcon>
      </Group>
    </div>
  );
}
