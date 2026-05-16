import type { Meta, StoryObj } from '@storybook/react';
import { TemplateGrid } from './TemplateGrid';
import type { DocumentTemplate } from '@/types/template';

const sampleTemplates: DocumentTemplate[] = [
  {
    id: '1',
    name: 'Modern Professional',
    slug: 'modern-professional',
    description: 'A clean, modern template for professionals.',
    thumbnail: '',
    previewImages: [],
    category: 'modern',
    type: 'resume',
    isPremium: false,
    isFeatured: true,
    isNew: false,
    popularity: 95,
    rating: 4.8,
    reviewCount: 120,
    colorSchemes: [],
  },
  {
    id: '2',
    name: 'Creative Designer',
    slug: 'creative-designer',
    description: 'Stand out with this creative layout.',
    thumbnail: '',
    previewImages: [],
    category: 'creative',
    type: 'resume',
    isPremium: true,
    isFeatured: false,
    isNew: true,
    popularity: 80,
    rating: 4.5,
    reviewCount: 45,
    colorSchemes: [],
  },
  {
    id: '3',
    name: 'Executive Suite',
    slug: 'executive-suite',
    description: 'A premium template for senior professionals.',
    thumbnail: '',
    previewImages: [],
    category: 'professional',
    type: 'resume',
    isPremium: true,
    isFeatured: true,
    isNew: false,
    popularity: 90,
    rating: 4.9,
    reviewCount: 200,
    colorSchemes: [],
  },
  {
    id: '4',
    name: 'Simple Clean',
    slug: 'simple-clean',
    description: 'Minimalist template that gets the job done.',
    thumbnail: '',
    previewImages: [],
    category: 'simple',
    type: 'resume',
    isPremium: false,
    isFeatured: false,
    isNew: false,
    popularity: 70,
    rating: 4.3,
    reviewCount: 88,
    colorSchemes: [],
  },
] as DocumentTemplate[];

const meta: Meta<typeof TemplateGrid> = {
  title: 'Templates/TemplateGrid',
  component: TemplateGrid,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="mx-auto max-w-[1400px] p-8">
        <Story />
      </div>
    ),
  ],
};
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    templates: sampleTemplates,
  },
};

export const WithBasePath: Story = {
  args: {
    templates: sampleTemplates,
    basePath: '/resume-templates',
  },
};

export const SingleTemplate: Story = {
  args: {
    templates: [sampleTemplates[0]],
  },
};

export const Empty: Story = {
  args: {
    templates: [],
  },
};
