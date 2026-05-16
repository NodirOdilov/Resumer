import type { Meta, StoryObj } from '@storybook/react';
import { BuilderSidebar } from './BuilderSidebar';
import { useBuilderStore } from '@/stores/builderStore';
import { useEffect } from 'react';

function WithEmptyContent({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    useBuilderStore.setState({
      activeSection: 'contact',
      content: {},
    });
  }, []);
  return <>{children}</>;
}

function WithPartialContent({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    useBuilderStore.setState({
      activeSection: 'experience',
      content: {
        contact: { first_name: 'John', last_name: 'Doe', email: 'john@example.com' },
        summary: 'Experienced software engineer with 5 years of experience.',
        experience: [{ title: 'Software Engineer', company: 'Acme Corp' }],
        education: [],
        skills: ['JavaScript', 'TypeScript', 'React'],
      },
    });
  }, []);
  return <>{children}</>;
}

function WithAllCompleted({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    useBuilderStore.setState({
      activeSection: 'contact',
      content: {
        contact: { first_name: 'Jane', last_name: 'Smith', email: 'jane@example.com' },
        summary: 'Full-stack developer',
        experience: [{ title: 'Lead Developer' }],
        education: [{ degree: 'BS Computer Science' }],
        skills: ['React', 'Node.js'],
        languages: [{ language: 'English', level: 'Native' }],
        certificates: [{ name: 'AWS Certified' }],
        projects: [{ name: 'Open Source Tool' }],
        awards: [{ title: 'Employee of the Year' }],
        volunteer: [{ organization: 'Code.org' }],
        hobbies: ['Reading', 'Hiking'],
        custom_sections: [{ title: 'Publications' }],
      },
    });
  }, []);
  return <>{children}</>;
}

const meta: Meta<typeof BuilderSidebar> = {
  title: 'Builder/BuilderSidebar',
  component: BuilderSidebar,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="w-64 rounded-lg border border-gray-200 bg-white p-3">
        <Story />
      </div>
    ),
  ],
};
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  decorators: [
    (Story) => (
      <WithEmptyContent>
        <Story />
      </WithEmptyContent>
    ),
  ],
};

export const PartiallyCompleted: Story = {
  decorators: [
    (Story) => (
      <WithPartialContent>
        <Story />
      </WithPartialContent>
    ),
  ],
};

export const AllSectionsCompleted: Story = {
  decorators: [
    (Story) => (
      <WithAllCompleted>
        <Story />
      </WithAllCompleted>
    ),
  ],
};
