<script setup lang="ts">
import ExperimentWrapper from '../components/ExperimentWrapper.vue'
import VideoEmbed from '../components/VideoEmbed.vue'
</script>

<template>
  <div class="max-w-4xl pt-12 mx-auto px-6 lg:px-0 mb-24">
    <ExperimentWrapper
      title="Feel like a Jedi - combat design and interaction to make lightsabers fun"
      description='I talk a lot of about how interactions and animations can make a big difference about how a game feels, but in this video I walk the talk and explore it hands on. Go through with me on how I deconstruct interactions, analyse "game feel" and "game juice" to make my own interpration on how it would feel to be a jedi in Unity using C#.'
      :tags="['Game Design', 'Unity', 'Combat Design']"
    >
      <VideoEmbed src="https://www.youtube.com/embed/mfEHbCky9j4?si=i8Zlj29zpqvUFfxz" />
    </ExperimentWrapper>
  </div>
</template>
