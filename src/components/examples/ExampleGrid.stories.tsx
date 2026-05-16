import type { Meta, StoryObj } from '@storybook/react';
import { ExampleGrid } from './ExampleGrid';
import type { ExampleItem } from './ExampleGrid';

const sampleExamples: ExampleItem[] = [
  { title: 'Software Engineer Resume', slug: 'software-engineer', category: 'technology', experienceLevel: 'mid-level' },
  { title: 'Marketing Manager Resume', slug: 'marketing-manager', category: 'marketing', experienceLevel: 'senior' },
  { title: 'Graphic Designer Resume', slug: 'graphic-designer', category: 'creative', experienceLevel: 'mid-level' },
  { title: 'Data Analyst Resume', slug: 'data-analyst', category: 'technology', experienceLevel: 'entry-level' },
  { title: 'Project Manager Resume', slug: 'project-manager', category: 'management', experienceLevel: 'senior' },
  { title: 'Nurse Resume', slug: 'nurse', category: 'healthcare', experienceLevel: 'mid-level' },
  { title: 'Teacher Resume', slug: 'teacher', category: 'education', experienceLevel: 'mid-level' },
  { title: 'Sales Representative Resume', slug: 'sales-representative', category: 'sales', experienceLevel: 'entry-level' },
  { title: 'Accountant Resume', slug: 'accountant', category: 'finance', experienceLevel: 'senior' },
];

const meta: Meta<typeof ExampleGrid> = {
  title: 'Examples/ExampleGrid',
  component: ExampleGrid,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="mx-auto max-w-[1400px] p-8">
        <Story />
      </div>
    ),
  ],
};
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    examples: sampleExamples,
    basePath: '/resume-examples',
  },
};

export const FewExamples: Story = {
  args: {
    examples: sampleExamples.slice(0, 3),
    basePath: '/resume-examples',
  },
};

export const Empty: Story = {
  args: {
    examples: [],
    basePath: '/resume-examples',
  },
};
