import type { Meta, StoryObj } from '@storybook/vue3';
import SalesPricingCard from './SalesPricingCard.vue';

/**
 * **SalesPricingCard** is the complete composition of badges, buttons, and feature lists representing a single tier in the grid.
 *
 * ### Animations & Layout Physics
 * - **Rolling Numbers**: The integers for `price` and `badgeBaseCost` do not snap instantly. When the component mounts, a native `requestAnimationFrame` loop mathematically lerps the numbers from 0 to the target value using an `easeOutExpo` curve over 1.5 seconds.
 * - **Card Topology**: The card uses a rigid `112px` height boundary on the price header container. This completely isolates dynamic element heights from pushing the Actions Buttons out of sync, guaranteeing that all CTA buttons align perfectly on the same Y-axis regardless of how much text is in the price block.
 * - **Visual Design**: Uses a subtle inner-ring inset on the dark background (`bg-[#0b0b12] ring-white/10`) which glows Indigo when mathematically selected via the `buttonVariant="selected"` prop.
 */
const meta = {
    title: 'Sales Modal/Pricing Card',
    component: SalesPricingCard,
    tags: ['autodocs'],
    argTypes: {
        title: { control: 'text' },
        subtitle: { control: 'text' },
        price: { control: 'number' },
        buttonVariant: {
            control: 'select',
            options: ['primary', 'outline', 'selected'],
        },
        badgeType: {
            control: 'select',
            options: ['success', 'warning', 'info', 'none'],
        },
    },
    render: (args) => ({
        components: { SalesPricingCard },
        setup() {
            return { args };
        },
        template: `
      <div class="max-w-sm bg-[#0b0b12] p-8 rounded-xl border border-white/5">
        <SalesPricingCard v-bind="args" />
      </div>
    `,
    }),
} satisfies Meta<typeof SalesPricingCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ProPlan: Story = {
    args: {
        title: 'Pro Plan',
        subtitle: 'To automate hours of day-to-day work',
        price: 29,
        billingSubtext: 'Billed per month on the 18th.\n18th of February 2026 will be your start date',
        buttonText: 'Upgrade',
        buttonVariant: 'primary',
        badgeType: 'success',
        badgePrefix: 'You completed 2000 actions in 23 days last month. We project you may need 2900 actions per month based on your workflows.',
        headerImageClass: 'bg-[url(https://placehold.co/400x150/e2e8f0/64748b?text=Helmet)] bg-cover bg-center',
        features: [
            { name: 'Everything in Free' },
            { name: '3,000 actions / month total' },
            { name: 'Privileged support' },
            { name: 'Bring your own LLM & compute' },
            { name: '10,000 credits (+9000)', tooltip: 'Bonus credits for being a pro user.', isHighlighted: true }
        ]
    },
};

export const FreePlanSelected: Story = {
    args: {
        title: 'Free Plan',
        subtitle: 'Get started and explore the power of AI agents',
        price: 0,
        billingSubtext: 'Billed per month on the 18th.\n18th of February 2026 will be your start date',
        buttonText: 'Selected',
        buttonVariant: 'selected',
        headerImageClass: 'bg-[url(https://placehold.co/400x150/e2e8f0/64748b?text=Workshop)] bg-cover bg-center',
        features: [
            { name: '200 actions / month' },
            { name: '1,000 credits' },
            { name: 'Unlimited agents' },
            { name: 'Chat mode' },
            { name: 'Community forum' },
            { name: 'Multi-agent workforce', tooltip: 'Assign tasks to multiple specialized agents working together.' }
        ]
    },
};
