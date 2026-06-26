<template>
  <button
    v-bind="$attrs"
    :type="type"
    :disabled="disabled || loading"
    :class="[
      baseClasses,
      variantClasses[variant],
      sizeClasses[size],
      { 'opacity-60 cursor-not-allowed pointer-events-none': disabled || loading }
    ]"
  >
    <!-- Spinner de loading integrado -->
    <span
      v-if="loading"
      class="inline-block border-2 border-current border-t-transparent rounded-full animate-spin"
      :class="spinnerSizeClasses[size]"
    />
    <template v-if="!loading">
      <slot />
    </template>
  </button>
</template>

<script setup lang="ts">
defineOptions({ name: 'AppButton' })

withDefaults(
  defineProps<{
    variant?: 'primary' | 'secondary' | 'danger' | 'outline' | 'ghost' | 'white'
    size?: 'xs' | 'sm' | 'md' | 'lg'
    type?: 'button' | 'submit' | 'reset'
    disabled?: boolean
    loading?: boolean
  }>(),
  {
    variant: 'primary',
    size: 'md',
    type: 'button',
    disabled: false,
    loading: false,
  }
)

const baseClasses = [
  'inline-flex items-center justify-center',
  'font-medium',
  'rounded-lg',
  'transition-all duration-150',
  'active:scale-[0.98]',
  'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
  'whitespace-nowrap',
].join(' ')

const variantClasses: Record<string, string> = {
  primary:   'bg-primary text-primary-text hover:opacity-90 focus-visible:ring-primary shadow-sm',
  secondary: 'bg-primary-5 text-primary hover:bg-primary-10 focus-visible:ring-primary border border-primary-10',
  danger:    'bg-error text-white hover:opacity-90 focus-visible:ring-error shadow-sm',
  outline:   'border border-primary-20 text-primary bg-transparent hover:bg-primary-5 focus-visible:ring-primary',
  ghost:     'text-primary bg-transparent hover:bg-primary-5 focus-visible:ring-primary',
  white:     'bg-white text-primary hover:bg-primary-50 focus-visible:ring-primary shadow-sm border border-primary-10',
}

const sizeClasses: Record<string, string> = {
  xs: 'h-7 px-2.5 text-[12px] gap-1',
  sm: 'h-8 px-3 text-[13px] gap-1.5',
  md: 'h-10 px-4 text-[13px] gap-2',
  lg: 'h-11 px-5 text-[15px] gap-2.5',
}

const spinnerSizeClasses: Record<string, string> = {
  xs: 'w-3 h-3',
  sm: 'w-3.5 h-3.5',
  md: 'w-4 h-4',
  lg: 'w-[18px] h-[18px]',
}
</script>
