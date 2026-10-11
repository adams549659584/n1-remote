<script setup lang="ts">
import { ref, onMounted } from 'vue'
import RemoteKey from '@/components/RemoteKey.vue'
import IpDialog from '@/components/IpDialog.vue'
import ConfirmDialog from '@/components/ConfirmDialog.vue'
import { DPAD, GRID, KEYCODES } from '@/config/keys'
import { getIp } from '@/utils/storage'
import { sendKey, openSetting, ping } from '@/api/n1'

const ip = ref(getIp())
const status = ref<'unknown' | 'online' | 'offline'>('unknown')
const showIp = ref(false)
const showPower = ref(false)
const statusBarHeight = ref(0)

let lastToast = 0
function toastOnce(msg: string) {
  const now = Date.now()
  if (now - lastToast < 3000) return
  lastToast = now
  uni.showToast({ title: msg, icon: 'none' })
}

function buzz() {
  // H5 端 navigator.vibrate 不可用时 uni.vibrateShort 会返回 rejected Promise，
  // try/catch 无法捕获异步 rejection，这里显式吞掉以保证静默失败。
  void Promise.resolve(uni.vibrateShort({ type: 'light' })).catch(() => {})
}

async function fire(fn: () => Promise<void>) {
  try {
    await fn()
    status.value = 'online'
  } catch {
    status.value = 'offline'
    toastOnce('连接失败，请检查盒子 IP')
  }
}

const onKey = (code: number) => {
  buzz()
  fire(() => sendKey(ip.value, code))
}
const onSetting = () => {
  buzz()
  fire(() => openSetting(ip.value))
}

function onPowerConfirm() {
  buzz()
  fire(() => sendKey(ip.value, KEYCODES.POWER))
}

function onSaved(v: string) {
  ip.value = v
  refresh()
}

async function refresh() {
  status.value = (await ping(ip.value)) ? 'online' : 'offline'
}

onMounted(() => {
  statusBarHeight.value = uni.getSystemInfoSync().statusBarHeight || 0
  refresh()
})
</script>

<template>
  <view class="page" :style="{ paddingTop: statusBarHeight + 'px' }">
    <!-- 顶栏 -->
    <view class="topbar">
      <view class="pill" hover-class="pill--active" @tap="showIp = true">
        <view class="dot" :class="`dot--${status}`" />
        <text class="pill__ip">{{ ip }}</text>
        <text class="pill__caret">▾</text>
      </view>
      <view class="power" hover-class="power--active" @tap="showPower = true">
        <view class="power__ring" />
        <view class="power__bar" />
      </view>
    </view>

    <!-- D-pad -->
    <view class="dpad">
      <RemoteKey
        v-for="k in DPAD"
        :key="k.dir"
        class="dpad__key"
        :class="`dpad__key--${k.dir}`"
        :dir="k.dir as 'up' | 'down' | 'left' | 'right'"
        :size="144"
        @tap="onKey(k.code)"
      />
      <view class="ok" hover-class="ok--active" @tap="onKey(KEYCODES.OK)">
        <text class="ok__text">OK</text>
      </view>
    </view>

    <!-- 功能键网格 -->
    <view class="grid">
      <RemoteKey
        v-for="item in GRID"
        :key="item.label"
        shape="pill"
        :size="120"
        :label="item.label"
        :icon="item.icon"
        class="grid__item"
        @tap="'action' in item ? onSetting() : onKey(item.code)"
      />
    </view>

    <IpDialog v-model:visible="showIp" :model-value="ip" @saved="onSaved" />
    <ConfirmDialog
      v-model:visible="showPower"
      title="关闭盒子"
      content="确定要关闭 N1 盒子吗？关机后需要手动重新开机。"
      confirm-text="关机"
      danger
      @confirm="onPowerConfirm"
    />
  </view>
</template>

