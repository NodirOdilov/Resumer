import type { Meta, StoryObj } from '@storybook/react';
import { MegaMenu } from './MegaMenu';

const meta: Meta<typeof MegaMenu> = {
  title: 'Layout/MegaMenu',
  component: MegaMenu,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="relative pt-4" style={{ minHeight: 500 }}>
        <Story />
      </div>
    ),
  ],
};
export default meta;
type Story = StoryObj<typeof meta>;

export const Resume: Story = {
  args: {
    item: 'Resume',
    onClose: () => {},
  },
};

export const CoverLetter: Story = {
  args: {
    item: 'Cover Letter',
    onClose: () => {},
  },
};

export const CV: Story = {
  args: {
    item: 'CV',
    onClose: () => {},
  },
};

export const JobSearch: Story = {
  args: {
    item: 'Job Search',
    onClose: () => {},
  },
};

export const JobInterviews: Story = {
  args: {
    item: 'Job Interviews',
    onClose: () => {},
  },
};

export const CareerAdvice: Story = {
  args: {
    item: 'Career Advice',
    onClose: () => {},
  },
};

export const About: Story = {
  args: {
    item: 'About',
    onClose: () => {},
  },
};

export const InvalidItem: Story = {
  args: {
    item: 'Nonexistent',
    onClose: () => {},
  },
};
