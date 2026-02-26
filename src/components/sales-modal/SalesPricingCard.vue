<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import SalesButton from './SalesButton.vue';
import SalesBadge from './SalesBadge.vue';
import SalesTooltip from './SalesTooltip.vue';
import { Check, Star } from 'lucide-vue-next';

export interface PricingFeature {
  name: string;
  tooltip?: string;
  isHighlighted?: boolean;
}

export interface Props {
  title: string;
  subtitle: string;
  price: number | 'Custom';
  billingSubtext: string;
  features: PricingFeature[];
  buttonText: string;
  buttonVariant: 'primary' | 'outline' | 'selected';
  badgeType?: 'success' | 'warning' | 'none';
  badgePrefix?: string;
  badgeSuffix?: string;
  badgeBaseCost?: number; // Base annual cost for math calculation
  headerImageClass?: string;
  billingCycle?: 'annual' | 'monthly';
}

const props = withDefaults(defineProps<Props>(), {
  price: 0,
  badgeType: 'none',
  buttonVariant: 'primary',
  billingCycle: 'annual'
});

const cardClasses = computed(() => {
  return [
    'flex flex-col rounded-3xl p-5 @xl:p-6 bg-[#0b0b12]/90 backdrop-blur-2xl transition-all duration-500 relative h-full w-full hover:z-50 focus-within:z-50',
    isSelected.value 
      ? 'border border-[rgba(168,85,247,0.5)] shadow-[0_0_80px_-15px_rgba(168,85,247,0.3)] bg-white/[0.04]' 
      : 'border border-white/5 hover:border-white/10 hover:bg-white/[0.03]'
  ];
});

const isSelected = computed(() => props.buttonVariant === 'selected');
const isCustom = computed(() => props.price === 'Custom');

const displayPriceNumeric = ref(typeof props.price === 'number' ? props.price : 0);
const formattedPrice = ref(props.price === 'Custom' ? 'Custom' : props.price.toString());

const targetPrice = computed(() => {
  if (props.price === 'Custom') return 'Custom';
  if (props.price === 0) return 0;
  if (props.billingCycle === 'monthly') {
    return Math.ceil((props.price * 1.15) / 10) * 10 - 1;
  }
  return props.price;
});

const targetBadgeCost = computed(() => {
  if (!props.badgeBaseCost) return 0;
  if (props.billingCycle === 'monthly') {
    // Exact same math calculation applied to the badge base cost
    return Math.ceil((props.badgeBaseCost * 1.15) / 10) * 10 - 1;
  }
  return props.badgeBaseCost;
});

const displayBadgeNumeric = ref(props.badgeBaseCost || 0);
const formattedBadgeNumeric = ref(props.badgeBaseCost?.toString() || '0');

let animationFrameId: number;


watch(targetPrice, (newVal) => {
  if (newVal === 'Custom') {
    formattedPrice.value = 'Custom';
    return;
  }
  
  if (newVal === 0) {
    formattedPrice.value = '0';
    return;
  }
  
  const start = displayPriceNumeric.value;
  const end = Number(newVal);
  const duration = 600; // ms
  const startTime = performance.now();
  
  if (animationFrameId) cancelAnimationFrame(animationFrameId);
  
  const animate = (time: number) => {
    const elapsed = time - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    // easeOutQuart cubic-bezier
    const ease = 1 - Math.pow(1 - progress, 4);
    
    displayPriceNumeric.value = start + (end - start) * ease;
    formattedPrice.value = Math.round(displayPriceNumeric.value).toString();
    
    // Also roll badge math if it exists
    if (props.badgeBaseCost) {
      const startBadge = displayBadgeNumeric.value;
      const endBadge = targetBadgeCost.value;
      displayBadgeNumeric.value = startBadge + (endBadge - startBadge) * ease;
      formattedBadgeNumeric.value = Math.round(displayBadgeNumeric.value).toString();
    }
    
    if (progress < 1) {
      animationFrameId = requestAnimationFrame(animate);
    } else {
      displayPriceNumeric.value = end;
      if (props.badgeBaseCost) {
        displayBadgeNumeric.value = targetBadgeCost.value;
      }
    }
  };
  
  animationFrameId = requestAnimationFrame(animate);
}, { immediate: true });

</script>

