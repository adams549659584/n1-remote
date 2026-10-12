<script setup lang="ts">
import { ref } from 'vue'
import type { SlideDir } from '@/config/keys'

const emit = defineEmits<{
  (e: 'slide', dir: SlideDir): void
  (e: 'confirm'): void
}>()

// 与原 APK GestureDelectorSimlpeListener 对齐：
// 一次滑动只发一个方向键（原版阈值 100px），轻点发 OK。
const SWIPE = 48
const TAP_MOVE = 10
const TAP_TIME = 300

let startX = 0
let startY = 0
let startAt = 0
const active = ref<SlideDir | null>(null)
const tapped = ref(false)

function onStart(e: any) {
  const t = e.touches?.[0] || e.changedTouches?.[0]
  if (!t) return
  startX = t.clientX
  startY = t.clientY
  startAt = Date.now()
}

function onEnd(e: any) {
  const t = e.changedTouches?.[0] || e.touches?.[0]
  if (!t) return
  const dx = t.clientX - startX
  const dy = t.clientY - startY
  const ax = Math.abs(dx)
  const ay = Math.abs(dy)

  if (ax < TAP_MOVE && ay < TAP_MOVE) {
    if (Date.now() - startAt < TAP_TIME) {
      tapped.value = true
      emit('confirm')
      setTimeout(() => (tapped.value = false), 160)
    }
    return
  }

  if (ax < SWIPE && ay < SWIPE) return

  const dir: SlideDir = ax > ay ? (dx > 0 ? 'right' : 'left') : dy > 0 ? 'down' : 'up'
  active.value = dir
  emit('slide', dir)
  setTimeout(() => {
    if (active.value === dir) active.value = null
  }, 220)
}
</script>

<template>
  <view class="pad" @touchstart="onStart" @touchend="onEnd" @touchcancel="onEnd">
    <view class="pad__ring" />
    <view class="pad__chev pad__chev--up" :class="{ 'pad__chev--on': active === 'up' }" />
    <view class="pad__chev pad__chev--right" :class="{ 'pad__chev--on': active === 'right' }" />
    <view class="pad__chev pad__chev--down" :class="{ 'pad__chev--on': active === 'down' }" />
    <view class="pad__chev pad__chev--left" :class="{ 'pad__chev--on': active === 'left' }" />
    <view class="pad__core" :class="{ 'pad__core--on': active !== null || tapped }">
      <text class="pad__ok">OK</text>
    </view>
    <text class="pad__hint">滑动方向 · 轻点确认</text>
  </view>
</template>

<style scoped>
.pad {
  position: relative;
  width: 620rpx;
  height: 620rpx;
  margin: 40rpx 0;
  border-radius: 50%;
  background: radial-gradient(
    circle at 50% 45%,
    rgba(255, 255, 255, 0.028) 0%,
    rgba(255, 255, 255, 0.012) 55%,
    rgba(0, 0, 0, 0.12) 100%
  );
  box-shadow:
    inset 0 3rpx 10rpx rgba(0, 0, 0, 0.35),
    inset 0 -2rpx 8rpx rgba(255, 255, 255, 0.025);
  display: flex;
  align-items: center;
  justify-content: center;
}

.pad__ring {
  position: absolute;
  width: 300rpx;
  height: 300rpx;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.pad__core {
  width: 150rpx;
  height: 150rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.11) 0%,
    rgba(255, 255, 255, 0.055) 48%,
    rgba(255, 255, 255, 0.03) 100%
  );
  border: 1px solid rgba(255, 255, 255, 0.13);
  box-shadow:
    0 8rpx 22rpx rgba(0, 0, 0, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.16);
  transition: background 0.16s ease, box-shadow 0.16s ease;
}
.pad__core--on {
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.17) 0%, rgba(255, 255, 255, 0.09) 100%);
  box-shadow:
    0 2rpx 6rpx rgba(0, 0, 0, 0.32),
    inset 0 3rpx 8rpx rgba(0, 0, 0, 0.3),
    0 0 30rpx rgba(76, 141, 255, 0.38);
}
.pad__ok {
  font-size: 30rpx;
  font-weight: 600;
  color: var(--text);
  letter-spacing: 1rpx;
}

/* chevron 与 RemoteKey 一致：方块保留上/右两条边框，尖角朝右上（-45°） */
.pad__chev {
  position: absolute;
  width: 44rpx;
  height: 44rpx;
  border-top: 5px solid var(--text-dim);
  border-right: 5px solid var(--text-dim);
  border-radius: 9rpx;
  transition: border-color 0.16s ease, transform 0.16s ease;
}
.pad__chev--on {
  border-color: var(--accent-hi);
}
.pad__chev--up {
  top: 96rpx;
  left: 50%;
  transform: translate(-50%, 0) rotate(315deg);
}
.pad__chev--up.pad__chev--on {
  transform: translate(-50%, 0) rotate(315deg) scale(1.15);
}
.pad__chev--right {
  right: 96rpx;
  top: 50%;
  transform: translate(0, -50%) rotate(45deg);
}
.pad__chev--right.pad__chev--on {
  transform: translate(0, -50%) rotate(45deg) scale(1.15);
}
.pad__chev--down {
  bottom: 96rpx;
  left: 50%;
  transform: translate(-50%, 0) rotate(135deg);
}
.pad__chev--down.pad__chev--on {
  transform: translate(-50%, 0) rotate(135deg) scale(1.15);
}
.pad__chev--left {
  left: 96rpx;
  top: 50%;
  transform: translate(0, -50%) rotate(225deg);
}
.pad__chev--left.pad__chev--on {
  transform: translate(0, -50%) rotate(225deg) scale(1.15);
}

.pad__hint {
  position: absolute;
  bottom: 150rpx;
  font-size: 24rpx;
  color: var(--text-dim);
  letter-spacing: 1rpx;
}
</style>
