import type { Meta, StoryObj } from '@storybook/vue3';
import SalesButton from './SalesButton.vue';

const meta: Meta<typeof SalesButton> = {
    title: 'Sales Modal/Atomic/Button',
    component: SalesButton,
    tags: ['autodocs'],
    argTypes: {
        variant: {
            control: 'select',
            options: ['primary', 'secondary', 'outline', 'ghost', 'selected'],
        },
        size: {
            control: 'select',
            options: ['sm', 'md', 'lg'],
        },
    },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    args: {
        variant: 'primary',
        default: 'Upgrade Plan',
    },
    render: (args) => ({
        components: { SalesButton },
        setup() {
            return { args };
        },
        template: '<SalesButton v-bind="args">{{ args.default }}</SalesButton>',
    }),
};

export const Secondary: Story = {
    args: {
        ...Primary.args,
        variant: 'secondary',
        default: 'Cancel',
    },
    render: Primary.render,
};

export const Outline: Story = {
    args: {
        ...Primary.args,
        variant: 'outline',
        default: 'Get a quote',
    },
    render: Primary.render,
};

export const Selected: Story = {
    args: {
        ...Primary.args,
        variant: 'selected',
        default: 'Selected',
    },
    render: Primary.render,
};

export const FullWidth: Story = {
    args: {
        ...Primary.args,
        fullWidth: true,
    },
    render: Primary.render,
};
