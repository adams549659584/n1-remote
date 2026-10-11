import { post, probe } from '@/utils/net'

const PORT = 8080
const base = (ip: string) => `http://${ip}:${PORT}/v1`
const MOCK = import.meta.env.VITE_USE_MOCK === 'true'

export function sendKey(ip: string, keycode: number) {
  if (MOCK) return mock('keyevent', { keycode, longclick: false })
  return post(`${base(ip)}/keyevent`, { keycode, longclick: false })
}
export function openSetting(ip: string) {
  if (MOCK) return mock('action', { action: 'setting' })
  return post(`${base(ip)}/action`, { action: 'setting' })
}
export function ping(ip: string) {
  if (MOCK) return Promise.resolve(true)
  return probe(`http://${ip}:${PORT}/`)
}
function mock(path: string, payload: any) {
  console.log('[MOCK]', path, payload)
  uni.showToast({ title: `${path} ${JSON.stringify(payload)}`, icon: 'none', duration: 700 })
  return new Promise<void>((r) => setTimeout(r, 100))
}
