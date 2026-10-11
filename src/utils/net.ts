const TIMEOUT = 1500
type Transport = (url: string, payload: Record<string, any>) => Promise<void>

const h5Transport: Transport = (url, payload) =>
  new Promise((resolve, reject) => {
    const ctrl = new AbortController()
    const timer = setTimeout(() => {
      ctrl.abort()
      reject(new Error('timeout'))
    }, TIMEOUT)
    fetch(url, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify(payload),
      signal: ctrl.signal,
    })
      .then(() => {
        clearTimeout(timer)
        resolve()
      })
      .catch((e) => {
        clearTimeout(timer)
        reject(e)
      })
  })

const mpTransport: Transport = (url, payload) =>
  new Promise((resolve, reject) => {
    uni.request({
      url,
      method: 'POST',
      data: payload,
      header: { 'Content-Type': 'application/json' },
      timeout: TIMEOUT,
      success: () => resolve(),
      fail: (e: any) => reject(new Error(e?.errMsg || 'request failed')),
    })
  })

let transport: Transport = mpTransport
// #ifdef H5
transport = h5Transport
// #endif

export function post(url: string, payload: Record<string, any>) {
  return transport(url, payload)
}

// 连通性探测：只要服务器有响应即视为在线
export function probe(url: string): Promise<boolean> {
  // #ifdef H5
  return new Promise((resolve) => {
    const ctrl = new AbortController()
    const timer = setTimeout(() => {
      ctrl.abort()
      resolve(false)
    }, TIMEOUT)
    fetch(url, { method: 'GET', mode: 'no-cors', signal: ctrl.signal })
      .then(() => {
        clearTimeout(timer)
        resolve(true)
      })
      .catch(() => {
        clearTimeout(timer)
        resolve(false)
      })
  })
  // #endif
  // #ifndef H5
  return new Promise((resolve) => {
    uni.request({
      url,
      method: 'GET',
      timeout: TIMEOUT,
      success: () => resolve(true),
      fail: () => resolve(false),
    })
  })
  // #endif
}
