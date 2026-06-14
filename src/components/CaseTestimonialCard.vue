<script setup lang="ts">
defineProps<{
  name: string
  role: string
  quote: string
}>()
</script>

<template>
  <figure class="case-testimonial-card panel-recessed">
    <figcaption class="case-testimonial-card__attrib">
      <p class="case-testimonial-card__name type-case-testimonial-name">{{ name }}</p>
      <p class="case-testimonial-card__role type-case-testimonial-role">{{ role }}</p>
    </figcaption>
    <blockquote class="case-testimonial-card__quote type-case-body italic">
      {{ quote }}
    </blockquote>
  </figure>
</template>
