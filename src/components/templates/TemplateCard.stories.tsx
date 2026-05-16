import type { Meta, StoryObj } from '@storybook/react';
import { TemplateCard } from './TemplateCard';
import type { DocumentTemplate } from '@/types/template';

const baseTemplate: DocumentTemplate = {
  id: '1',
  name: 'Professional',
  slug: 'professional',
  description: 'A clean professional resume template',
  thumbnail: '',
  previewImages: [],
  category: 'professional',
  type: 'resume',
  isPremium: false,
  isFeatured: false,
  isNew: false,
  popularity: 95,
  rating: 4.8,
  reviewCount: 120,
  colorSchemes: [],
  defaultColorScheme: 'default',
  supportedLayouts: ['single'],
  defaultLayout: 'single',
  fontPairings: [],
  defaultFontPairing: 'default',
  tags: ['professional', 'clean'],
  industries: ['technology', 'finance'],
  experienceLevels: ['mid-level', 'senior'],
  createdAt: '2025-01-01',
  updatedAt: '2025-06-01',
};

const meta: Meta<typeof TemplateCard> = {
  title: 'Templates/TemplateCard',
  component: TemplateCard,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="w-[300px]">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof TemplateCard>;

export const Default: Story = {
  args: {
    template: baseTemplate,
  },
};

export const Premium: Story = {
  args: {
    template: {
      ...baseTemplate,
      id: '2',
      name: 'Executive',
      slug: 'executive',
      category: 'executive',
      isPremium: true,
      rating: 4.9,
    },
  },
};

export const New: Story = {
  args: {
    template: {
      ...baseTemplate,
      id: '3',
      name: 'Modern Creative',
      slug: 'modern-creative',
      category: 'creative',
      isNew: true,
      rating: 4.5,
    },
  },
};

export const NewAndPremium: Story = {
  args: {
    template: {
      ...baseTemplate,
      id: '4',
      name: 'Elite',
      slug: 'elite',
      category: 'elegant',
      isNew: true,
      isPremium: true,
      rating: 5.0,
    },
  },
};

export const NoRating: Story = {
  args: {
    template: {
      ...baseTemplate,
      id: '5',
      name: 'Minimal',
      slug: 'minimal',
      category: 'minimalist',
      rating: 0,
    },
  },
};

export const WithThumbnail: Story = {
  args: {
    template: {
      ...baseTemplate,
      id: '6',
      name: 'Modern',
      slug: 'modern',
      category: 'modern',
      thumbnail: 'https://placehold.co/300x400/0D47A1/white?text=Resume',
    },
  },
};

export const CardGrid: Story = {
  decorators: [
    (Story) => (
      <div className="grid grid-cols-3 gap-6 w-full max-w-4xl">
        <Story />
      </div>
    ),
  ],
  render: () => (
    <>
      <TemplateCard template={{ ...baseTemplate, id: '1', name: 'Professional', slug: 'professional' }} />
      <TemplateCard template={{ ...baseTemplate, id: '2', name: 'Modern', slug: 'modern', category: 'modern', isNew: true }} />
      <TemplateCard template={{ ...baseTemplate, id: '3', name: 'Executive', slug: 'executive', category: 'executive', isPremium: true }} />
    </>
  ),
};
