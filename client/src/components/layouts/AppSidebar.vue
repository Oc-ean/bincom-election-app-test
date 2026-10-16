<script setup>
import { RouterLink } from 'vue-router';
import {
  Vote, LayoutDashboard, Search, Sigma, FilePlus2, Github
} from 'lucide-vue-next';

const nav = [
  { to: '/',             label: 'Overview',       icon: LayoutDashboard, exact: true },
  { to: '/polling-unit', label: 'Polling Unit',   icon: Search,           },
  { to: '/lga-sum',      label: 'LGA Total',      icon: Sigma,            },
  { to: '/add-polling-unit', label: 'Add Polling Unit', icon: FilePlus2,  }
];
</script>

<template>
  <div class="sb">
    <div class="sb-brand">
      <div class="sb-logo"><Vote :size="18" /></div>
      <div class="sb-brand-text">
        <span class="sb-brand-title">Bincom</span>
        <span class="sb-brand-sub">Election Results</span>
      </div>
    </div>

    <nav class="sb-nav">
      <p class="sb-section">Workspace</p>
      <RouterLink
        v-for="item in nav"
        :key="item.to"
        :to="item.to"
        class="sb-link"
        :class="{ 'is-active': item.exact ? $route.path === item.to : $route.path.startsWith(item.to) }"
      >
        <component :is="item.icon" :size="16" class="sb-icon" />
        <span class="sb-label">{{ item.label }}</span>
      </RouterLink>
    </nav>

    <div class="sb-footer">
      <a class="sb-meta" href="#" @click.prevent>
        <Github :size="14" />
        <span>Source</span>
      </a>
      <p class="sb-version">v1.0 · 2011 Delta State</p>
    </div>
  </div>
</template>

<style scoped>
.sb {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 20px 16px;
}

.sb-brand {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 4px 8px 20px;
  border-bottom: 1px solid var(--border);
  margin-bottom: 20px;
}

.sb-logo {
  width: 36px; height: 36px;
  border-radius: 10px;
  background: linear-gradient(135deg, var(--brand-500), var(--brand-700));
  color: white;
  display: grid; place-items: center;
  box-shadow: var(--shadow-sm);
  flex-shrink: 0;
}

.sb-brand-text { display: flex; flex-direction: column; line-height: 1.15; }
.sb-brand-title { font-weight: 700; font-size: 14px; color: var(--text); }
.sb-brand-sub { font-size: 12px; color: var(--text-mute); }

.sb-section {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: .08em;
  color: var(--text-mute);
  font-weight: 600;
  padding: 0 10px;
  margin: 0 0 8px;
}

.sb-nav { display: flex; flex-direction: column; gap: 2px; flex: 1; }

.sb-link {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 10px;
  border-radius: 8px;
  color: var(--text-soft);
  font-weight: 500;
  font-size: 13.5px;
  transition: background .12s, color .12s;
  position: relative;
}
.sb-link:hover {
  background: var(--bg-hover);
  color: var(--text);
}
.sb-link.is-active {
  background: var(--brand-50);
  color: var(--brand-700);
}
.sb-link.is-active::before {
  content: '';
  position: absolute;
  left: -16px;
  top: 8px; bottom: 8px;
  width: 3px;
  border-radius: 0 3px 3px 0;
  background: var(--brand-500);
}
.sb-icon { flex-shrink: 0; }
.sb-label { flex: 1; }

.sb-tag {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: .04em;
  padding: 2px 6px;
  border-radius: 5px;
  background: var(--bg-subtle);
  color: var(--text-mute);
}
.sb-link.is-active .sb-tag {
  background: var(--brand-100);
  color: var(--brand-700);
}

.sb-footer {
  padding-top: 16px;
  border-top: 1px solid var(--border);
  margin-top: 16px;
}
.sb-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 10px;
  border-radius: 6px;
  color: var(--text-soft);
  font-size: 13px;
}
.sb-meta:hover { background: var(--bg-hover); color: var(--text); }
.sb-version {
  font-size: 11px;
  color: var(--text-mute);
  padding: 8px 10px 0;
  margin: 0;
}
</style>