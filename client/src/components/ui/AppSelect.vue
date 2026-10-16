<script setup>
import { ChevronDown } from 'lucide-vue-next';
defineProps({
  modelValue: [String, Number, null],
  label: String,
  disabled: Boolean,
  hint: String
});
defineEmits(['update:modelValue', 'change']);
</script>

<template>
  <div class="fld">
    <label v-if="label" class="fld-label">{{ label }}</label>
    <div class="sel-wrap">
      <select
        class="sel"
        :value="modelValue"
        :disabled="disabled"
        @change="$emit('update:modelValue', $event.target.value); $emit('change', $event)"
      >
        <slot />
      </select>
      <ChevronDown :size="16" class="sel-icon" />
    </div>
    <p v-if="hint" class="fld-hint">{{ hint }}</p>
  </div>
</template>

<style scoped>
.fld { display: flex; flex-direction: column; gap: 6px; }
.fld-label { font-size: 12.5px; font-weight: 500; color: var(--text-soft); }
.sel-wrap { position: relative; }
.sel {
  width: 100%;
  height: 40px;
  padding: 0 36px 0 12px;
  border-radius: 8px;
  border: 1px solid var(--border-strong);
  background: var(--bg-surface);
  font-size: 13.5px;
  color: var(--text);
  appearance: none;
  cursor: pointer;
  transition: border-color .12s, box-shadow .12s;
}
.sel:hover:not(:disabled) { border-color: var(--border-strong); }
.sel:focus {
  outline: none;
  border-color: var(--brand-500);
  box-shadow: 0 0 0 3px var(--brand-50);
}
.sel:disabled { background: var(--bg-subtle); color: var(--text-mute); cursor: not-allowed; }
.sel-icon {
  position: absolute;
  right: 12px; top: 50%;
  transform: translateY(-50%);
  color: var(--text-mute);
  pointer-events: none;
}
.fld-hint { font-size: 12px; color: var(--text-mute); margin: 0; }
</style>