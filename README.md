# Web UI Samples

A portfolio of micro-interaction experiments built with **Vue.js**, **TypeScript**, and **Tailwind CSS v4**.

Each project is a standalone page showcasing a different UI interaction pattern.

## Micro Interactions

| # | Name | Route | Description |
|---|------|-------|-------------|
| 1 | Login Screen | `/login-interaction-1` | Animated avatar that tracks email input and squints during password entry |

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Tech Stack

- **Vue.js 3** — Composition API with `<script setup>`
- **TypeScript**
- **Tailwind CSS v4** — via `@tailwindcss/postcss`
- **Lottie Web** — for vector animations
- **Vue Router** — with dynamic layout support
- **Vite** — dev server and bundler
- **Storybook** — component development (`npm run storybook`)

## Project Structure

```
src/
├── assets/          # Lottie JSON files and static assets
├── components/      # Micro-interaction pages (LoginAvatar.vue, etc.)
├── layouts/         # Page layout components (DefaultLayout.vue)
├── views/           # Portfolio pages (Home, Projects, About)
├── router/          # Vue Router configuration
└── style.css        # Tailwind import + global resets
```

## Architecture

- **Portfolio pages** use `DefaultLayout` with header/footer navigation.
- **Micro-interaction pages** use a blank layout (`meta: { layout: 'blank' }`) for full creative control.
