import type { Meta, StoryObj } from '@storybook/vue3-vite';
import VoiceChatComponent from './VoiceChatComponent.vue';

const meta = {
    title: 'Portfolio / Voice Chat / Orb',
    component: VoiceChatComponent,
    argTypes: {
        forceState: {
            control: 'select',
            options: ['idle', 'idle_hint', 'listening', 'processing', 'speaking', 'navigating', 'cooking', 'booking', 'confused'],
            description: 'Forces the internal canvas physics engine into a specific mocked conversational state.',
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: 'idle' },
            },
        }
    },
    parameters: {
        layout: 'fullscreen',
    },
    decorators: [
        (story, context) => ({
            components: { story },
            setup() {
                // We default to dark mode simulation for optimal glowing canvas visibility
                return { args: context.args };
            },
            template: `
                <div 
                    class="w-full flex items-center justify-center min-h-[600px] relative transition-colors duration-500 bg-[#1e2024] text-[#E6E9EF]"
                    style="--neo-bg: #1e2024; --neo-text: #E6E9EF; --neo-shadow-light: #2a2d33; --neo-shadow-dark: #121417;"
                >
                    <story v-bind="args" />
                </div>
            `,
        }),
    ],
} satisfies Meta<any>;

export default meta;
type Story = StoryObj<any>;

export const Idle: Story = {
    args: { forceState: 'idle' }
};

export const IdleHintTapping: Story = {
    args: { forceState: 'idle_hint' }
};

export const Listening: Story = {
    args: { forceState: 'listening' }
};

export const Processing: Story = {
    args: { forceState: 'processing' },
    parameters: { docs: { description: { story: 'Simulates the swirling loading state before an intent is resolved.' } } }
};

export const Speaking: Story = {
    args: { forceState: 'speaking' },
    parameters: { docs: { description: { story: 'Pulsing cyan expansion that mimics a vocal output sequence.' } } }
};

export const RouteNavigating: Story = {
    args: { forceState: 'navigating' },
    parameters: { docs: { description: { story: 'Successfully resolved intent: the stars morph into a Car SVG.' } } }
};

export const RouteCooking: Story = {
    args: { forceState: 'cooking' },
    parameters: { docs: { description: { story: 'Successfully resolved intent: the stars morph into a Chef Hat SVG.' } } }
};

export const RouteBooking: Story = {
    args: { forceState: 'booking' },
    parameters: { docs: { description: { story: 'Successfully resolved intent: the stars morph into an Aeroplane SVG.' } } }
};

export const RouteConfused: Story = {
    args: { forceState: 'confused' },
    parameters: { docs: { description: { story: 'Fallback intent: the stars morph into a Question Mark SVG when the speech query is unrecognised.' } } }
};
