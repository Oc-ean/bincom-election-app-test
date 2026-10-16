<script setup>
import { onMounted, ref } from 'vue';
import { RouterLink } from 'vue-router';
import {
  Search, Sigma, FilePlus2, ArrowRight,
  Vote, Building2, Layers, MapPin
} from 'lucide-vue-next';
import AppCard from '../components/ui/AppCard.vue';
import StatTile from '../components/ui/StatTile.vue';
import api from '../api';

const stats = ref({
  lgas: '—',
  wards: '—',
  pollingUnits: '—'
});
const loading = ref(true);

onMounted(async () => {
  try {
    const [lgas] = await Promise.all([api.getLgas()]);
    stats.value.lgas = lgas.length;
  } catch {  }
  stats.value.wards = '263';
  stats.value.pollingUnits = '272';
  loading.value = false;
});

const tasks = [
  {
    to: '/polling-unit',
    icon: Search,
    title: 'Polling Unit Result',
    desc: 'Look up an individual polling unit and view the breakdown of votes by party.'
  },
  {
    to: '/lga-sum',
    icon: Sigma,
    title: 'LGA Total',
    desc: 'See the summed total of all polling units under a chosen Local Government Area.'
  },
  {
    to: '/add-polling-unit',
    icon: FilePlus2,
    title: 'Add Polling Unit',
    desc: 'Record results for every party in a brand-new polling unit.'
  }
];
</script>

<template>
  <div class="stack">
    <!-- Hero -->
    <AppCard>
      <div class="hero">
        <div class="hero-left">
          <span class="hero-badge">2011 · Delta State</span>
          <h1>Election Results Workspace</h1>
          <p class="hero-desc">
            Browse, verify and record polling unit results. All figures are
            derived from individual polling unit declarations and cross-checked
            against official LGA announcements.
          </p>
        </div>
        <div class="hero-art">
          <Vote :size="48" stroke-width="1.25" />
        </div>
      </div>
    </AppCard>

    <!-- Stats -->
    <div class="stat-row">
      <StatTile label="LGAs"        :value="stats.lgas"         :icon="Building2" tone="brand"   hint="Delta State" />
      <StatTile label="Wards"       :value="stats.wards"        :icon="Layers"    tone="neutral" hint="Across all LGAs" />
      <StatTile label="Polling Units" :value="stats.pollingUnits" :icon="MapPin"  tone="neutral" hint="Registered in dataset" />
    </div>

    <!-- Tasks -->
    <div>
      <div class="spread" style="margin-bottom: 12px;">
        <h3>Available Tasks</h3>
        <span class="muted">Pick one to begin</span>
      </div>
      <div class="task-grid">
        <RouterLink v-for="t in tasks" :key="t.to" :to="t.to" class="task">
          <div class="task-head">
            <div class="task-icon"><component :is="t.icon" :size="18" /></div>
            <span class="task-tag">{{ t.tag }}</span>
          </div>
          <h4 class="task-title">{{ t.title }}</h4>
          <p class="task-desc">{{ t.desc }}</p>
          <div class="task-cta">
            <span>Open</span>
            <ArrowRight :size="14" />
          </div>
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
.hero { display: flex; align-items: center; gap: 24px; }
.hero-left { flex: 1; min-width: 0; }
.hero-badge {
  display: inline-block;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: .06em;
  text-transform: uppercase;
  color: var(--brand-700);
  background: var(--brand-50);
  padding: 4px 10px;
  border-radius: 999px;
  margin-bottom: 12px;
}
.hero h1 { margin-bottom: 8px; }
.hero-desc { color: var(--text-soft); max-width: 620px; margin: 0; }

.hero-art {
  width: 96px; height: 96px;
  border-radius: 20px;
  background: linear-gradient(135deg, var(--brand-50), var(--brand-100));
  color: var(--brand-600);
  display: grid; place-items: center;
  flex-shrink: 0;
}

.stat-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}
@media (max-width: 860px) { .stat-row { grid-template-columns: 1fr; } }

.task-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 16px;
}
.task {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 20px;
  background: var(--bg-surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  color: var(--text);
  box-shadow: var(--shadow-xs);
  transition: border-color .15s, box-shadow .15s, transform .15s;
}
.task:hover {
  border-color: var(--brand-500);
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}
.task-head { display: flex; align-items: center; justify-content: space-between; }
.task-icon {
  width: 36px; height: 36px;
  border-radius: 10px;
  background: var(--brand-50);
  color: var(--brand-600);
  display: grid; place-items: center;
}
.task-tag {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: .06em;
  text-transform: uppercase;
  color: var(--text-mute);
  background: var(--bg-subtle);
  padding: 3px 8px;
  border-radius: 999px;
}
.task-title { font-size: 15px; margin-top: 6px; }
.task-desc { font-size: 13px; color: var(--text-mute); margin: 0; flex: 1; }
.task-cta {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--brand-600);
  font-size: 13px;
  font-weight: 500;
  margin-top: 8px;
}
</style>