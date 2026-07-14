<script setup lang="ts">
import { nextTick, ref } from 'vue'
import { Lock } from 'lucide-vue-next'
import PrimaryButton from '../PrimaryButton.vue'
import { useCaseStudyUnlock } from '../../composables/useCaseStudyUnlock'

const { unlocked, tryUnlock, isConfigured } = useCaseStudyUnlock()

const password = ref('')
const error = ref<string | null>(null)
const inputRef = ref<HTMLInputElement | null>(null)

function onSubmit() {
  error.value = null
  if (!isConfigured()) {
    error.value = 'Password is not configured for this build.'
    return
  }
  if (!tryUnlock(password.value)) {
    error.value = 'Incorrect password. Ask Bramha for access.'
    password.value = ''
    nextTick(() => inputRef.value?.focus())
    return
  }
  password.value = ''
}
</script>

<template>
  <template v-if="unlocked">
    <slot />
  </template>
  <section
    v-else
    class="case-study-password-gate panel-recessed--no-pencil-frame noise-overlay case-study-panel"
    aria-labelledby="case-study-password-gate-heading"
  >
    <div class="case-study-password-gate__icon" aria-hidden="true">
      <Lock :size="28" stroke-width="1.75" />
    </div>
    <div class="case-study-password-gate__header">
      <h2 id="case-study-password-gate-heading" class="type-case-section-accent">
        Full case study locked
      </h2>
      <p class="type-case-body case-study-password-gate__copy">
        Please enter the password to read more
      </p>
    </div>

    <form class="case-study-password-gate__form" @submit.prevent="onSubmit">
      <input
        id="case-study-password"
        ref="inputRef"
        v-model="password"
        class="case-study-password-gate__input"
        type="password"
        name="password"
        autocomplete="current-password"
        aria-label="Password"
        autofocus
        :aria-invalid="error ? 'true' : undefined"
        :aria-describedby="error ? 'case-study-password-error' : undefined"
      />
      <p
        v-if="error"
        id="case-study-password-error"
        class="case-study-password-gate__error type-case-caption"
        role="alert"
      >
        {{ error }}
      </p>
      <PrimaryButton type="submit" variant="filled" class="case-study-password-gate__submit">
        Continue Reading
      </PrimaryButton>
    </form>
  </section>
</template>

<style scoped>
.case-study-password-gate {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--dl-panel-gap);
  max-width: var(--case-study-prose-max, 42rem);
  margin-inline: auto;
  text-align: center;
}

.case-study-password-gate__icon {
  color: var(--color-ink-muted, var(--color-muted, #6b5e4f));
  opacity: 0.85;
}

.case-study-password-gate__header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--grid-2);
}

.case-study-password-gate__copy {
  margin: 0;
  max-width: 36ch;
  text-wrap: balance;
}

.case-study-password-gate__form {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--grid-2);
  width: 100%;
  max-width: 22rem;
}

.case-study-password-gate__input {
  width: 100%;
  box-sizing: border-box;
  padding: 0.65rem 0.85rem;
  font: inherit;
  font-size: 1rem;
  text-align: center;
  color: var(--color-ink, inherit);
  background: color-mix(in srgb, var(--color-paper, #f5efe3) 88%, #fff);
  border: 1px solid color-mix(in srgb, var(--color-ink, #2a241c) 28%, transparent);
  border-radius: 2px;
  outline: none;
}

.case-study-password-gate__input:focus-visible {
  border-color: var(--color-accent, #c47a2c);
  box-shadow: 0 0 0 2px color-mix(in srgb, var(--color-accent, #c47a2c) 35%, transparent);
}

.case-study-password-gate__error {
  margin: 0;
  color: var(--color-before, #a63d2f);
}

.case-study-password-gate__submit {
  margin-top: var(--grid-1, 0.35rem);
}
</style>
