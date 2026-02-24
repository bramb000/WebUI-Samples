import type { Meta, StoryObj } from '@storybook/vue3';
import SalesBadge from './SalesBadge.vue';

/**
 * **SalesBadge** is a polished, glassmorphic insight container used to highlight key metrics or recommendations inside the Pricing Cards.
 *
 * ### Animations & Interactions
 * - Uses a premium frosted glass effect (`backdrop-blur-md` with `bg-gradient-to-br`).
 * - Features a sweeping light flare (`before:absolute`) that sweeps across the badge on hover.
 * - The icon container scales up and rotates (`scale-110 rotate-3`) on layout hover for micro-interaction delight.
 * - The border utilizes dynamic opacity and inset shadows to simulate a physical glass tile reflecting ambient light.
 */
const meta = {
    title: 'Sales Modal/Atomic/Insight Badge',
    component: SalesBadge,
    tags: ['autodocs'],
    argTypes: {
        variant: {
            control: 'select',
            options: ['success', 'warning', 'info'],
            description: 'The semantic color theme of the badge icon and text highlights.',
        },
        icon: {
            control: 'select',
            options: ['lightbulb', 'info', 'none'],
            description: 'The Lucide icon rendered inside the glass circle.',
        },
    },
    // The sales modal context is inherently dark. Ensure the atomic badge is visible by wrapping it in a dark container.
    decorators: [
        () => ({
            template: '<div class="bg-[#0b0b12] p-8 rounded-xl"><story /></div>',
        }),
    ],
    render: (args) => ({
        components: { SalesBadge },
        setup() {
            return { args };
        },
        template: `
      <div class="max-w-sm">
        <SalesBadge v-bind="args">
          {{ args.default }}
        </SalesBadge>
      </div>
    `,
    }),
} satisfies Meta<typeof SalesBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The **Success** variant is used for positive projections, like estimated savings or feature recommendations.
 */
export const SuccessProjection: Story = {
    args: {
        variant: 'success',
        icon: 'lightbulb',
        default: 'You completed 2000 actions in 23 days last month. We project you may need 2900 actions per month based on your workflows.',
    },
};

/**
 * The **Warning** variant is used for social proof or critical limits, leaning on attention-grabbing amber tones.
 */
export const WarningSocialProof: Story = {
    args: {
        variant: 'warning',
        icon: 'lightbulb',
        default: '5 teammates (including Omar, Jack, and Asha) are using this product with @yourcompany emails. This plan could be $79 / month / person for your team.',
    },
};
