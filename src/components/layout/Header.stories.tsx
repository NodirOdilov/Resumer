import type { Meta, StoryObj } from '@storybook/react';
import { Header } from './Header';

const meta: Meta<typeof Header> = {
  title: 'Layout/Header',
  component: Header,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof Header>;

export const Default: Story = {};

export const Mobile: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};

export const Tablet: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
  },
};

export const WithScrolledState: Story = {
  render: () => (
    <div>
      <Header />
      <div className="h-[2000px] bg-gradient-to-b from-gray-50 to-gray-200 p-8">
        <p className="text-gray-500">Scroll down to see the header shadow appear.</p>
      </div>
    </div>
  ),
};
