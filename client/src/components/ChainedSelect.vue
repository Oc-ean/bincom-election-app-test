<script setup>
import { ref, watch, onMounted } from 'vue';
import api from '../api';
import AppSelect from './ui/AppSelect.vue';
import { MapPin, Layers, Building2 } from 'lucide-vue-next';

const props = defineProps({
  modelValue: { type: [Number, String, null], default: null },
  showPollingUnit: { type: Boolean, default: true }
});
const emit = defineEmits(['update:modelValue', 'selected']);

const lgas = ref([]);
const wards = ref([]);
const pollingUnits = ref([]);

const selectedLga = ref('');
const selectedWard = ref('');
const selectedPu = ref('');

const loadingLgas = ref(false);
const loadingWards = ref(false);
const loadingPus = ref(false);

onMounted(async () => {
  loadingLgas.value = true;
  try { lgas.value = await api.getLgas(); }
  finally { loadingLgas.value = false; }
});

watch(selectedLga, async (lgaId) => {
  wards.value = [];
  pollingUnits.value = [];
  selectedWard.value = '';
  selectedPu.value = '';
  if (!lgaId) return;
  loadingWards.value = true;
  try { wards.value = await api.getWards(lgaId); }
  finally { loadingWards.value = false; }
});

watch(selectedWard, async (wardId) => {
  pollingUnits.value = [];
  selectedPu.value = '';
  if (!wardId) return;
  if (!props.showPollingUnit) {
    emit('update:modelValue', wardId);
    emit('selected', { wardId });
    return;
  }
  loadingPus.value = true;
  try { pollingUnits.value = await api.getPollingUnits(wardId); }
  finally { loadingPus.value = false; }
});

watch(selectedPu, (puId) => {
  if (puId) {
    emit('update:modelValue', puId);
    emit('selected', { puId });
  }
});
</script>

<template>
  <div class="chain" :class="{ 'chain-2': !showPollingUnit }">
    <AppSelect
      v-model="selectedLga"
      label="Local Government Area"
      :disabled="loadingLgas"
    >
      <option value="">{{ loadingLgas ? 'Loading…' : 'Select LGA' }}</option>
      <option v-for="l in lgas" :key="l.uniqueid" :value="l.lga_id">
        {{ l.lga_name }}
      </option>
    </AppSelect>

    <AppSelect
      v-model="selectedWard"
      label="Ward"
      :disabled="!selectedLga || loadingWards"
    >
      <option value="">
        {{ !selectedLga ? 'Select LGA first' : (loadingWards ? 'Loading…' : 'Select Ward') }}
      </option>
      <option v-for="w in wards" :key="w.uniqueid" :value="w.ward_id">
        {{ w.ward_name }}
      </option>
    </AppSelect>

    <AppSelect
      v-if="showPollingUnit"
      v-model="selectedPu"
      label="Polling Unit"
      :disabled="!selectedWard || loadingPus"
    >
      <option value="">
        {{ !selectedWard ? 'Select Ward first' : (loadingPus ? 'Loading…' : 'Select Polling Unit') }}
      </option>
      <option v-for="p in pollingUnits" :key="p.uniqueid" :value="p.uniqueid">
        {{ p.polling_unit_name }} · #{{ p.uniqueid }}
      </option>
    </AppSelect>
  </div>
</template>

<style scoped>
.chain {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}
.chain-2 { grid-template-columns: repeat(2, 1fr); }
@media (max-width: 860px) {
  .chain, .chain-2 { grid-template-columns: 1fr; }
}
</style>