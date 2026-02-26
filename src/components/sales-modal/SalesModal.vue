<script setup lang="ts">
import { ref } from 'vue';
import SalesToggle from './SalesToggle.vue';
import SalesPricingCard from './SalesPricingCard.vue';
import type { Props as CardProps } from './SalesPricingCard.vue';

const props = withDefaults(defineProps<{
  inline?: boolean;
}>(), {
  inline: false
});



const billingCycle = ref<'monthly' | 'annual'>('annual');
const selectedPlan = ref<string>('Free Plan');

const selectPlan = (planTitle: string) => {
  if (planTitle !== 'Enterprise') {
    selectedPlan.value = planTitle;
  }
};

const handleQuote = () => {
  // Enterprise quote action
  console.log('Get a quote clicked');
};

const plans: CardProps[] = [
  {
    title: 'Free Plan',
    subtitle: 'Get started and explore the power of AI agents',
    price: 0,
    billingSubtext: 'Billed per month on the 18th.\n18th of February 2026 will be your start date',
    buttonText: 'Get started',
    buttonVariant: 'outline',
    headerImageClass: 'bg-[url(https://placehold.co/400x150/e2e8f0/64748b?text=Workshop)] bg-cover bg-center',
    features: [
      { name: '200 actions / month' },
      { name: '1,000 credits' },
      { name: 'Unlimited agents' },
      { name: 'Chat mode & forum' },
      { name: 'Multi-agent workforce', tooltip: 'Assign tasks to multiple specialized agents working together.' }
    ]
  },
  {
    title: 'Pro Plan',
    subtitle: 'To automate hours of day-to-day work',
    price: 29,
    billingSubtext: 'Billed per month on the 18th.\n18th of February 2026 will be your start date',
    buttonText: 'Upgrade',
    buttonVariant: 'primary',
    badgeType: 'success',
    badgePrefix: 'You completed 2000 actions in 23 days last month. We project you may need 2900 actions per month based on your workflows.',
    headerImageClass: 'bg-[url(https://placehold.co/400x150/e2e8f0/64748b?text=Helmet)] bg-cover bg-center',
    features: [
      { name: '3,000 actions / month total', isHighlighted: true, tooltip: 'Recommended based on your projected usage.' },
      { name: '10,000 credits (+9000)', tooltip: 'Bonus credits for being a pro user.' },
      { name: 'Privileged support' },
      { name: 'Bring your own LLM & compute' },
      { name: 'Everything in Free' }
    ]
  },
  {
    title: 'Team Plan',
    subtitle: 'For large teams and many stakeholders',
    price: 399,
    billingSubtext: 'Billed per month on the 18th.\n18th of February 2026 will be your start date',
    buttonText: 'Upgrade',
    buttonVariant: 'primary',
    badgeType: 'warning',
    badgePrefix: '5 teammates (including Omar, Jack, and Asha) are using this product with @yourcompany emails. This plan could be ',
    badgeBaseCost: 79,
    badgeSuffix: ' / month / person for your team.',
    headerImageClass: 'bg-[url(https://placehold.co/400x150/e2e8f0/64748b?text=Team)] bg-cover bg-center',
    features: [
      { name: '7,000 actions / month total' },
      { name: '40,000 credits / month total' },
      { name: '25 seats included' },
      { name: '10 Team projects', tooltip: 'Collaborative workspaces for your organization.' },
      { name: 'Agent performance testing' },
      { name: 'Everything in Pro' }
    ]
  },
  {
    title: 'Enterprise',
    subtitle: 'For companies with security requirements',
    price: 'Custom',
    billingSubtext: 'Billed per month on the 18th.\n18th of February 2026 will be your start date',
    buttonText: 'Get a quote',
    buttonVariant: 'outline',
    headerImageClass: 'bg-[url(https://placehold.co/400x150/e2e8f0/64748b?text=Enterprise)] bg-cover bg-center',
    features: [
      { name: 'Unlimited actions' },
      { name: 'Unlimited team projects' },
      { name: 'Unlimited seats' },
      { name: 'Multi-org management' },
      { name: 'Enterprise-grade security' },
      { name: 'Dedicated account manager' }
    ]
  }
];
</script>

<template>
  <div :class="inline ? 'w-full h-full bg-[#0a0a0f] relative rounded-xl overflow-hidden' : 'fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 lg:p-10 bg-[#030305]/80 backdrop-blur-3xl w-full text-left flex flex-col'">
    <div :class="inline ? 'w-full h-full flex flex-col p-2 @sm:p-8 items-center justify-center' : 'w-full min-h-full flex items-center justify-center shrink-0'">
      <!-- Modal Container -->
      <div 
        class="bg-[#0b0b12]/90 rounded-3xl shadow-[0_0_80px_rgba(112,56,224,0.15)] ring-1 ring-white/10 w-full max-w-7xl relative flex flex-col p-5 @md:p-8 @xl:p-10 gap-6 @md:gap-8 border border-white/5 pointer-events-auto mx-auto my-auto" 
        :class="inline ? 'max-h-full overflow-hidden' : 'shrink-0'"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        
        <!-- Top header section -->
      <div class="flex flex-col @md:flex-row @md:items-center justify-between gap-4 shrink-0 z-10 w-full">
        <h2 id="modal-title" class="text-2xl @sm:text-3xl font-medium text-white tracking-tight">Manage your subscription plan</h2>
        <div class="flex items-center justify-start @md:justify-end">
          <SalesToggle v-model="billingCycle" />
        </div>
      </div>

      <!-- Scrollable content area -->
      <div :class="['flex-1 flex flex-col gap-6 custom-scrollbar w-full', inline ? 'overflow-y-auto overflow-x-hidden pr-2' : '']">
        <!-- Grid layout for cards -->
        <div class="grid grid-cols-1 @xl:grid-cols-2 @[1100px]:grid-cols-4 gap-6 items-stretch w-full pb-4">
          <SalesPricingCard
            v-for="(plan, index) in plans"
            :key="index"
            class="h-full w-full"
            v-bind="plan"
            :billing-cycle="billingCycle"
            :buttonVariant="selectedPlan === plan.title ? 'selected' : plan.buttonVariant"
            :buttonText="selectedPlan === plan.title ? 'Selected' : plan.buttonText"
            @select="plan.price === 'Custom' ? handleQuote() : selectPlan(plan.title)"
          />
        </div>

        <div class="flex justify-start pt-2 shrink-0">
          <a href="#" class="text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded">
            View full feature comparison
          </a>
        </div>
      </div>

    </div>
  </div>
</div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  height: 8px;
  width: 8px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.2);
}
</style>
