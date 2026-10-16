<script setup>
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import AppSidebar from '../layouts/AppSidebar.vue';
import AppTopbar from '../layouts/AppTopbar.vue';
import MobileDrawer from '../layouts/MobileDrawer.vue';

const route = useRoute();
const drawerOpen = ref(false);

watch(() => route.fullPath, () => { drawerOpen.value = false; });
</script>

<template>
  <div class="app-shell">
    <!-- Desktop sidebar -->
    <aside class="sidebar-desktop">
      <AppSidebar />
    </aside>

    <!-- Main column -->
    <div class="main-col">
      <AppTopbar @menu="drawerOpen = true" />
      <main class="content">
        <RouterView />
      </main>
      <footer class="app-footer">
        <span>Delta State 2011 Election · Interview Test</span>
      </footer>
    </div>

    <!-- Mobile drawer -->
    <MobileDrawer :open="drawerOpen" @close="drawerOpen = false" />
  </div>
</template>

<style scoped>
.app-shell {
  display: flex;
  min-height: 100vh;
  background: var(--bg-page);
}

.sidebar-desktop {
  width: var(--sidebar-w);
  flex: 0 0 var(--sidebar-w);
  position: sticky;
  top: 0;
  height: 100vh;
  background: var(--bg-surface);
  border-right: 1px solid var(--border);
  display: flex;
  flex-direction: column;
}

.main-col {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.content {
  flex: 1;
  padding: 28px 32px 40px;
  max-width: 1120px;
  width: 100%;
  margin: 0 auto;
}

.app-footer {
  padding: 20px 32px;
  border-top: 1px solid var(--border);
  color: var(--text-mute);
  font-size: 12px;
  text-align: center;
  background: var(--bg-surface);
}

@media (max-width: 1023px) {
  .sidebar-desktop { display: none; }
  .content { padding: 20px 16px 32px; }
  .app-footer { padding: 16px; }
}
</style>