import type { Meta, StoryObj } from '@storybook/react';
import { ExpertTip } from './ExpertTip';

const meta: Meta<typeof ExpertTip> = {
  title: 'Builder/ExpertTip',
  component: ExpertTip,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ExpertTip>;

export const Default: Story = {
  args: {
    tip: 'Use action verbs to start each bullet point in your experience section. Words like "Led," "Developed," and "Implemented" make a stronger impression.',
  },
};

export const Short: Story = {
  args: {
    tip: 'Keep your resume to one page if possible.',
  },
};

export const Long: Story = {
  args: {
    tip: 'When describing your work experience, focus on quantifiable achievements rather than listing job duties. For example, instead of "Responsible for managing a team," write "Led a team of 12 engineers, delivering 3 major product releases on time and 15% under budget." Numbers and metrics give recruiters concrete evidence of your impact and help your resume stand out from other candidates.',
  },
};

export const SkillsTip: Story = {
  args: {
    tip: 'Tailor your skills section to match the job description. Include both hard skills (programming languages, tools) and soft skills (leadership, communication) relevant to the role.',
  },
};

export const SummaryTip: Story = {
  args: {
    tip: 'Your professional summary should be 2-3 sentences that highlight your years of experience, key expertise, and what value you bring to a potential employer.',
  },
};

export const MultipleTips: Story = {
  render: () => (
    <div className="flex flex-col gap-3 max-w-lg">
      <ExpertTip tip="Use a professional email address, ideally firstname.lastname@provider.com." />
      <ExpertTip tip="Include your LinkedIn profile URL in your contact information." />
      <ExpertTip tip="Proofread your resume carefully. Even small typos can make a negative impression." />
    </div>
  ),
};
