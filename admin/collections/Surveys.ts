import type { CollectionConfig } from 'payload';

export const Surveys: CollectionConfig = {
  slug: 'surveys',
  versions: {
    maxPerDoc: 50,
  },
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
      name: 'profiles',
      type: 'array',
      label: 'Profiles / Dimensions',
      admin: {
        description: 'Define the dimensions users score towards (e.g. Red, Blue, Yellow). Only used when Scoring Mode is set to "Profile".',
        condition: (data) => data?.scoringMode === 'profile',
      },
      fields: [
        {
          name: 'key',
          type: 'text',
          required: true,
          label: 'Profile Key',
          admin: {
            description: 'Short internal identifier, e.g. "red". Used to link answer choices to this profile.',
          },
        },
        {
          name: 'label',
          type: 'text',
          required: true,
          label: 'Profile Label',
          admin: {
            description: 'Display name shown to users, e.g. "Red"',
          },
        },
        {
          name: 'color',
          type: 'text',
          label: 'Color',
          admin: {
            description: 'Optional CSS color for the progress bar, e.g. "#e74c3c" or "red"',
          },
        },
      ],
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
            { label: 'True / False', value: 'true_false' },
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
                description: 'Points this choice contributes (to the total score, or to its profile if Profile scoring is used)',
              },
            },
            {
              name: 'profile',
              type: 'text',
              label: 'Profile',
              admin: {
                description: 'Profile key this choice accrues points to, e.g. "red". Must match a key defined in Profiles above.',
                condition: (data) => data?.scoringMode === 'profile',
              },
            },
          ],
        },
        {
          name: 'trueValue',
          type: 'number',
          defaultValue: 1,
          label: '"True" Score Value',
          admin: {
            description: 'Points added when the user answers True',
            condition: (_data, siblingData) => siblingData?.type === 'true_false',
          },
        },
        {
          name: 'falseValue',
          type: 'number',
          defaultValue: 0,
          label: '"False" Score Value',
          admin: {
            description: 'Points added when the user answers False',
            condition: (_data, siblingData) => siblingData?.type === 'true_false',
          },
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
        description: 'Optional: map a total score range to a label and description shown after submission. Works in both scoring modes.',
        condition: (data) => data?.scoringMode !== 'profile',
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
            description: 'Longer explanation shown to the user. Supports Markdown: **bold**, *italic*, # headings, - bullet lists, [links](url).',
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
      name: 'defaultResultText',
      type: 'textarea',
      label: 'Default Result Text',
      admin: {
        description: 'Always shown on the results screen for every respondent. Supports Markdown: **bold**, *italic*, # headings, - bullet lists, [links](url).',
      },
    },
    {
      name: 'resultRules',
      type: 'blocks',
      label: 'Result Rules',
      admin: {
        description:
          'Conditional text shown on the results screen. Each rule can have multiple conditions — all must be true for the text to appear. For OR logic, create separate rules. Rules are evaluated in order.',
      },
      blocks: [
        {
          slug: 'result-rule',
          labels: { singular: 'Rule', plural: 'Rules' },
          fields: [
            {
              name: 'title',
              type: 'text',
              label: 'Section heading (optional)',
              admin: {
                description: 'Optional heading shown above the text, e.g. "Your Red Profile"',
              },
            },
            {
              name: 'conditions',
              type: 'array',
              label: 'Conditions (all must be true)',
              minRows: 1,
              admin: {
                description:
                  'Every condition in this list must be met for the text to appear. For OR logic, create a separate rule.',
              },
              fields: [
                {
                  name: 'profile',
                  type: 'text',
                  label: 'Profile key',
                  admin: {
                    description:
                      'Which profile to check, e.g. "red". Leave blank for total-score conditions.',
                    condition: (_data, siblingData) =>
                      siblingData?.operator !== 'total_above' &&
                      siblingData?.operator !== 'total_below',
                  },
                },
                {
                  name: 'operator',
                  type: 'select',
                  required: true,
                  label: 'Condition',
                  options: [
                    { label: 'Has more than X points', value: 'profile_score_above' },
                    { label: 'Has fewer than X points', value: 'profile_score_below' },
                    { label: 'Makes up more than X% of the total', value: 'profile_pct_above' },
                    { label: 'Makes up less than X% of the total', value: 'profile_pct_below' },
                    { label: 'Is the highest-scoring profile', value: 'is_highest' },
                    { label: 'Total score is above X', value: 'total_above' },
                    { label: 'Total score is below X', value: 'total_below' },
                  ],
                },
                {
                  name: 'threshold',
                  type: 'number',
                  label: 'X (threshold value)',
                  admin: {
                    description: 'The number to compare against.',
                    condition: (_data, siblingData) => siblingData?.operator !== 'is_highest',
                  },
                },
              ],
            },
            {
              name: 'text',
              type: 'textarea',
              required: true,
              label: 'Text to display',
              admin: {
                description:
                  'Shown on the results screen when all conditions above are met. Supports Markdown: **bold**, *italic*, # headings, - bullet lists, [links](url).',
              },
            },
          ],
        },
      ],
    },
    {
      name: 'suggestedSurvey',
      type: 'relationship',
      relationTo: 'surveys',
      required: false,
      label: 'Suggested Follow-up Survey',
      admin: {
        description: 'Shown as a "you might also like" card at the bottom of the results screen',
        position: 'sidebar',
      },
    },
    {
      name: 'scoringMode',
      type: 'select',
      defaultValue: 'numeric',
      required: true,
      label: 'Scoring Mode',
      options: [
        { label: 'Numeric Score', value: 'numeric' },
        { label: 'Profile / Dimensions', value: 'profile' },
      ],
      admin: {
        position: 'sidebar',
        description: 'Numeric: single total score mapped to a result range. Profile: answers accrue points to named dimensions (e.g. Red / Blue / Yellow) and users see a percentage breakdown.',
      },
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
