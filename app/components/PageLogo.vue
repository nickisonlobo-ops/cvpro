<template>
  <div v-if="logoUrl" class="absolute top-4 right-4 opacity-10 pointer-events-none">
    <img :src="logoUrl" alt="" class="w-20 h-20 object-contain" />
  </div>
</template>

<script setup lang="ts">
const config = useState<any>('personalizacao_config')
const logoUrl = computed(() => config.value?.logo_url ?? null)
</script>
