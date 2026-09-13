<script setup lang="ts">
import { computed } from 'vue'
import KeyIcon from '@/components/KeyIcon.vue'

const props = withDefaults(
  defineProps<{
    shape?: 'circle' | 'pill'
    size?: number
    label?: string
    icon?: string
    dir?: 'up' | 'down' | 'left' | 'right'
  }>(),
  { shape: 'circle' }
)

defineEmits<{ (e: 'tap'): void }>()

const sizeStyle = computed(() => {
  if (!props.size) return ''
  return props.shape === 'circle'
    ? `width:${props.size}rpx;height:${props.size}rpx;`
    : `height:${props.size}rpx;`
})
</script>

<template>
  <view
    class="key"
    :class="[`key--${shape}`, dir ? `key--dir-${dir}` : '']"
    :style="sizeStyle"
    hover-class="key--active"
    hover-start-time="0"
    hover-stay-time="80"
    @tap="$emit('tap')"
  >
    <view v-if="dir" class="chev" />
    <template v-else-if="icon">
      <KeyIcon :name="icon" :size="40" />
      <text v-if="label" class="key__label">{{ label }}</text>
    </template>
    <text v-else-if="label" class="key__label">{{ label }}</text>
    <slot />
  </view>
</template>

<style scoped>
.key {
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--surface);
  border: 1px solid var(--border);
  color: var(--text);
  transition: transform 0.12s ease, background 0.12s ease, box-shadow 0.12s ease;
}
.key--active {
  background: var(--surface-hi);
  transform: scale(0.94);
}
.key--circle {
  width: 150rpx;
  height: 150rpx;
  border-radius: 50%;
  /* 顶光渐变：上亮下暗 */
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.11) 0%,
    rgba(255, 255, 255, 0.055) 48%,
    rgba(255, 255, 255, 0.03) 100%
  );
  border: 1px solid rgba(255, 255, 255, 0.13);
  box-shadow:
    0 8rpx 22rpx rgba(0, 0, 0, 0.4),
    0 2rpx 5rpx rgba(0, 0, 0, 0.28),
    inset 0 1px 0 rgba(255, 255, 255, 0.16),
    inset 0 -1px 0 rgba(0, 0, 0, 0.2);
}
.key--circle.key--active {
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.17) 0%, rgba(255, 255, 255, 0.09) 100%);
  box-shadow:
    0 2rpx 6rpx rgba(0, 0, 0, 0.32),
    inset 0 3rpx 8rpx rgba(0, 0, 0, 0.3),
    0 0 30rpx rgba(76, 141, 255, 0.38);
}
.key--pill {
  width: 100%;
  border-radius: 28rpx;
  flex-direction: column;
  gap: 6rpx;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.115) 0%, rgba(255, 255, 255, 0.05) 100%);
  border: 1px solid rgba(255, 255, 255, 0.14);
  box-shadow:
    0 6rpx 16rpx rgba(0, 0, 0, 0.32),
    inset 0 1px 0 rgba(255, 255, 255, 0.16);
}
.key--pill.key--active {
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.18) 0%, rgba(255, 255, 255, 0.1) 100%);
  box-shadow:
    0 2rpx 6rpx rgba(0, 0, 0, 0.28),
    inset 0 3rpx 8rpx rgba(0, 0, 0, 0.28);
}
.key__label {
  font-size: 26rpx;
  color: var(--text);
  letter-spacing: 0.5rpx;
}

/* 纯 CSS chevron：一个方块只保留上/右两条边框，尖角朝右上（方向向量 (1,-1)，即 -45°）。
   CSS rotate 为顺时针，故各方向所需角度 = 目标角度 - (-45°)：
   up(0,-1) => 315deg，right(1,0) => 45deg，down(0,1) => 135deg，left(-1,0) => 225deg */
.chev {
  width: 48rpx;
  height: 48rpx;
  border-top: 5px solid var(--text);
  border-right: 5px solid var(--text);
  border-radius: 9rpx;
}
.key--dir-up .chev {
  transform: rotate(315deg);
}
.key--dir-right .chev {
  transform: rotate(45deg);
}
.key--dir-down .chev {
  transform: rotate(135deg);
}
.key--dir-left .chev {
  transform: rotate(225deg);
}
</style>
