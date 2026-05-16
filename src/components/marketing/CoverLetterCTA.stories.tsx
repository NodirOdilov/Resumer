import type { Meta, StoryObj } from '@storybook/react';
import { CoverLetterCTA } from './CoverLetterCTA';

const meta: Meta<typeof CoverLetterCTA> = {
  title: 'Marketing/CoverLetterCTA',
  component: CoverLetterCTA,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
