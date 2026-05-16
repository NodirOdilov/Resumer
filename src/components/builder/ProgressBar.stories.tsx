import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta = {
  title: 'Builder/ProgressBar',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A progress bar that shows resume completion percentage. The actual component reads from the builder store, so these stories render standalone visual representations of the progress bar at various states.',
      },
    },
  },
};

export default meta;
type Story = StoryObj;

function ProgressBarVisual({ percentage }: { percentage: number }) {
  return (
    <div className="flex items-center gap-3">
      <div className="relative h-2.5 flex-1 overflow-hidden rounded-full bg-gray-200">
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-green-400 to-green-600 transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="min-w-[3rem] text-right text-sm font-medium text-gray-600">
        {percentage}%
      </span>
    </div>
  );
}

export const Empty: Story = {
  render: () => <ProgressBarVisual percentage={0} />,
};

export const Quarter: Story = {
  render: () => <ProgressBarVisual percentage={25} />,
};

export const Half: Story = {
  render: () => <ProgressBarVisual percentage={50} />,
};

export const ThreeQuarters: Story = {
  render: () => <ProgressBarVisual percentage={75} />,
};

export const Complete: Story = {
  render: () => <ProgressBarVisual percentage={100} />,
};

export const AllStates: Story = {
  render: () => (
    <div className="flex flex-col gap-4 max-w-md">
      <ProgressBarVisual percentage={0} />
      <ProgressBarVisual percentage={17} />
      <ProgressBarVisual percentage={33} />
      <ProgressBarVisual percentage={50} />
      <ProgressBarVisual percentage={67} />
      <ProgressBarVisual percentage={83} />
      <ProgressBarVisual percentage={100} />
    </div>
  ),
};
