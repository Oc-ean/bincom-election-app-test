<script setup>
defineProps({
  title: String,
  subtitle: String,
  padded: { type: Boolean, default: true }
});
</script>

<template>
  <section class="card">
    <header v-if="title || $slots.header || $slots.actions" class="card-head">
      <div class="card-head-text">
        <h3 v-if="title" class="card-title">{{ title }}</h3>
        <p v-if="subtitle" class="card-sub">{{ subtitle }}</p>
        <slot name="header" />
      </div>
      <div v-if="$slots.actions" class="card-actions">
        <slot name="actions" />
      </div>
    </header>
    <div :class="{ 'card-body': padded }">
      <slot />
    </div>
    <footer v-if="$slots.footer" class="card-foot">
      <slot name="footer" />
    </footer>
  </section>
</template>

<style scoped>
.card {
  background: var(--bg-surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-xs);
  overflow: hidden;
}
.card-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  padding: 20px 24px;
  border-bottom: 1px solid var(--border);
}
.card-title { font-size: 15px; }
.card-sub { font-size: 13px; color: var(--text-mute); margin: 4px 0 0; }
.card-body { padding: 24px; }
.card-actions { display: flex; align-items: center; gap: 8px; flex-shrink: 0; }
.card-foot {
  padding: 14px 24px;
  border-top: 1px solid var(--border);
  background: var(--bg-subtle);
  font-size: 13px;
  color: var(--text-soft);
}
</style>