<script setup lang="ts">
// Password gate disabled — portfolio case studies are public.
// import { nextTick, ref } from 'vue'
// import { Lock } from 'lucide-vue-next'
// import PrimaryButton from '../PrimaryButton.vue'
// import { useCaseStudyUnlock } from '../../composables/useCaseStudyUnlock'
//
// const { unlocked, tryUnlock, isConfigured } = useCaseStudyUnlock()
//
// const password = ref('')
// const error = ref<string | null>(null)
// const inputRef = ref<HTMLInputElement | null>(null)
//
// function onSubmit() {
//   error.value = null
//   if (!isConfigured()) {
//     error.value = 'Password is not configured for this build.'
//     return
//   }
//   if (!tryUnlock(password.value)) {
//     error.value = 'Incorrect password. Ask Bramha for access.'
//     password.value = ''
//     nextTick(() => inputRef.value?.focus())
//     return
//   }
//   password.value = ''
// }
</script>

<template>
  <slot />
  <!--
  <template v-if="unlocked">
    <slot />
  </template>
  <section
    v-else
    class="case-study-password-gate panel-recessed--no-pencil-frame noise-overlay case-study-panel"
    aria-labelledby="case-study-password-gate-heading"
  >
    ...
  </section>
  -->
</template>

<!--
<style scoped>
.case-study-password-gate { ... }
</style>
-->
