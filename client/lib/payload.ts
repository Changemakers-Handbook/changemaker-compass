import type { Survey } from '@/types/survey';

const PAYLOAD_API_URL = process.env.PAYLOAD_API_URL ?? 'http://localhost:3001';

export async function getPublishedSurveys(): Promise<Survey[]> {
  const res = await fetch(
    `${PAYLOAD_API_URL}/api/surveys?where[published][equals]=true&depth=0&limit=100`,
    { next: { revalidate: 60 } },
  );
  if (!res.ok) return [];
  const data = (await res.json()) as { docs: Survey[] };
  return data.docs;
}

export async function getSurveyBySlug(slug: string): Promise<Survey | null> {
  const res = await fetch(
    `${PAYLOAD_API_URL}/api/surveys?where[slug][equals]=${encodeURIComponent(slug)}&where[published][equals]=true&depth=1&limit=1`,
    { next: { revalidate: 60 } },
  );
  if (!res.ok) return null;
  const data = (await res.json()) as { docs: Survey[] };
  return data.docs[0] ?? null;
}
