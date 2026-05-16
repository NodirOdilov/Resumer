import type { Meta, StoryObj } from '@storybook/react';
import { LoginForm } from './LoginForm';
import { useAuthStore } from '@/stores/authStore';
import { useEffect } from 'react';

function ResetAuthStore({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    useAuthStore.setState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
  }, []);
  return <>{children}</>;
}

const meta: Meta<typeof LoginForm> = {
  title: 'Forms/LoginForm',
  component: LoginForm,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <ResetAuthStore>
        <div className="w-96 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-6 text-2xl font-bold text-gray-900">Sign in</h2>
          <Story />
        </div>
      </ResetAuthStore>
    ),
  ],
};
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
