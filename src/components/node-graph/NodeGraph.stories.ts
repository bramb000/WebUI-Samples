import type { Meta, StoryObj } from '@storybook/vue3-vite';
import NodeGraphCanvas from './NodeGraphCanvas.vue';

/**
 * The **NodeGraphCanvas** is a visual programming interface component.
 * It allows users to create, connect, and execute logic nodes.
 *
 * Key features:
 * - **Drag & Drop**: Move nodes and wires freely.
 * - **Execution**: Simulate logic flow with visual feedback.
 * - **Zoom & Pan**: Navigate large graphs easily.
 * - **Theming**: Built-in support for Light and Dark modes.
 */
const meta = {
    title: 'Node Graph/NodeGraphCanvas',
    component: NodeGraphCanvas,
    argTypes: {
        theme: {
            control: 'inline-radio',
            options: ['light', 'dark'],
            description: 'Colour theme for the graph canvas.',
            table: {
                type: { summary: "'light' | 'dark'" },
                defaultValue: { summary: 'light' },
            },
        },
    },
    parameters: {
        layout: 'fullscreen', // Canvas takes full space
        docs: {
            description: {
                component:
                    'A complete node-based visual scripting editor. ' +
                    'Includes drag-and-drop wiring, execution simulation, and accessible keyboard navigation.',
            },
        },
    },
} satisfies Meta<typeof NodeGraphCanvas>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The node graph in **light mode**.
 * Try dragging nodes, connecting pins, and pressing "Play".
 */
export const LightMode: Story = {
    args: {
        theme: 'light',
    },
};

/**
 * The node graph in **dark mode**.
 * Optimized for low-light environments with high-contrast connectors.
 */
export const DarkMode: Story = {
    args: {
        theme: 'dark',
    },
    parameters: {
        backgrounds: {
            default: 'dark',
            values: [
                { name: 'dark', value: '#1e1e1e' },
            ],
        },
    },
};
