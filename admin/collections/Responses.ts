import type { CollectionConfig } from 'payload';

export const Responses: CollectionConfig = {
  slug: 'responses',
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'survey', 'score', 'resultLabel', 'createdAt'],
    description: 'Survey responses submitted by users',
  },
  access: {
    create: () => true,
    read: ({ req }) => !!req.user,
    update: ({ req }) => !!req.user,
    delete: ({ req }) => !!req.user,
  },
  fields: [
    {
      name: 'survey',
      type: 'relationship',
      relationTo: 'surveys',
      required: true,
      label: 'Survey',
    },
    {
      name: 'email',
      type: 'email',
      required: true,
      label: 'Respondent Email',
    },
    {
      name: 'answers',
      type: 'json',
      required: true,
      label: 'Raw Answers',
      admin: {
        description: 'Answers keyed by question index',
      },
    },
    {
      name: 'score',
      type: 'number',
      required: true,
      label: 'Total Score',
    },
    {
      name: 'resultLabel',
      type: 'text',
      label: 'Result Label',
      admin: {
        description: 'The result category this score fell into',
      },
    },
  ],
};
