<script setup>
defineProps({
  modelValue: [String, Number],
  label: String,
  placeholder: String,
  type: { type: String, default: 'text' },
  hint: String,
  error: String
});
defineEmits(['update:modelValue']);
</script>

<template>
  <div class="fld">
    <label v-if="label" class="fld-label">{{ label }}</label>
    <input
      class="fld-input"
      :class="{ 'has-error': error }"
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      @input="$emit('update:modelValue', $event.target.value)"
    />
    <p v-if="error" class="fld-error">{{ error }}</p>
    <p v-else-if="hint" class="fld-hint">{{ hint }}</p>
  </div>
</template>

<style scoped>
.fld { display: flex; flex-direction: column; gap: 6px; }
.fld-label {
  font-size: 12.5px;
  font-weight: 500;
  color: var(--text-soft);
}
.fld-input {
  height: 40px;
  padding: 0 12px;
  border-radius: 8px;
  border: 1px solid var(--border-strong);
  background: var(--bg-surface);
  font-size: 13.5px;
  color: var(--text);
  transition: border-color .12s, box-shadow .12s;
  width: 100%;
}
.fld-input::placeholder { color: var(--text-mute); }
.fld-input:hover { border-color: var(--border-strong); }
.fld-input:focus {
  outline: none;
  border-color: var(--brand-500);
  box-shadow: 0 0 0 3px var(--brand-50);
}
.fld-input.has-error { border-color: var(--danger-500); }
.fld-error { font-size: 12px; color: var(--danger-700); margin: 0; }
.fld-hint  { font-size: 12px; color: var(--text-mute); margin: 0; }
</style>