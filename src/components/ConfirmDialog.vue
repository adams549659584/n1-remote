<script setup lang="ts">
withDefaults(
  defineProps<{
    visible: boolean
    title: string
    content: string
    confirmText?: string
    danger?: boolean
  }>(),
  { confirmText: '确定', danger: false }
)

const emit = defineEmits<{
  (e: 'update:visible', v: boolean): void
  (e: 'confirm'): void
}>()

function close() {
  emit('update:visible', false)
}

function onConfirm() {
  emit('confirm')
  close()
}
</script>

<template>
  <view v-if="visible" class="mask" @tap="close">
    <view class="card" @tap.stop>
      <view class="icon" :class="{ 'icon--danger': danger }">
        <view class="power__ring" />
        <view class="power__bar" />
      </view>
      <text class="card__title">{{ title }}</text>
      <text class="card__content">{{ content }}</text>
      <view class="card__actions">
        <view class="btn btn--ghost" hover-class="btn--active" @tap="close">
          <text class="btn__text">取消</text>
        </view>
        <view class="btn" :class="danger ? 'btn--danger' : 'btn--primary'" hover-class="btn--active" @tap="onConfirm">
          <text class="btn__text btn__text--on-primary">{{ confirmText }}</text>
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
  display: flex;
  flex-direction: column;
  align-items: center;
}
.icon {
  position: relative;
  width: 88rpx;
  height: 88rpx;
  border-radius: 50%;
  background: rgba(76, 141, 255, 0.14);
  border: 1px solid rgba(76, 141, 255, 0.32);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.1),
    0 0 24rpx rgba(76, 141, 255, 0.18);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 28rpx;
}
.icon--danger {
  background: rgba(255, 77, 94, 0.14);
  border-color: rgba(255, 77, 94, 0.32);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.1),
    0 0 24rpx rgba(255, 77, 94, 0.18);
}
.power__ring {
  position: absolute;
  width: 36rpx;
  height: 36rpx;
  border: 4px solid var(--accent);
  border-radius: 50%;
  border-top-color: transparent;
}
.icon--danger .power__ring {
  border-color: var(--danger);
  border-top-color: transparent;
}
.power__bar {
  position: absolute;
  width: 4px;
  height: 22rpx;
  background: var(--accent);
  top: 22rpx;
}
.icon--danger .power__bar {
  background: var(--danger);
}
.card__title {
  font-size: 34rpx;
  font-weight: 600;
  color: var(--text);
  letter-spacing: 0.5rpx;
  text-align: center;
}
.card__content {
  margin-top: 16rpx;
  font-size: 27rpx;
  line-height: 1.65;
  color: var(--text-dim);
  text-align: center;
}
.card__actions {
  width: 100%;
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
/* 主按钮（危险色）：球面受光，与 OK 键同一手法 */
.btn--danger {
  background: linear-gradient(180deg, #ff6b7a 0%, #ff4d5e 52%, #e03b4c 100%);
  border: none;
  box-shadow:
    0 10rpx 28rpx rgba(255, 77, 94, 0.36),
    inset 0 2rpx 0 rgba(255, 255, 255, 0.35),
    inset 0 -3rpx 8rpx rgba(0, 0, 0, 0.16);
}
/* 主按钮（强调色） */
.btn--primary {
  background: linear-gradient(180deg, #7cb0ff 0%, #4c8dff 52%, #3b7be8 100%);
  border: none;
  box-shadow:
    0 10rpx 28rpx rgba(76, 141, 255, 0.36),
    inset 0 2rpx 0 rgba(255, 255, 255, 0.35),
    inset 0 -3rpx 8rpx rgba(0, 0, 0, 0.16);
}
.btn--active {
  transform: scale(0.97);
  opacity: 0.9;
}
.btn__text {
  font-size: 30rpx;
  color: var(--text);
}
.btn__text--on-primary {
  color: #fff;
  font-weight: 600;
}
</style>
