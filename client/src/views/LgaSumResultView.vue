<script setup>
import { ref, onMounted } from 'vue';
import { Sigma, CheckCircle2, AlertTriangle } from 'lucide-vue-next';
import api from '../api';
import AppCard from '../components/ui/AppCard.vue';
import AppSelect from '../components/ui/AppSelect.vue';
import EmptyState from '../components/ui/EmptyState.vue';

const lgas = ref([]);
const selectedLga = ref('');
const loading = ref(false);
const error = ref('');
const data = ref(null);

onMounted(async () => { lgas.value = await api.getLgas(); });

async function onLgaChange() {
  data.value = null;
  error.value = '';
  if (!selectedLga.value) return;
  loading.value = true;
  try {
    data.value = await api.getLgaSum(selectedLga.value);
  } catch (e) {
    error.value = e?.response?.data?.error || e.message || 'Failed to load LGA total';
  } finally {
    loading.value = false;
  }
}

function announcedScore(party) {
  const found = data.value?.announced?.find(
    a => a.party_abbreviation.trim() === party.trim()
  );
  return found ? found.party_score : null;
}
</script>

<template>
  <div class="stack">
    <AppCard
      title="Select Local Government Area"
      subtitle="The total is computed by summing individual polling unit results — not from the announced LGA table."
    >
      <div class="selector">
        <AppSelect v-model="selectedLga" label="LGA" @change="onLgaChange">
          <option value="">Select LGA</option>
          <option v-for="l in lgas" :key="l.uniqueid" :value="l.lga_id">
            {{ l.lga_name }}
          </option>
        </AppSelect>
      </div>
    </AppCard>

    <div v-if="loading" class="alert alert-info">Loading…</div>
    <div v-if="error" class="alert alert-error">{{ error }}</div>

    <template v-if="data">
      <div class="info-bar">
        <div class="info-item">
          <span class="info-label">LGA</span>
          <span class="info-value">{{ data.lga.lga_name }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">Polling Units</span>
          <span class="info-value">{{ data.polling_unit_count }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">Parties</span>
          <span class="info-value">{{ data.summed.length }}</span>
        </div>
      </div>

      <AppCard
        title="Summed Polling Unit Results"
        subtitle="Computed total vs officially announced figure"
      >
        <EmptyState
          v-if="!data.summed.length"
          title="No polling unit results"
          description="No polling units under this LGA have recorded results in the dataset."
          :icon="AlertTriangle"
        />
        <div v-else class="table-wrap">
          <table class="tbl">
            <thead>
              <tr>
                <th>Party</th>
                <th class="num">Summed Total</th>
                <th class="num">Announced</th>
                <th class="num">Difference</th>
                <th class="num">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in data.summed" :key="row.party_abbreviation">
                <td><span class="party-pill">{{ row.party_abbreviation }}</span></td>
                <td class="num">{{ row.total.toLocaleString() }}</td>
                <td class="num muted">
                  {{ announcedScore(row.party_abbreviation)?.toLocaleString() ?? '—' }}
                </td>
                <td class="num">
                  <template v-if="announcedScore(row.party_abbreviation) !== null">
                    {{ (row.total - announcedScore(row.party_abbreviation)).toLocaleString() }}
                  </template>
                  <template v-else>—</template>
                </td>
                <td class="num">
                  <template v-if="announcedScore(row.party_abbreviation) !== null">
                    <CheckCircle2
                      v-if="row.total === announcedScore(row.party_abbreviation)"
                      :size="16"
                      class="ok"
                    />
                    <AlertTriangle v-else :size="16" class="warn" />
                  </template>
                  <template v-else>—</template>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </AppCard>
    </template>

    <EmptyState
      v-else-if="!loading && !error"
      title="No LGA selected"
      description="Pick a Local Government Area above to see its summed results."
      :icon="Sigma"
    />
  </div>
</template>

<style scoped>
.selector { max-width: 380px; }

.info-bar {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  background: var(--bg-surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 16px 20px;
  box-shadow: var(--shadow-xs);
}
@media (max-width: 720px) { .info-bar { grid-template-columns: 1fr; } }

.info-item { display: flex; flex-direction: column; gap: 4px; }
.info-label {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: .06em;
  color: var(--text-mute);
  font-weight: 600;
}
.info-value { font-size: 15px; font-weight: 600; color: var(--text); }

.table-wrap { overflow-x: auto; }
.tbl {
  width: 100%;
  border-collapse: collapse;
  font-size: 13.5px;
  font-variant-numeric: tabular-nums;
}
.tbl th, .tbl td {
  text-align: left;
  padding: 12px 16px;
  border-bottom: 1px solid var(--border);
}
.tbl th {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: .06em;
  color: var(--text-mute);
  font-weight: 600;
  background: var(--bg-subtle);
}
.tbl .num { text-align: right; }
.tbl tbody tr:hover td { background: var(--bg-hover); }
.party-pill {
  display: inline-block;
  padding: 3px 8px;
  border-radius: 6px;
  background: var(--brand-50);
  color: var(--brand-700);
  font-weight: 600;
  font-size: 12px;
}
.ok   { color: var(--success-500); vertical-align: middle; }
.warn { color: var(--warn-500);    vertical-align: middle; }
</style>