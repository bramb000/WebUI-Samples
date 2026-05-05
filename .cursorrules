# Cursor Rules for bramha-personal-portfolio

## Project Overview
This project is a personal portfolio with a strong emphasis on interactive, game-like WebGL graphics and modern web aesthetics ("Street-Tech Minimalism", "Cozy Pixel UI"). It heavily features Three.js, custom WebGL shaders, and high-fidelity interactive elements.

## Tech Stack
- **Framework**: Vue 3 (Composition API using `<script setup>`)
- **Build Tool**: Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **3D / Graphics**: Three.js, Custom WebGL Shaders
- **Icons**: lucide-vue-next
- **Animations**: lottie-web
- **Analytics**: PostHog
- **Testing & UI**: Vitest, Playwright, Storybook 10

## Directory Structure
- `src/components/`: Reusable Vue UI components (buttons, layout elements).
- `src/views/`: Top-level page components (e.g., used by vue-router).
- `src/composables/`: Vue composition functions for state and reusable logic (e.g., window size, input handling).
- `src/layouts/`: Global wrapper layouts.
- `src/router/`: Vue Router configurations.
- `src/analytics.ts`: Centralized PostHog tracking logic.
- `src/assets/`: Static assets like images, sprite sheets, and global CSS (`style.css`).

## Coding Guidelines

### Vue 3 & TypeScript
- Use `<script setup lang="ts">` for all Vue components.
- Heavily utilize Vue's Composition API (`ref`, `computed`, `watch`, `provide`/`inject`).
- Write strictly typed TypeScript. Define `interface` or `type` for component props and emits.
- Prefer `defineProps` and `defineEmits` macros.

### Tailwind CSS & Styling
- Use Tailwind CSS 4 utility classes for structure, layout, and responsive design.
- Utilize `@tailwindcss/container-queries` where appropriate for component-level responsiveness.
- Avoid writing arbitrary CSS in `<style>` blocks unless creating complex custom animations, highly specific component states, or shader integrations that Tailwind can't handle.

### Three.js & WebGL
- 3D elements and WebGL shaders are a core part of the project's identity.
- Keep Three.js logic clean, modularized, and performant. 
- Clean up WebGL resources (geometries, materials, textures, renderer) properly in the Vue `onBeforeUnmount` lifecycle hook to avoid memory leaks.
- Ensure correct scaling and coordinate mapping for custom shaders (like Comic Flame Shader) so they align with DOM elements.

### Aesthetics & Design
- **Core Themes**: "Street-Tech Minimalism" and "Cozy Pixel UI".
- Strive for premium, polished aesthetics. Do not use generic, unstyled components.
- Emphasize rich micro-animations, hover states, and dynamic feedback for user interactions.
- Pay attention to specific reference imagery and UI styling when generating code.

### PostHog Analytics
- Analytics are handled centrally via `src/analytics.ts`.
- Track high-level funnel events (e.g., project clicks, contact clicks) rather than noisy micro-interactions.

### Storybook & Testing
- Use Storybook to document and test UI components in isolation.
- Keep components decoupled from global state where possible to make them easy to use in Storybook.

## Workflows
1. **Adding a Component**: Create it in `src/components/`, define its types, style it with Tailwind, and create a corresponding Storybook story if it's a reusable UI element.
2. **Adding a Shader/3D Effect**: Build the Three.js logic within a dedicated Vue component or composable. Bind the canvas to a template ref, start the animation loop in `onMounted`, and manage resizing via a `ResizeObserver`.
3. **Routing**: Add new pages to `src/views/` and register them in `src/router/`.
