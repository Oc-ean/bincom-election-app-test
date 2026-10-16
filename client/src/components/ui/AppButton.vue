<script setup>
defineProps({
  variant: { type: String, default: 'primary' }, 
  size: { type: String, default: 'md' },         
  icon: Object,
  loading: Boolean,
  disabled: Boolean,
  type: { type: String, default: 'button' }
});
</script>

<template>
  <button
    :type="type"
    class="btn"
    :class="[`btn-${variant}`, `btn-${size}`, { 'is-loading': loading }]"
    :disabled="disabled || loading"
  >
    <span v-if="loading" class="spinner" />
    <component :is="icon" v-else-if="icon" :size="size === 'sm' ? 14 : 16" />
    <span class="btn-label"><slot /></span>
  </button>
</template>

<style scoped>
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border-radius: 8px;
  font-weight: 500;
  font-size: 13.5px;
  border: 1px solid transparent;
  cursor: pointer;
  transition: background .12s, border-color .12s, color .12s, box-shadow .12s;
  white-space: nowrap;
}
.btn:disabled { opacity: .6; cursor: not-allowed; }

.btn-md { height: 40px; padding: 0 16px; }
.btn-sm { height: 32px; padding: 0 12px; font-size: 12.5px; }

.btn-primary {
  background: var(--brand-600);
  color: white;
  box-shadow: var(--shadow-xs);
}
.btn-primary:hover:not(:disabled) { background: var(--brand-700); }

.btn-secondary {
  background: var(--bg-surface);
  color: var(--text);
  border-color: var(--border-strong);
}
.btn-secondary:hover:not(:disabled) { background: var(--bg-hover); }

.btn-ghost {
  background: transparent;
  color: var(--text-soft);
}
.btn-ghost:hover:not(:disabled) { background: var(--bg-hover); color: var(--text); }

.btn-danger {
  background: var(--danger-500);
  color: white;
}
.btn-danger:hover:not(:disabled) { background: var(--danger-700); }

.spinner {
  width: 14px; height: 14px;
  border: 2px solid currentColor;
  border-right-color: transparent;
  border-radius: 50%;
  animation: spin .6s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }
</style>