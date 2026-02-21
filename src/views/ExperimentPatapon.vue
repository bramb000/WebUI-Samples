<script setup lang="ts">
import ExperimentWrapper from '../components/ExperimentWrapper.vue'
import VideoEmbed from '../components/VideoEmbed.vue'
</script>

<template>
  <div class="max-w-4xl pt-12 mx-auto px-6 lg:px-0 mb-24">
    <ExperimentWrapper
      title="Designing rhythm-combat to feel fun"
      description="Walk with me as I breakdown the interaction and combat design of one of my favourite games - Patapon - a cult classic rhythm-combat game on the Playstation Portable (and eventually Playstation 4) to recreate the entire core gameplay interaction system in Unity while showing technical ways of tackling input latency and input arrays which can make or break precision-based combat in rhythm and fighting games."
      :tags="['Game Design', 'Unity', 'Interaction Design']"
    >
      <VideoEmbed src="https://www.youtube.com/embed/BIEXPwEnHCI" />
    </ExperimentWrapper>
  </div>
</template>
