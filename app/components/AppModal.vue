<template>
  <Teleport to="body">
    <Transition
      enter-active-class="duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="show"
        class="fixed inset-0 z-50 flex items-center justify-center"
        @keydown.escape="onEscape"
      >
        <!-- Overlay -->
        <div
          class="absolute inset-0 bg-black/40 backdrop-blur-[4px]"
          @click="onOverlayClick"
        />

        <!-- Modal Panel -->
        <Transition
          enter-active-class="duration-200 ease-out"
          enter-from-class="translate-y-2 opacity-0"
          enter-to-class="translate-y-0 opacity-100"
          leave-active-class="duration-150 ease-in"
          leave-from-class="translate-y-0 opacity-100"
          leave-to-class="translate-y-2 opacity-0"
          appear
        >
          <div
            v-if="show"
            class="relative z-10 flex flex-col w-full rounded-modal bg-white shadow-modal overflow-hidden max-h-[90vh]"
            :class="sizeClass"
            role="dialog"
            aria-modal="true"
            :aria-labelledby="titleId"
          >
            <!-- Header -->
            <div class="flex-shrink-0 flex items-center justify-between px-6 py-5 border-b border-primary-border">
              <h2 :id="titleId" class="text-h3 text-gray-900">
                {{ title }}
              </h2>
              <button
                v-if="closable"
                type="button"
                class="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors duration-150"
                aria-label="Fechar"
                @click="onClose"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <!-- Body (scrollable) -->
            <div class="flex-1 overflow-y-auto px-6 py-5">
              <slot />
            </div>

            <!-- Footer -->
            <div v-if="$slots.footer" class="flex-shrink-0 flex items-center justify-end gap-3 px-6 py-5 border-t border-primary-border">
              <slot name="footer" />
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, watch, onMounted, onBeforeUnmount, useId } from 'vue'

// ─── Props & Emits ───────────────────────────────────────────────────────────
interface AppModalProps {
  show: boolean
  size?: 'sm' | 'md' | 'lg'
  title: string
  closable?: boolean
}

const props = withDefaults(defineProps<AppModalProps>(), {
  size: 'md',
  closable: true,
})

const emit = defineEmits<{
  (e: 'close'): void
}>()

// ─── Computed ────────────────────────────────────────────────────────────────
const titleId = `modal-title-${useId()}`

const sizeClass = computed(() => {
  const sizes: Record<string, string> = {
    sm: 'max-w-[400px]',
    md: 'max-w-[540px]',
    lg: 'max-w-[680px]',
  }
  return sizes[props.size] || sizes.md
})

// ─── Methods ─────────────────────────────────────────────────────────────────
function onOverlayClick() {
  if (props.closable) {
    emit('close')
  }
}

function onClose() {
  emit('close')
}

function onEscape() {
  if (props.closable) {
    emit('close')
  }
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && props.show && props.closable) {
    emit('close')
  }
}

// ─── Lifecycle ───────────────────────────────────────────────────────────────
onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onBeforeUnmount(() => {
  document.removeEventListener('keydown', handleKeydown)
})

// Lock body scroll when modal is open
watch(() => props.show, (isOpen) => {
  if (isOpen) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
}, { immediate: true })
</script>
