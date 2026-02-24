import type { Meta, StoryObj } from '@storybook/vue3';
import SalesModal from './SalesModal.vue';

/**
 * **SalesModal** is the root container orchestrating the pricing grid, toggles, and state interactions.
 *
 * ### Responsiveness & Modes
 * - **Full Screen Overlay (Default)**: Takes over the viewport with `fixed inset-0` and a deep `backdrop-blur-3xl`. Scrolls vertically natively on small devices.
 * - **Inline Mode**: Pass `inline: true` to embed the modal natively in a page flow. On desktop sizes, it mathematically transforms scale to mimic 1440px desktop layouts within constrained containers. On mobile viewports under 1024px, the scale lock disables, restoring native fluid `flex-col` stacking!
 */
const meta = {
    title: 'Sales Modal/Full View',
    component: SalesModal,
    tags: ['autodocs'],
    parameters: {
        layout: 'fullscreen',
    },
    render: (args) => ({
        components: { SalesModal },
        setup() {
            return { args };
        },
        template: '<SalesModal v-bind="args" />',
    }),
} satisfies Meta<typeof SalesModal>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The default, takeover-overlay presentation.
 */
export const FullScreen: Story = {
    args: {
        inline: false
    },
};

/**
 * An embedded block implementation.
 */
export const InlineContainer: Story = {
    args: {
        inline: true
    },
    decorators: [
        () => ({
            template: '<div class="p-4 sm:p-12 min-h-screen bg-white flex items-start justify-center"><div class="w-full max-w-5xl"><story /></div></div>',
        }),
    ],
};
