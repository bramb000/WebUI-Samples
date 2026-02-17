# Web UI Samples

This is a simple frontend practice project using Vue.js, TypeScript, and Storybook.
It was set up with a "bare basics" approach, using standard CSS for styling.

## Getting Started

1.  install dependencies:
    ```bash
    npm install
    ```

2.  Run the development server:
    ```bash
    npm run dev
    ```

3.  Open [http://localhost:5173](http://localhost:5173) in your browser.

## Storybook

This project includes Storybook for component development.

To run Storybook:

```bash
npm run storybook
```

Open [http://localhost:6006](http://localhost:6006) to view your stories.

## Project Structure

-   `src/components`: Reusable Vue components (and their stories).
-   `src/layouts`: Page layout components.
-   `src/views`: Top-level page components (Home, About, Projects).
-   `src/router`: Vue Router configuration.
-   `src/style.css`: Global styles.

## Notes

-   Tailwind CSS was originally planned but removed to keep the project simple and dependency-free for learning purposes. Styles are written in standard CSS.
