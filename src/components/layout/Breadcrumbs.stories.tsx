import type { Meta, StoryObj } from '@storybook/react';
import { Breadcrumbs } from './Breadcrumbs';

const meta: Meta<typeof Breadcrumbs> = {
  title: 'Layout/Breadcrumbs',
  component: Breadcrumbs,
  parameters: {
    layout: 'padded',
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: '/resume-examples/software-engineer',
      },
    },
  },
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const DeepNesting: Story = {
  parameters: {
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: '/career-advice/resume/how-to/format',
      },
    },
  },
};

export const SingleLevel: Story = {
  parameters: {
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: '/about',
      },
    },
  },
};

export const CustomHomeLabel: Story = {
  args: {
    homeLabel: 'Dashboard',
  },
  parameters: {
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: '/settings/profile',
      },
    },
  },
};

export const RootPath: Story = {
  parameters: {
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: '/',
      },
    },
  },
};
