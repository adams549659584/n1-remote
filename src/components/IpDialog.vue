<script setup lang="ts">
import { ref, watch } from 'vue'
import { normalizeIp, isValidIp, setIp } from '@/utils/storage'
import { ping } from '@/api/n1'

const props = defineProps<{ visible: boolean; modelValue: string }>()
const emit = defineEmits<{
  (e: 'update:visible', v: boolean): void
  (e: 'saved', ip: string): void
}>()

const input = ref(props.modelValue)
const error = ref('')
const testing = ref(false)

watch(
  () => props.visible,
  (v) => {
    if (v) {
      input.value = props.modelValue
      error.value = ''
    }
  }
)

function close() {
  emit('update:visible', false)
}

function save() {
  const ip = normalizeIp(input.value)
  if (!isValidIp(ip)) {
    error.value = '请输入合法的 IPv4 地址'
    return
  }
  setIp(ip)
  emit('saved', ip)
  close()
}

async function test() {
  const ip = normalizeIp(input.value)
  if (!isValidIp(ip)) {
    error.value = '请输入合法的 IPv4 地址'
    return
  }
  error.value = ''
  testing.value = true
  const ok = await ping(ip)
  testing.value = false
  uni.showToast({ title: ok ? '连接成功' : '连接失败', icon: 'none' })
}
</script>

<template>
  <view v-if="visible" class="mask" @tap="close">
    <view class="card" @tap.stop>
      <text class="card__title">盒子 IP 地址</text>
      <input
        v-model="input"
        class="card__input"
        type="text"
        placeholder="例如 192.168.168.113"
        placeholder-class="card__ph"
      />
      <text v-if="error" class="card__error">{{ error }}</text>
      <view class="card__actions">
        <view class="btn btn--ghost" :class="{ 'btn--busy': testing }" hover-class="btn--active" @tap="test">
          <text class="btn__text">{{ testing ? '测试中…' : '测试连接' }}</text>
        </view>
        <view class="btn btn--primary" hover-class="btn--active" @tap="save">
          <text class="btn__text btn__text--on-primary">保存</text>
        </view>
      </view>
    </view>
  </view>
</template>

<style scoped>
.mask {
  position: fixed;
  inset: 0;
  background: rgba(4, 7, 14, 0.78);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}
/* #ifdef H5 */
.mask {
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}
/* #endif */
.card {
  width: calc(100% - 96rpx);
  max-width: 600rpx;
  box-sizing: border-box;
  padding: 48rpx 40rpx 40rpx;
  border-radius: 36rpx;
  /* 顶光渐变表面，与 D-pad 按键同一套材质语言 */
  background: linear-gradient(180deg, #1b2438 0%, #141b2b 100%);
  border: 1px solid rgba(255, 255, 255, 0.12);
  box-shadow:
    0 24rpx 64rpx rgba(0, 0, 0, 0.55),
    0 4rpx 12rpx rgba(0, 0, 0, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.12);
}
.card__title {
  display: block;
  font-size: 34rpx;
  font-weight: 600;
  color: var(--text);
  letter-spacing: 0.5rpx;
  margin-bottom: 28rpx;
}
.card__input {
  height: 92rpx;
  padding: 0 26rpx;
  box-sizing: border-box;
  border-radius: 22rpx;
  background: rgba(0, 0, 0, 0.28);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: inset 0 2rpx 6rpx rgba(0, 0, 0, 0.3);
  color: var(--text);
  font-size: 30rpx;
}
.card__ph {
  color: var(--text-dim);
}
.card__error {
  display: block;
  margin-top: 16rpx;
  font-size: 24rpx;
  color: var(--danger);
}
.card__actions {
  display: flex;
  gap: 24rpx;
  margin-top: 40rpx;
}
.btn {
  flex: 1;
  height: 88rpx;
  border-radius: 24rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.12s ease, background 0.12s ease, box-shadow 0.12s ease;
}
/* 次要按钮：与 D-pad 按键同一套玻璃材质 */
.btn--ghost {
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.045) 100%);
  border: 1px solid rgba(255, 255, 255, 0.13);
  box-shadow:
    0 4rpx 12rpx rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.14);
}
.btn--busy {
  opacity: 0.6;
}
/* 主按钮（磨砂白玻璃）：与 OK 键同一材质语言 */
.btn--primary {
  background: linear-gradient(180deg, #ffffff 0%, #f2f4f8 42%, #dde2ec 78%, #cdd4e0 100%);
  border: none;
  box-shadow:
    0 8rpx 20rpx rgba(0, 0, 0, 0.35),
    inset 0 2rpx 0 rgba(255, 255, 255, 0.95),
    inset 0 -3rpx 10rpx rgba(140, 155, 180, 0.3);
}
.btn--active {
  transform: scale(0.97);
  opacity: 0.9;
}
/* 白玻璃按钮按下态：渐变加深 + 内阴影，不用 opacity 以免发灰 */
.btn--primary.btn--active {
  background: linear-gradient(180deg, #e8ecf3 0%, #dce1ea 42%, #c8cfdb 78%, #b9c1d0 100%);
  opacity: 1;
  transform: scale(0.97);
  box-shadow:
    0 3rpx 10rpx rgba(0, 0, 0, 0.3),
    inset 0 4rpx 12rpx rgba(120, 135, 160, 0.4);
}
.btn__text {
  font-size: 30rpx;
  color: var(--text);
}
.btn__text--on-primary {
  color: #0a0e17;
  font-weight: 600;
}
</style>
