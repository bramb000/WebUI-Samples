import type { Meta, StoryObj } from '@storybook/vue3'
import ExamplesModal from './ExamplesModal.vue'

const meta: Meta<typeof ExamplesModal> = {
    title: 'Node Graph/Components/Contextual Help (ExamplesModal)',
    component: ExamplesModal,
    tags: ['autodocs'],
    argTypes: {
        theme: {
            control: 'select',
            options: ['light', 'dark'],
        },
        onClose: { action: 'close' },
    },
    args: {
        theme: 'light',
    },
}

export default meta
type Story = StoryObj<typeof ExamplesModal>

// Mock Data
const mockData = {
    title: 'Add Node',
    subtitle: 'Performs addition',
    notes: [
        'Connect two number inputs to the left side pins.',
        'The result will be output on the right side.',
        'Execution flows from left to right via the arrow pins.',
    ],
}

export const LightTheme: Story = {
    args: {
        data: mockData,
        theme: 'light',
    },
}

export const DarkTheme: Story = {
    args: {
        data: mockData,
        theme: 'dark',
    },
    parameters: {
        backgrounds: { default: 'dark' },
    },
}