<template>
  <div :class="cardClasses" role="region" :aria-label="title + ' plan details'">

    <!-- Content -->
    <div class="flex flex-col flex-1 h-full select-none">
      
      <!-- Headers -->
      <div class="flex flex-col gap-2 items-start justify-start w-full mb-6 shrink-0 z-10 flex-1 min-h-[64px]">
        <h3 class="text-xl @sm:text-2xl font-medium font-['Outfit'] text-white leading-tight">{{ title }}</h3>
        <p class="text-sm font-normal font-['Outfit'] text-slate-400 leading-snug text-left max-w-xs">{{ subtitle }}</p>
      </div>

      <!-- Price -->
      <div class="flex flex-col items-start justify-start w-full text-left mb-8 shrink-0 z-10 min-h-[96px]">
        <div class="flex items-start justify-start w-full leading-none mb-2 mt-1 relative">
          <span v-if="!isCustom" class="text-xl font-medium font-['Outfit'] text-white mt-1.5 mr-0.5">$</span>
          <span v-if="!isCustom" class="text-5xl @sm:text-7xl font-semibold font-['Outfit'] text-white tracking-tighter tabular-nums">{{ formattedPrice }}</span>
          <span v-else class="text-3xl @sm:text-5xl font-semibold font-['Outfit'] text-white tracking-tight leading-tight">{{ formattedPrice }}</span>
          <span v-if="!isCustom" class="ml-2 text-sm font-normal font-['Outfit'] text-slate-500 self-center mt-3">/month</span>
        </div>
        <p class="text-[11px] @sm:text-xs font-normal font-['Outfit'] text-slate-500 leading-tight whitespace-pre-wrap text-left max-w-[200px]">{{ billingSubtext }}</p>
      </div>

      <!-- Action Button -->
      <div class="w-full flex items-center justify-center mb-6 z-10 shrink-0">
        <SalesButton 
          :variant="buttonVariant" 
          size="lg"
          class="h-12 w-full text-sm font-semibold"
          fullWidth
          @click="$emit('select')"
        >
          {{ buttonText }}
        </SalesButton>
      </div>

      <!-- Divider -->
      <hr class="w-full border-white/5 mb-6 z-10" />

      <!-- Features List -->
      <div class="flex flex-col gap-4 w-full z-10 relative mb-4">
        <ul class="flex flex-col gap-3 w-full">
          <li v-for="(feature, index) in features" :key="index" class="flex items-start gap-3 w-full relative z-20">
            <Star v-if="feature.isHighlighted" class="w-5 h-5 shrink-0 mt-0.5 text-amber-400 fill-amber-400" />
            <Check v-else class="w-5 h-5 shrink-0 mt-0.5 text-purple-600" />
            
            <span v-if="feature.isHighlighted" class="text-xs @sm:text-sm font-medium font-['Outfit'] text-amber-200 bg-amber-500/10 px-2 py-1 rounded-md flex items-center leading-snug shadow-sm border border-amber-500/20">
              {{ feature.name }}
              <SalesTooltip v-if="feature.tooltip" :text="feature.tooltip" class="ml-1.5" />
            </span>

            <span v-else class="text-xs @sm:text-sm font-normal font-['Outfit'] text-slate-300 flex items-center flex-wrap leading-snug">
              {{ feature.name }}
              <SalesTooltip v-if="feature.tooltip" :text="feature.tooltip" class="ml-1.5" />
            </span>
          </li>
        </ul>
      </div>

      <!-- Badge area (Insights render directly after features) -->
      <div v-if="badgeType !== 'none' && badgePrefix" class="w-full flex items-start justify-start pt-3 shrink-0 z-10">
        <SalesBadge :variant="badgeType" class="w-full text-left justify-start items-start">
          {{ badgePrefix }}
          <template v-if="badgeBaseCost">
            <span class="tabular-nums font-semibold">${{ formattedBadgeNumeric }}</span>{{ badgeSuffix }}
          </template>
        </SalesBadge>
      </div>


      <!-- Subtle background radial glow tailored to "premium glassmorphic" ref image -->
      <div class="absolute inset-0 rounded-[2rem] pointer-events-none bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[rgba(147,51,234,0.15)] via-transparent to-transparent z-0"></div>
      
      <!-- Ambient light refraction behind the headers/prices -->
      <div class="absolute top-12 -left-12 w-64 h-64 bg-purple-600/15 rounded-full blur-[80px] pointer-events-none mix-blend-screen z-0"></div>
      <div class="absolute top-32 -right-12 w-72 h-72 bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none mix-blend-screen z-0"></div>
    </div>
  </div>
</template>
