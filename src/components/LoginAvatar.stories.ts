import type { Meta, StoryObj } from '@storybook/vue3-vite';
import LoginAvatar from './LoginAvatar.vue';

/**
 * The **LoginAvatar** component is a playful login form featuring a Lottie-animated
 * avatar that reacts to user input.
 * - When the **email** field is focused, the avatar's head tracks the text length
 *   (looking left → right across frames 3–9).
 * - When the **password** field is focused, the avatar closes and squints its eyes
 *   (frames 11–13).
 * - On **blur**, the avatar smoothly returns to its idle pose (frame 0).
 *
 * The component is fully self-contained with no props or emitted events.
 */
const meta = {
    title: 'Login Micro Interaction/LoginAvatar',
    component: LoginAvatar,
    parameters: {
        layout: 'fullscreen',
        docs: {
            description: {
                component:
                    'A login form with a Lottie-animated avatar that tracks email input ' +
                    'and reacts to password focus with an eye-close/squint animation.',
            },
        },
    },
} satisfies Meta<typeof LoginAvatar>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The default state renders the full login card centred on screen.
 * Interact with the email and password fields to see the avatar react.
 */
export const Default: Story = {};
