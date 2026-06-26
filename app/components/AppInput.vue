<template>
  <div class="flex flex-col w-full">
    <label
      v-if="label"
      :for="inputId"
      class="text-[13px] font-medium mb-1.5 text-inherit"
    >
      {{ label }}
      <span v-if="required" class="text-error ml-0.5">*</span>
    </label>

    <div class="relative">
      <span
        v-if="$slots.leading"
        class="absolute left-3.5 top-1/2 -translate-y-1/2 text-primary-400 pointer-events-none"
      >
        <slot name="leading" />
      </span>

      <input
        :id="inputId"
        v-bind="$attrs"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :required="required"
        :aria-invalid="!!error"
        :aria-describedby="error ? errorId : undefined"
        :class="[
          baseClasses,
          sizeClasses,
          stateClasses,
          $slots.leading ? 'pl-10' : '',
          $slots.trailing ? 'pr-10' : '',
        ]"
        @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      />

      <span
        v-if="$slots.trailing"
        class="absolute right-3.5 top-1/2 -translate-y-1/2 text-primary-400 pointer-events-none"
      >
        <slot name="trailing" />
      </span>
    </div>

    <p v-if="hint && !error" class="text-xs text-primary-400 mt-1.5">{{ hint }}</p>

    <p
      v-if="error"
      :id="errorId"
      class="flex items-center gap-1 text-xs text-error mt-1.5"
      role="alert"
    >
      <svg
        class="w-3.5 h-3.5 shrink-0"
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden="true"
      >
        <path
          fill-rule="evenodd"
          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z"
          clip-rule="evenodd"
        />
      </svg>
      {{ error }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed, useId } from 'vue'

defineOptions({ name: 'AppInput', inheritAttrs: false })

const props = withDefaults(
  defineProps<{
    modelValue?: string | number
    label?: string
    placeholder?: string
    hint?: string
    error?: string
    size?: 'md' | 'lg'
    type?: string
    disabled?: boolean
    required?: boolean
  }>(),
  {
    modelValue: '',
    size: 'md',
    type: 'text',
    disabled: false,
    required: false,
  }
)

defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const inputId = useId()
const errorId = `${inputId}-error`

const baseClasses =
  'w-full rounded-lg border bg-white px-3.5 text-sm text-gray-900 placeholder:text-primary-400 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'

const sizeClasses = computed(() =>
  props.size === 'lg' ? 'h-11' : 'h-10'
)

const stateClasses = computed(() =>
  props.error
    ? 'border-error focus:ring-error'
    : 'border-primary-border focus:border-primary'
)
</script>
