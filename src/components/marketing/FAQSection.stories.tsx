import type { Meta, StoryObj } from '@storybook/react';
import { FAQSection } from './FAQSection';

const meta: Meta<typeof FAQSection> = {
  title: 'Marketing/FAQSection',
  component: FAQSection,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof FAQSection>;

export const Default: Story = {};

export const CustomTitle: Story = {
  args: {
    title: 'Common Questions About Our Resume Builder',
  },
};

export const CustomItems: Story = {
  args: {
    title: 'Help Center',
    items: [
      {
        question: 'How do I get started?',
        answer: 'Simply click the "Create Your Resume" button and follow the guided steps to build your resume in minutes.',
      },
      {
        question: 'Is it free to use?',
        answer: 'Yes, we offer a free tier with basic templates. Premium features are available with a subscription.',
      },
      {
        question: 'Can I export my resume?',
        answer: 'Absolutely. You can download your resume as a PDF at any time.',
      },
    ],
  },
};

export const SingleItem: Story = {
  args: {
    items: [
      {
        question: 'What formats do you support?',
        answer: 'We support PDF, DOCX, and plain text formats for resume downloads.',
      },
    ],
  },
};

export const Mobile: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};
