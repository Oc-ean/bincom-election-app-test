<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { Menu, Bell } from 'lucide-vue-next';

defineEmits(['menu']);
const route = useRoute();

const pageMeta = computed(() => {
  const map = {
    '/':                { title: 'Overview',           sub: 'Choose a task to begin' },
    '/polling-unit':    { title: 'Polling Unit Result', sub: 'Question 1 · Individual polling unit breakdown' },
    '/lga-sum':         { title: 'LGA Total',          sub: 'Question 2 · Summed across all polling units' },
    '/add-polling-unit':{ title: 'Add Polling Unit',   sub: 'Question 3 · Record new results for all parties' }
  };
  return map[route.path] || { title: 'Bincom', sub: '' };
});
</script>

<template>
  <header class="tb">
    <button class="tb-menu" aria-label="Open menu" @click="$emit('menu')">
      <Menu :size="20" />
    </button>

    <div class="tb-meta">
      <h2 class="tb-title">{{ pageMeta.title }}</h2>
      <p v-if="pageMeta.sub" class="tb-sub">{{ pageMeta.sub }}</p>
    </div>

    <div class="tb-actions">
      <button class="tb-icon-btn" aria-label="Notifications">
        <Bell :size="18" />
      </button>
      <div class="tb-avatar" title="Assessor">BA</div>
    </div>
  </header>
</template>

<style scoped>
.tb {
  height: var(--topbar-h);
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 0 32px;
  background: var(--bg-surface);
  border-bottom: 1px solid var(--border);
  position: sticky;
  top: 0;
  z-index: 5;
}

.tb-menu {
  display: none;
  width: 40px; height: 40px;
  border-radius: 8px;
  background: transparent;
  border: 1px solid var(--border);
  color: var(--text-soft);
  cursor: pointer;
  align-items: center;
  justify-content: center;
}
.tb-menu:hover { background: var(--bg-hover); color: var(--text); }

.tb-meta { flex: 1; min-width: 0; }
.tb-title { font-size: 16px; font-weight: 600; }
.tb-sub {
  font-size: 12px;
  color: var(--text-mute);
  margin: 2px 0 0;
}

.tb-actions { display: flex; align-items: center; gap: 10px; }
.tb-icon-btn {
  width: 36px; height: 36px;
  border-radius: 8px;
  background: transparent;
  border: 1px solid var(--border);
  color: var(--text-soft);
  cursor: pointer;
  display: grid; place-items: center;
}
.tb-icon-btn:hover { background: var(--bg-hover); color: var(--text); }
.tb-avatar {
  width: 36px; height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--brand-500), var(--brand-700));
  color: white;
  font-size: 12px;
  font-weight: 700;
  display: grid; place-items: center;
  box-shadow: var(--shadow-xs);
}

@media (max-width: 1023px) {
  .tb { padding: 0 16px; }
  .tb-menu { display: inline-flex; }
  .tb-sub { display: none; }
}
</style>