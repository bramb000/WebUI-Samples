import { ref, watch } from 'vue';

type Theme = 'light' | 'dark';

const STORAGE_KEY = 'portfolio-theme';

function getInitialTheme(): Theme {
    // Check localStorage first
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'light' || stored === 'dark') return stored;

    // Fall back to system preference
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';

    return 'light';
}

// Shared reactive state (singleton across all components)
const theme = ref<Theme>(getInitialTheme());

function applyTheme(t: Theme) {
    document.documentElement.classList.toggle('dark', t === 'dark');
    localStorage.setItem(STORAGE_KEY, t);
}

// Apply on init
applyTheme(theme.value);

// Watch for changes
watch(theme, applyTheme);

export function useTheme() {
    function toggle() {
        theme.value = theme.value === 'light' ? 'dark' : 'light';
    }

    return {
        theme,
        toggle,
        isDark: () => theme.value === 'dark',
    };
}
