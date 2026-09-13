const IP_KEY = 'n1_ip'
export const DEFAULT_IP = '192.168.168.113'

export function getIp(): string {
  return uni.getStorageSync(IP_KEY) || DEFAULT_IP
}
export function setIp(ip: string) {
  uni.setStorageSync(IP_KEY, ip)
}
// 容忍用户粘贴 "http://192.168.1.5:8080/" 这类输入
export function normalizeIp(raw: string): string {
  return raw
    .trim()
    .replace(/^https?:\/\//i, '')
    .replace(/\/.*$/, '')
    .replace(/:\d+$/, '')
}
export function isValidIp(ip: string): boolean {
  const m = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/.exec(ip)
  return !!m && m.slice(1).every((s) => Number(s) >= 0 && Number(s) <= 255)
}
