import { ref, readonly } from 'vue'

const STORAGE_KEY = 'case-study-unlocked'

/** Persist unlock across refresh only in production builds. */
const persistAcrossRefresh = import.meta.env.PROD

function readStoredUnlock(): boolean {
  if (!persistAcrossRefresh) return false
  if (typeof sessionStorage === 'undefined') return false
  try {
    return sessionStorage.getItem(STORAGE_KEY) === '1'
  } catch {
    return false
  }
}

const unlocked = ref(readStoredUnlock())

function persistUnlock(value: boolean) {
  if (!persistAcrossRefresh) return
  if (typeof sessionStorage === 'undefined') return
  try {
    if (value) sessionStorage.setItem(STORAGE_KEY, '1')
    else sessionStorage.removeItem(STORAGE_KEY)
  } catch {
    // Ignore quota / private-mode failures
  }
}

export function useCaseStudyUnlock() {
  function tryUnlock(password: string): boolean {
    const expected = import.meta.env.VITE_CASE_STUDY_PASSWORD
    if (typeof expected !== 'string' || expected.length === 0) {
      return false
    }
    if (password !== expected) return false
    unlocked.value = true
    persistUnlock(true)
    return true
  }

  return {
    unlocked: readonly(unlocked),
    tryUnlock,
    /** True when the env password is configured for this build. */
    isConfigured: () => {
      const expected = import.meta.env.VITE_CASE_STUDY_PASSWORD
      return typeof expected === 'string' && expected.length > 0
    },
  }
}
