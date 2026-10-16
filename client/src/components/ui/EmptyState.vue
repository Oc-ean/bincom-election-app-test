<script setup>
import { Inbox } from 'lucide-vue-next';
defineProps({
  title: { type: String, default: 'Nothing here yet' },
  description: String,
  icon: { type: Object, default: () => Inbox }
});
</script>

<template>
  <div class="empty">
    <div class="empty-icon"><component :is="icon" :size="22" /></div>
    <h4 class="empty-title">{{ title }}</h4>
    <p v-if="description" class="empty-desc">{{ description }}</p>
    <div v-if="$slots.default" class="empty-actions"><slot /></div>
  </div>
</template>

<style scoped>
.empty {
  padding: 40px 20px;
  text-align: center;
  border: 1px dashed var(--border-strong);
  border-radius: var(--radius);
  background: var(--bg-subtle);
}
.empty-icon {
  width: 44px; height: 44px;
  border-radius: 12px;
  background: white;
  border: 1px solid var(--border);
  display: grid; place-items: center;
  margin: 0 auto 12px;
  color: var(--text-mute);
}
.empty-title { font-size: 14px; margin-bottom: 4px; }
.empty-desc { font-size: 13px; color: var(--text-mute); margin: 0 auto; max-width: 360px; }
.empty-actions { margin-top: 16px; }
</style>