<script setup>
defineProps({
  label: String,
  value: [String, Number],
  hint: String,
  icon: Object,
  tone: { type: String, default: 'brand' } // brand | success | warn | neutral
});
</script>

<template>
  <div class="stat" :class="`stat-${tone}`">
    <div v-if="icon" class="stat-icon"><component :is="icon" :size="18" /></div>
    <div class="stat-body">
      <p class="stat-label">{{ label }}</p>
      <p class="stat-value">{{ value }}</p>
      <p v-if="hint" class="stat-hint">{{ hint }}</p>
    </div>
  </div>
</template>

<style scoped>
.stat {
  display: flex;
  gap: 14px;
  padding: 18px;
  background: var(--bg-surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-xs);
}
.stat-icon {
  width: 38px; height: 38px;
  border-radius: 10px;
  display: grid; place-items: center;
  flex-shrink: 0;
}
.stat-brand   .stat-icon { background: var(--brand-50);   color: var(--brand-600); }
.stat-success .stat-icon { background: var(--success-50); color: var(--success-700); }
.stat-warn    .stat-icon { background: var(--warn-50);    color: var(--warn-700); }
.stat-neutral .stat-icon { background: var(--bg-subtle);  color: var(--text-soft); }

.stat-body { min-width: 0; }
.stat-label {
  font-size: 12px;
  color: var(--text-mute);
  text-transform: uppercase;
  letter-spacing: .05em;
  font-weight: 600;
  margin: 0;
}
.stat-value {
  font-size: 22px;
  font-weight: 600;
  color: var(--text);
  margin: 4px 0 0;
  font-variant-numeric: tabular-nums;
}
.stat-hint {
  font-size: 12px;
  color: var(--text-mute);
  margin: 4px 0 0;
}
</style>