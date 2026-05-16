import type { Meta, StoryObj } from '@storybook/react';
import { ExampleCard } from './ExampleCard';

const meta: Meta<typeof ExampleCard> = {
  title: 'Examples/ExampleCard',
  component: ExampleCard,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="w-72">
        <Story />
      </div>
    ),
  ],
};
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'Software Engineer Resume',
    slug: 'software-engineer',
    category: 'technology',
    experienceLevel: 'mid-level',
    basePath: '/resume-examples',
  },
};

export const WithThumbnail: Story = {
  args: {
    title: 'Marketing Manager Resume',
    slug: 'marketing-manager',
    category: 'marketing',
    experienceLevel: 'senior',
    thumbnail: 'https://placehold.co/300x400/e2e8f0/475569?text=Resume',
    basePath: '/resume-examples',
  },
};

export const EntryLevel: Story = {
  args: {
    title: 'Intern Resume Example',
    slug: 'intern',
    category: 'general',
    experienceLevel: 'entry-level',
    basePath: '/resume-examples',
  },
};

export const Executive: Story = {
  args: {
    title: 'CEO Resume Example',
    slug: 'ceo',
    category: 'executive',
    experienceLevel: 'executive',
    basePath: '/resume-examples',
  },
};
