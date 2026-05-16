import type { Meta, StoryObj } from '@storybook/react';
import { TestimonialsCarousel } from './TestimonialsCarousel';

const meta: Meta<typeof TestimonialsCarousel> = {
  title: 'Marketing/TestimonialsCarousel',
  component: TestimonialsCarousel,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
