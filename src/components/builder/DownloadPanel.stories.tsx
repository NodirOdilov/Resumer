import type { Meta, StoryObj } from '@storybook/react';
import { DownloadPanel } from './DownloadPanel';
import { useBuilderStore } from '@/stores/builderStore';
import { useAuthStore } from '@/stores/authStore';
import { useEffect } from 'react';

function WithFreeUser({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    useBuilderStore.setState({
      template: { id: '1', name: 'Modern', slug: 'modern', category: 'modern', thumbnail_url: '', preview_url: '', is_premium: false, colors: [], description: '' },
    });
    useAuthStore.setState({ user: null, isAuthenticated: false });
  }, []);
  return <>{children}</>;
}

function WithPremiumUser({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    useBuilderStore.setState({
      template: { id: '2', name: 'Executive', slug: 'executive', category: 'professional', thumbnail_url: '', preview_url: '', is_premium: true, colors: [], description: '' },
    });
    useAuthStore.setState({
      user: { id: '1', email: 'user@example.com', first_name: 'Jane', last_name: 'Doe' } as any,
      isAuthenticated: true,
    });
  }, []);
  return <>{children}</>;
}

const meta: Meta<typeof DownloadPanel> = {
  title: 'Builder/DownloadPanel',
  component: DownloadPanel,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof meta>;

export const FreeUserWithPaywall: Story = {
  decorators: [
    (Story) => (
      <WithFreeUser>
        <Story />
      </WithFreeUser>
    ),
  ],
};

export const PremiumUser: Story = {
  decorators: [
    (Story) => (
      <WithPremiumUser>
        <Story />
      </WithPremiumUser>
    ),
  ],
};

export const NoTemplate: Story = {
  decorators: [
    (Story) => {
      useEffect(() => {
        useBuilderStore.setState({ template: null });
      }, []);
      return <Story />;
    },
  ],
};
