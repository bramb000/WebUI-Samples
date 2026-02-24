import type { Meta, StoryObj } from '@storybook/vue3';
import SalesButton from './SalesButton.vue';

/**
 * **SalesButton** is the core interactive component driving the Sales Modal Call-to-Actions.
 *
 * ### Animations & Polish
 * - **Primary Variant**: Uses heavy glassmorphism (`backdrop-blur-xl`) with a built-in inner glossy gradient (`after:absolute`). On hover, an absolutely positioned flare gradient sweeps across the button (`group-hover:translate-x-full`).
 * - **Spring Physics**: All buttons utilize a tightly tuned spring-like cubic bezier transition (`duration-300 cubic-bezier(0.34, 1.56, 0.64, 1)`) for satisfying `active:scale-[0.97]` clicks.
 */
const meta = {
    title: 'Sales Modal/Atomic/Call to Action',
    component: SalesButton,
    tags: ['autodocs'],
    argTypes: {
        variant: {
            control: 'select',
            options: ['primary', 'secondary', 'outline', 'ghost', 'selected'],
            description: 'The visual style and hierarchical importance of the button.',
        },
        size: {
            control: 'select',
            options: ['sm', 'md', 'lg'],
        },
        fullWidth: {
            control: 'boolean',
            description: 'Forces the button to span 100% of its container width.',
        }
    },
    // The button heavily utilizes white text and transparent white borders/backgrounds.
    // Wrap it in the native modal background color so it is legible.
    decorators: [
        () => ({
            template: '<div class="bg-[#0b0b12] p-12 rounded-xl flex items-center justify-center border border-white/10"><story /></div>',
        }),
    ],
    render: (args) => ({
        components: { SalesButton },
        setup() {
            return { args };
        },
        template: '<SalesButton v-bind="args">{{ args.default }}</SalesButton>',
    }),
} satisfies Meta<typeof SalesButton>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * High-conversion gradient button used for "Upgrade" paths.
 */
export const Primary: Story = {
    args: {
        variant: 'primary',
        default: 'Upgrade Plan',
    },
};

/**
 * Subtle transparent button used for neutral actions.
 */
export const Secondary: Story = {
    args: {
        ...Primary.args,
        variant: 'secondary',
        default: 'Cancel',
    },
};

/**
 * White perimeter border button used for "Contact Us" or alternative choices.
 */
export const Outline: Story = {
    args: {
        ...Primary.args,
        variant: 'outline',
        default: 'Get a quote',
    },
};

/**
 * Highly distinct "Selected" state signaling the currently active tier.
 */
export const Selected: Story = {
    args: {
        ...Primary.args,
        variant: 'selected',
        default: 'Selected',
    },
};

/**
 * Stretches to fill the bounding box.
 */
export const FullWidth: Story = {
    args: {
        ...Primary.args,
        fullWidth: true,
    },
};
