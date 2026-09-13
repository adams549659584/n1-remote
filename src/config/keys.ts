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
  { label: '设置', icon: 'setting', action: 'setting' as const },
]
