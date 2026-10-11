<script setup lang="ts">
import { onLaunch } from '@dcloudio/uni-app'

onLaunch(() => {})
</script>

<style>
page {
  --bg-0: #0a0e17;
  --bg-glow: #1a2338;
  --surface: rgba(255, 255, 255, 0.055);
  --surface-hi: rgba(255, 255, 255, 0.14);
  --border: rgba(255, 255, 255, 0.1);
  --text: #e9edf5;
  --text-dim: #7c879c;
  --accent: #4c8dff;
  --accent-hi: #6ba6ff;
  --danger: #ff4d5e;

  min-height: 100%;
  background: radial-gradient(120% 70% at 50% 0%, var(--bg-glow) 0%, var(--bg-0) 62%) no-repeat,
    var(--bg-0);
  color: var(--text);
  font-family: -apple-system, 'SF Pro Text', 'Helvetica Neue', 'PingFang SC', sans-serif;
}
</style>
