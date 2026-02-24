import type { Meta, StoryObj } from '@storybook/vue3';
import SalesToggle from './SalesToggle.vue';

const meta: Meta<typeof SalesToggle> = {
    title: 'Sales Modal/Atomic/Toggle',
    component: SalesToggle,
    tags: ['autodocs'],
    argTypes: {
        modelValue: {
            control: 'radio',
            options: ['monthly', 'annual'],
        },
    },
    render: (args) => ({
        components: { SalesToggle },
        setup() {
            return { args };
        },
        template: '<SalesToggle v-bind="args" />',
    }),
};

export default meta;
type Story = StoryObj<typeof meta>;

export const AnnualSelected: Story = {
    args: {
        modelValue: 'annual',
    },
};

export const MonthlySelected: Story = {
    args: {
        modelValue: 'monthly',
    },
};
