import type { Meta, StoryObj } from '@storybook/vue3';
import SalesToggle from './SalesToggle.vue';

/**
 * **SalesToggle** is a segmented control specifically designed for switching between Monthly and Annual billing.
 *
 * ### Animations & Interactions
 * - Features a smooth `duration-300` translation animation when the pill slides between states.
 * - The active state button transitions text colors from `slate-400` to pure `white` instantly to signify active focus.
 * - A high-contrast "15% OFF" badge is permanently anchored next to the "Annual" label to drive conversion.
 * - The entire component sits inside a glassmorphic well (`bg-white/5` with `shadow-inner`).
 */
const meta = {
    title: 'Sales Modal/Atomic/Billing Toggle',
    component: SalesToggle,
    tags: ['autodocs'],
    argTypes: {
        modelValue: {
            control: 'radio',
            options: ['monthly', 'annual'],
            description: 'The active billing cycle state.',
        },
    },
    // The toggle is designed strictly for a dark context in the Sales Modal.
    // Wrap it in a padded dark background so it is visually comprehensible in isolation.
    decorators: [
        () => ({
            template: '<div class="bg-[#0b0b12] p-12 rounded-xl flex items-center justify-center border border-white/10"><story /></div>',
        }),
    ],
    render: (args) => ({
        components: { SalesToggle },
        setup() {
            return { args };
        },
        template: '<SalesToggle v-bind="args" />',
    }),
} satisfies Meta<typeof SalesToggle>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Standard toggle interaction highlighting the Annual (default) state.
 */
export const AnnualSelected: Story = {
    args: {
        modelValue: 'annual',
    },
};

/**
 * Monthly state behavior.
 */
export const MonthlySelected: Story = {
    args: {
        modelValue: 'monthly',
    },
};
