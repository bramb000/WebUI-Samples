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
 * The component supports **light** and **dark** colour themes via the `theme` prop.
 */
const meta = {
    title: 'Login Micro Interaction/LoginAvatar',
    component: LoginAvatar,
    argTypes: {
        theme: {
            control: 'inline-radio',
            options: ['light', 'dark'],
            description: 'Colour theme for the card.',
            table: {
                type: { summary: "'light' | 'dark'" },
                defaultValue: { summary: 'light' },
            },
        },
    },
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component:
                    'A login form with a Lottie-animated avatar that tracks email input ' +
                    'and reacts to password focus with an eye-close/squint animation. ' +
                    'Supports accessible light and dark colour themes.',
            },
        },
    },
} satisfies Meta<typeof LoginAvatar>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The login card in **light mode** — the default appearance.
 * Interact with the email and password fields to see the avatar react.
 */
export const LightMode: Story = {
    args: {
        theme: 'light',
    },
};

/**
 * The login card in **dark mode** — an accessible dark colour scheme.
 * All text/background pairings meet WCAG 2.1 AA contrast ratios.
 */
export const DarkMode: Story = {
    args: {
        theme: 'dark',
    },
    parameters: {
        backgrounds: {
            default: 'dark',
            values: [
                { name: 'dark', value: '#121212' },
            ],
        },
    },
};
