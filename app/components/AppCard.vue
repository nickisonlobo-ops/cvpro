<template>
  <div
    :class="[
      baseClasses,
      elevationClasses[elevation],
      paddingClasses[padding],
    ]"
  >
    <!-- Header slot -->
    <div
      v-if="$slots.header"
      class="pb-4 border-b border-primary-border"
    >
      <slot name="header" />
    </div>

    <!-- Body (default slot) -->
    <div>
      <slot />
    </div>

    <!-- Footer slot -->
    <div
      v-if="$slots.footer"
      class="pt-4 border-t border-primary-border"
    >
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'AppCard' })

withDefaults(
  defineProps<{
    elevation?: 'flat' | 'raised' | 'elevated'
    padding?: 'none' | 'sm' | 'md' | 'lg'
  }>(),
  {
    elevation: 'raised',
    padding: 'md',
  }
)

const baseClasses = 'bg-theme-card text-theme-card-text rounded-card'

const elevationClasses: Record<string, string> = {
  flat:     'border border-primary-border',
  raised:   'border border-primary-border shadow-card',
  elevated: 'border border-primary-border shadow-panel',
}

const paddingClasses: Record<string, string> = {
  none: '',
  sm:   'p-4',
  md:   'p-6',
  lg:   'p-8',
}
</script>
