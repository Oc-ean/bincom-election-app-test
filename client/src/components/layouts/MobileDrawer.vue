<script setup>
import { watch } from 'vue';
import AppSidebar from './AppSidebar.vue';
import { X } from 'lucide-vue-next';

const props = defineProps({ open: Boolean });
const emit = defineEmits(['close']);

watch(() => props.open, (v) => {
  document.body.style.overflow = v ? 'hidden' : '';
});

function onBackdrop(e) {
  if (e.target === e.currentTarget) emit('close');
}
</script>

<template>
  <Transition name="drawer">
    <div v-if="open" class="drawer-backdrop" @click="onBackdrop">
      <aside class="drawer" @click.stop>
        <div class="drawer-head">
          <button class="drawer-close" @click="$emit('close')" aria-label="Close">
            <X :size="18" />
          </button>
        </div>
        <AppSidebar />
      </aside>
    </div>
  </Transition>
</template>

<style scoped>
.drawer-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(16,24,40,.5);
  backdrop-filter: blur(2px);
  z-index: 100;
  display: flex;
}
.drawer {
  width: 280px;
  max-width: 85vw;
  background: var(--bg-surface);
  height: 100%;
  display: flex;
  flex-direction: column;
  box-shadow: var(--shadow-lg);
}
.drawer-head {
  display: flex;
  justify-content: flex-end;
  padding: 12px 12px 0;
}
.drawer-close {
  width: 34px; height: 34px;
  border-radius: 8px;
  background: transparent;
  border: none;
  color: var(--text-soft);
  cursor: pointer;
  display: grid; place-items: center;
}
.drawer-close:hover { background: var(--bg-hover); color: var(--text); }

.drawer-enter-active, .drawer-leave-active { transition: opacity .18s ease; }
.drawer-enter-from, .drawer-leave-to { opacity: 0; }
.drawer-enter-active .drawer, .drawer-leave-active .drawer {
  transition: transform .22s cubic-bezier(.4,0,.2,1);
}
.drawer-enter-from .drawer, .drawer-leave-to .drawer { transform: translateX(-100%); }
</style>