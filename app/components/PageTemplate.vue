<template>
  <div class="px-6 md:px-8 lg:px-12 py-6">
    <!-- Page Header -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-h1">{{ title }}</h1>
        <p v-if="subtitle" class="text-body text-primary-400 mt-1">{{ subtitle }}</p>
      </div>
      <div v-if="$slots.actions" class="flex items-center gap-3">
        <slot name="actions" />
      </div>
    </div>

    <!-- Loading Skeleton -->
    <div v-if="loading" class="space-y-8">
      <div class="animate-shimmer bg-primary-5 rounded-lg h-10 w-full" />
      <div class="animate-shimmer bg-primary-5 rounded-lg h-48 w-full" />
      <div class="animate-shimmer bg-primary-5 rounded-lg h-32 w-full" />
      <div class="flex gap-4">
        <div class="animate-shimmer bg-primary-5 rounded-lg h-24 w-1/2" />
        <div class="animate-shimmer bg-primary-5 rounded-lg h-24 w-1/2" />
      </div>
    </div>

    <!-- Main Content -->
    <div v-else-if="$slots.default" class="space-y-8">
      <slot />
    </div>

    <!-- Empty State -->
    <div v-else-if="$slots.empty">
      <slot name="empty" />
    </div>

    <!-- Default Empty State (when no content and no custom empty slot) -->
    <div v-else class="flex flex-col items-center justify-center py-20 gap-3 text-center">
      <svg
        class="w-12 h-12 text-primary-300"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m6 4.125l2.25 2.25m0 0l2.25 2.25M12 13.875l2.25-2.25M12 13.875l-2.25 2.25M3.75 7.5h16.5"
        />
      </svg>
      <p class="text-[15px] font-semibold text-primary-400">Nenhum dado encontrado</p>
      <p class="text-body text-primary-300">Não há registros para exibir no momento.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'PageTemplate' })

withDefaults(
  defineProps<{
    /** Page title (required) — rendered as H1 */
    title: string
    /** Optional subtitle below the title */
    subtitle?: string
    /** When true, shows skeleton placeholders instead of content */
    loading?: boolean
  }>(),
  {
    subtitle: undefined,
    loading: false,
  }
)
</script>
