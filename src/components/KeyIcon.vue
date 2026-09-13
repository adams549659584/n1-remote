<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{ name: string; size?: number }>(), { size: 40 })

const COLOR = '#E9EDF5'

const PATHS: Record<string, string> = {
  back: `<path d="M19 12H5M12 19l-7-7 7-7" fill="none" stroke="${COLOR}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>`,
  home: `<path d="M4 10.5L12 4l8 6.5V20a1 1 0 0 1-1 1h-4v-6H9v6H5a1 1 0 0 1-1-1z" fill="none" stroke="${COLOR}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>`,
  menu: `<path d="M4 7h16M4 12h16M4 17h16" fill="none" stroke="${COLOR}" stroke-width="2.2" stroke-linecap="round"/>`,
  'vol-down': `<path d="M5 9v6h3l4 4V5L8 9z" fill="none" stroke="${COLOR}" stroke-width="2.2" stroke-linejoin="round"/><path d="M16 12h5" fill="none" stroke="${COLOR}" stroke-width="2.2" stroke-linecap="round"/>`,
  'vol-up': `<path d="M5 9v6h3l4 4V5L8 9z" fill="none" stroke="${COLOR}" stroke-width="2.2" stroke-linejoin="round"/><path d="M16 12h5M18.5 9.5v5" fill="none" stroke="${COLOR}" stroke-width="2.2" stroke-linecap="round"/>`,
  setting: `<circle cx="12" cy="12" r="3" fill="none" stroke="${COLOR}" stroke-width="2.2"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" fill="none" stroke="${COLOR}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>`,
}

const src = computed(() => {
  const p = PATHS[props.name] || ''
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">${p}</svg>`
  return `data:image/svg+xml,${encodeURIComponent(svg)}`
})

const sizeStyle = computed(() => `width:${props.size}rpx;height:${props.size}rpx;`)
</script>

<template>
  <image class="key-icon" :src="src" :style="sizeStyle" mode="aspectFit" />
</template>

<style scoped>
.key-icon {
  display: block;
}
</style>
