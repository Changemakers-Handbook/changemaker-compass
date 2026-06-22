import type { CollectionConfig } from 'payload';

export const Surveys: CollectionConfig = {
  slug: 'surveys',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'published', 'updatedAt'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Survey Title',
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      label: 'URL Slug',
      admin: {
        description: 'The URL path for this survey, e.g. "career-assessment" → /surveys/career-assessment',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Description',
      admin: {
        description: 'Shown to users before they start the survey',
      },
    },
    {
      name: 'questions',
      type: 'array',
      label: 'Questions',
      minRows: 1,
      fields: [
        {
          name: 'text',
          type: 'text',
          required: true,
          label: 'Question Text',
        },
        {
          name: 'type',
          type: 'select',
          required: true,
          label: 'Question Type',
          options: [
            { label: 'Multiple Choice', value: 'multiple_choice' },
            { label: 'Free Text Answer', value: 'text' },
            { label: 'Number Scale', value: 'scale' },
          ],
        },
        {
          name: 'options',
          type: 'array',
          label: 'Answer Choices',
          admin: {
            description: 'Add each answer choice and the score it contributes',
            condition: (_data, siblingData) => siblingData?.type === 'multiple_choice',
          },
          fields: [
            {
              name: 'text',
              type: 'text',
              required: true,
              label: 'Choice Text',
            },
            {
              name: 'value',
              type: 'number',
              required: true,
              label: 'Score Value',
              admin: {
                description: 'How many points this choice adds to the total score',
              },
            },
          ],
        },
        {
          name: 'scaleMin',
          type: 'number',
          defaultValue: 1,
          label: 'Scale Minimum',
          admin: {
            condition: (_data, siblingData) => siblingData?.type === 'scale',
          },
        },
        {
          name: 'scaleMax',
          type: 'number',
          defaultValue: 10,
          label: 'Scale Maximum',
          admin: {
            condition: (_data, siblingData) => siblingData?.type === 'scale',
          },
        },
      ],
    },
    {
      name: 'resultRanges',
      type: 'array',
      label: 'Score Result Ranges',
      admin: {
        description: 'Map score ranges to a result label and description shown to users after completing the survey',
      },
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
          label: 'Result Label',
          admin: {
            description: 'Short title, e.g. "Creative Visionary"',
          },
        },
        {
          name: 'description',
          type: 'textarea',
          required: true,
          label: 'Result Description',
          admin: {
            description: 'Longer explanation shown to the user',
          },
        },
        {
          name: 'minScore',
          type: 'number',
          required: true,
          label: 'Minimum Score (inclusive)',
        },
        {
          name: 'maxScore',
          type: 'number',
          required: true,
          label: 'Maximum Score (inclusive)',
        },
      ],
    },
    {
      name: 'published',
      type: 'checkbox',
      defaultValue: false,
      label: 'Published',
      admin: {
        description: 'Only published surveys appear on the Compass website',
        position: 'sidebar',
      },
    },
  ],
};
