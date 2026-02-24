import type { Meta, StoryObj } from '@storybook/vue3';
import SalesBadge from './SalesBadge.vue';

const meta: Meta<typeof SalesBadge> = {
    title: 'Sales Modal/Atomic/Badge',
    component: SalesBadge,
    tags: ['autodocs'],
    argTypes: {
        variant: {
            control: 'select',
            options: ['success', 'warning', 'info'],
        },
        icon: {
            control: 'select',
            options: ['lightbulb', 'info', 'none'],
        },
    },
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
};

export default meta;
type Story = StoryObj<typeof meta>;

export const SuccessProjection: Story = {
    args: {
        variant: 'success',
        icon: 'lightbulb',
        default: 'You completed 2000 actions in 23 days last month. We project you may need 2900 actions per month based on your workflows.',
    },
};

export const WarningSocialProof: Story = {
    args: {
        variant: 'warning',
        icon: 'lightbulb',
        default: '5 teammates (including Omar, Jack, and Asha) are using this product with @yourcompany emails. This plan could be $79 / month / person for your team.',
    },
};