<style scoped>
.page {
  min-height: 100vh;
  box-sizing: border-box;
  max-width: 480px;
  margin: 0 auto;
  padding-left: 32rpx;
  padding-right: 32rpx;
  padding-bottom: calc(40rpx + env(safe-area-inset-bottom));
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* 顶栏 */
.topbar {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24rpx 0;
}
.pill {
  display: flex;
  align-items: center;
  height: 64rpx;
  padding: 0 24rpx;
  border-radius: 32rpx;
  background: var(--surface);
  border: 1px solid var(--border);
}
.pill--active {
  background: var(--surface-hi);
}
.dot {
  width: 12rpx;
  height: 12rpx;
  border-radius: 50%;
  margin-right: 14rpx;
}
.dot--online {
  background: var(--accent);
  box-shadow: 0 0 12rpx var(--accent);
}
.dot--offline {
  background: var(--danger);
}
.dot--unknown {
  background: var(--text-dim);
}
.pill__ip {
  font-size: 26rpx;
  color: var(--text);
}
.pill__caret {
  font-size: 22rpx;
  color: var(--text-dim);
  margin-left: 12rpx;
}

.power {
  position: relative;
  width: 88rpx;
  height: 88rpx;
  border-radius: 50%;
  background: rgba(255, 77, 94, 0.12);
  border: 1px solid rgba(255, 77, 94, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.12s ease, background 0.12s ease;
}
.power--active {
  background: rgba(255, 77, 94, 0.22);
  transform: scale(0.94);
}
.power__ring {
  position: absolute;
  width: 36rpx;
  height: 36rpx;
  border: 3px solid var(--danger);
  border-radius: 50%;
  border-top-color: transparent;
}
.power__bar {
  position: absolute;
  width: 3px;
  height: 22rpx;
  background: var(--danger);
  top: 22rpx;
}

/* D-pad */
.dpad {
  position: relative;
  width: 620rpx;
  height: 620rpx;
  margin: 40rpx 0;
  border-radius: 50%;
  /* 去掉 border，改用填充式凹槽：中心略亮、边缘沉下去 */
  background: radial-gradient(
    circle at 50% 45%,
    rgba(255, 255, 255, 0.028) 0%,
    rgba(255, 255, 255, 0.012) 55%,
    rgba(0, 0, 0, 0.12) 100%
  );
  box-shadow:
    inset 0 3rpx 10rpx rgba(0, 0, 0, 0.35),
    inset 0 -2rpx 8rpx rgba(255, 255, 255, 0.025);
}
.dpad__key {
  position: absolute;
}
.dpad__key--up {
  top: 30rpx;
  left: 50%;
  transform: translate(-50%, 0);
}
.dpad__key--down {
  bottom: 30rpx;
  left: 50%;
  transform: translate(-50%, 0);
}
.dpad__key--left {
  left: 30rpx;
  top: 50%;
  transform: translate(0, -50%);
}
.dpad__key--right {
  right: 30rpx;
  top: 50%;
  transform: translate(0, -50%);
}
/* 按下时保留居中位移，同时叠加缩放 */
.dpad__key--up.key--active {
  transform: translate(-50%, 0) scale(0.94);
}
.dpad__key--down.key--active {
  transform: translate(-50%, 0) scale(0.94);
}
.dpad__key--left.key--active {
  transform: translate(0, -50%) scale(0.94);
}
.dpad__key--right.key--active {
  transform: translate(0, -50%) scale(0.94);
}

.ok {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 200rpx;
  height: 200rpx;
  border-radius: 50%;
  /* 磨砂白玻璃：顶部亮、底部略沉，制造球面受光 */
  background: linear-gradient(180deg, #ffffff 0%, #f2f4f8 42%, #dde2ec 78%, #cdd4e0 100%);
  box-shadow:
    0 16rpx 40rpx rgba(0, 0, 0, 0.45),
    0 4rpx 12rpx rgba(0, 0, 0, 0.3),
    inset 0 2rpx 0 rgba(255, 255, 255, 0.95),
    inset 0 -4rpx 12rpx rgba(140, 155, 180, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.12s ease, background 0.12s ease, box-shadow 0.12s ease;
}
.ok--active {
  transform: translate(-50%, -50%) scale(0.96);
  background: linear-gradient(180deg, #e8ecf3 0%, #dce1ea 42%, #c8cfdb 78%, #b9c1d0 100%);
  box-shadow:
    0 5rpx 16rpx rgba(0, 0, 0, 0.32),
    inset 0 5rpx 14rpx rgba(120, 135, 160, 0.45),
    inset 0 1px 0 rgba(255, 255, 255, 0.6);
}
.ok__text {
  color: #0a0e17;
  font-weight: 700;
  font-size: 52rpx;
  letter-spacing: 2rpx;
  text-shadow: 0 1rpx 0 rgba(255, 255, 255, 0.5);
}

/* 功能键网格 */
.grid {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  gap: 24rpx;
}
.grid__item {
  width: calc((100% - 48rpx) / 3);
  box-sizing: border-box;
}
</style>
