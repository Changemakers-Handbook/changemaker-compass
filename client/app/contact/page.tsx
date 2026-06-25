'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  Container,
  Title,
  TextInput,
  Textarea,
  Button,
  Stack,
  Alert,
  Text,
} from '@mantine/core';
import { IconCircleCheck } from '@tabler/icons-react';

interface ContactFormValues {
  email: string;
  subject: string;
  message: string;
}

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ContactFormValues>();

  const onSubmit = (_data: ContactFormValues) => {
    setSubmitted(true);
  };

  return (
    <Container size="sm" py="xl">
      <Stack gap="lg">
        <Stack gap={4}>
          <Title>Contact</Title>
          <Text c="dimmed">Have a question or feedback? We&apos;d love to hear from you.</Text>
        </Stack>

        {submitted ? (
          <Alert
            icon={<IconCircleCheck size={20} />}
            title="Message received!"
            color="green"
            radius="md"
          >
            Thanks for reaching out. We&apos;ll get back to you as soon as possible.
          </Alert>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack gap="md">
              <TextInput
                label="Your email"
                placeholder="you@example.com"
                type="email"
                required
                {...register('email', { required: 'Email is required' })}
                error={errors.email?.message}
              />
              <TextInput
                label="Subject"
                placeholder="What's on your mind?"
                required
                {...register('subject', { required: 'Subject is required' })}
                error={errors.subject?.message}
              />
              <Textarea
                label="Message"
                placeholder="Your message…"
                required
                autosize
                minRows={5}
                {...register('message', { required: 'Message is required' })}
                error={errors.message?.message}
              />
              <Button type="submit" size="md">
                Send message
              </Button>
            </Stack>
          </form>
        )}
      </Stack>
    </Container>
  );
}
