export const KEYCODES = {
  UP: 19,
  DOWN: 20,
  LEFT: 21,
  RIGHT: 22,
  BACK: 4,
  VOL_UP: 24,
  VOL_DOWN: 25,
  HOME: 3,
  MENU: 82,
  OK: 23,
  POWER: 26,
  MUTE: 164,
  CHANEL_UP: 166,
  CHANEL_DOWN: 167,
} as const

export const DPAD = [
  { dir: 'up', code: KEYCODES.UP },
  { dir: 'down', code: KEYCODES.DOWN },
  { dir: 'left', code: KEYCODES.LEFT },
  { dir: 'right', code: KEYCODES.RIGHT },
]

export const GRID = [
  { label: '返回', icon: 'back', code: KEYCODES.BACK },
  { label: '主页', icon: 'home', code: KEYCODES.HOME },
  { label: '菜单', icon: 'menu', code: KEYCODES.MENU },
  { label: '音量−', icon: 'vol-down', code: KEYCODES.VOL_DOWN },
  { label: '音量+', icon: 'vol-up', code: KEYCODES.VOL_UP },
  { label: '静音', icon: 'mute', code: KEYCODES.MUTE },
  { label: '频道−', icon: 'chan-down', code: KEYCODES.CHANEL_DOWN },
  { label: '频道+', icon: 'chan-up', code: KEYCODES.CHANEL_UP },
  { label: '设置', icon: 'setting', action: 'setting' as const },
]

// 快捷动作（POST /v1/action），对应 APK Commands.java
export const ACTIONS = [
  { label: '儿童锁', icon: 'lock', action: 'openlock' },
  { label: '清理', icon: 'clear', action: 'openclear' },
]

// 手势滑动方向 → 方向键码，对应 APK TouchPanelFragment
export const SLIDE = {
  up: KEYCODES.UP,
  down: KEYCODES.DOWN,
  left: KEYCODES.LEFT,
  right: KEYCODES.RIGHT,
} as const

export type SlideDir = keyof typeof SLIDE
