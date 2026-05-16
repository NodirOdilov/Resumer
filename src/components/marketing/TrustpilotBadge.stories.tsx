import type { Meta, StoryObj } from '@storybook/react';
import { TrustpilotBadge } from './TrustpilotBadge';

const meta: Meta<typeof TrustpilotBadge> = {
  title: 'Marketing/TrustpilotBadge',
  component: TrustpilotBadge,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
