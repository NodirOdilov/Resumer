import type { Meta, StoryObj } from '@storybook/react';
import { LanguageSwitcher } from './LanguageSwitcher';

const meta: Meta<typeof LanguageSwitcher> = {
  title: 'Layout/LanguageSwitcher',
  component: LanguageSwitcher,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    currentLanguage: 'en-us',
  },
};

export const German: Story = {
  args: {
    currentLanguage: 'de',
  },
};

export const French: Story = {
  args: {
    currentLanguage: 'fr',
  },
};

export const Uzbek: Story = {
  args: {
    currentLanguage: 'uz',
  },
};

export const WithChangeHandler: Story = {
  args: {
    currentLanguage: 'en-us',
    onLanguageChange: (code: string) => {
      console.log('Language changed to:', code);
    },
  },
};
