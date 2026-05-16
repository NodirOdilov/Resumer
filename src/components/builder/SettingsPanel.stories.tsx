import type { Meta, StoryObj } from '@storybook/react';
import { SettingsPanel } from './SettingsPanel';
import { useBuilderStore } from '@/stores/builderStore';
import { useEffect } from 'react';

function WithStoreDefaults({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    useBuilderStore.setState({
      settings: {
        color: '#0D47A1',
        font: 'Roboto',
        fontSize: 11,
        lineSpacing: 1.5,
        margins: { top: 24, right: 24, bottom: 24, left: 24 },
      },
    });
  }, []);
  return <>{children}</>;
}

const meta: Meta<typeof SettingsPanel> = {
  title: 'Builder/SettingsPanel',
  component: SettingsPanel,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <WithStoreDefaults>
        <Story />
      </WithStoreDefaults>
    ),
  ],
};
export default meta;
type Story = StoryObj<typeof meta>;

export const Open: Story = {
  args: {
    open: true,
    onClose: () => {},
  },
};

export const Closed: Story = {
  args: {
    open: false,
    onClose: () => {},
  },
};

export const WithCustomColor: Story = {
  args: {
    open: true,
    onClose: () => {},
  },
  decorators: [
    (Story) => {
      useEffect(() => {
        useBuilderStore.setState({
          settings: {
            color: '#B71C1C',
            font: 'Montserrat',
            fontSize: 12,
            lineSpacing: 1.8,
            margins: { top: 32, right: 32, bottom: 32, left: 32 },
          },
        });
      }, []);
      return <Story />;
    },
  ],
};

export const NarrowMargins: Story = {
  args: {
    open: true,
    onClose: () => {},
  },
  decorators: [
    (Story) => {
      useEffect(() => {
        useBuilderStore.setState({
          settings: {
            color: '#0D47A1',
            font: 'Roboto',
            fontSize: 10,
            lineSpacing: 1.0,
            margins: { top: 16, right: 16, bottom: 16, left: 16 },
          },
        });
      }, []);
      return <Story />;
    },
  ],
};
