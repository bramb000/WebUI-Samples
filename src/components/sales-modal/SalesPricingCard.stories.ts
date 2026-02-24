import type { Meta, StoryObj } from '@storybook/vue3';
import SalesPricingCard from './SalesPricingCard.vue';

const meta: Meta<typeof SalesPricingCard> = {
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
      <div class="max-w-sm bg-gray-50 p-8 rounded-xl">
        <SalesPricingCard v-bind="args" />
      </div>
    `,
    }),
};

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
