import type { Meta, StoryObj } from '@storybook/vue3';
import SalesModal from './SalesModal.vue';

const meta: Meta<typeof SalesModal> = {
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
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {},
};
