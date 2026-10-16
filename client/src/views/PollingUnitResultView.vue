<script setup>
import { ref } from 'vue';
import { Search, ListChecks, Hash } from 'lucide-vue-next';
import api from '../api';
import ChainedSelect from '../components/ChainedSelect.vue';
import AppCard from '../components/ui/AppCard.vue';
import EmptyState from '../components/ui/EmptyState.vue';
import StatTile from '../components/ui/StatTile.vue';

const selectedPuId = ref(null);
const loading = ref(false);
const error = ref('');
const data = ref(null);

async function onSelected({ puId }) {
  if (!puId) return;
  loading.value = true;
  error.value = '';
  data.value = null;
  try {
    data.value = await api.getPollingUnitResult(puId);
  } catch (e) {
    error.value = e?.response?.data?.error || e.message || 'Failed to load result';
  } finally {
    loading.value = false;
  }
}

function totalVotes() {
  return (data.value?.results || []).reduce((s, r) => s + Number(r.party_score || 0), 0);
}
</script>

<template>
  <div class="stack">
    <AppCard
      title="Select Polling Unit"
      subtitle="Use the chained selectors — LGA → Ward → Polling Unit."
    >
      <ChainedSelect v-model="selectedPuId" @selected="onSelected" />
    </AppCard>

    <div v-if="loading" class="alert alert-info">Loading…</div>
    <div v-if="error" class="alert alert-error">{{ error }}</div>

    <template v-if="data">
      <div class="stat-row">
        <StatTile
          label="Polling Unit ID"
          :value="'#' + data.polling_unit.uniqueid"
          :icon="Hash"
          tone="brand"
        />
        <StatTile
          label="Parties Recorded"
          :value="data.results.length"
          :icon="ListChecks"
          tone="neutral"
        />
        <StatTile
          label="Total Votes"
          :value="totalVotes().toLocaleString()"
          :icon="Search"
          tone="success"
        />
      </div>

      <AppCard
        :title="data.polling_unit.polling_unit_name || 'Unnamed Polling Unit'"
        subtitle="Vote breakdown by party"
      >
        <EmptyState
          v-if="!data.results.length"
          title="No results recorded"
          description="This polling unit does not have any party results yet."
        />
        <div v-else class="table-wrap">
          <table class="tbl">
            <thead>
              <tr>
                <th>Party</th>
                <th class="num">Score</th>
                <th class="num">Share</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="r in data.results" :key="r.party_abbreviation">
                <td><span class="party-pill">{{ r.party_abbreviation }}</span></td>
                <td class="num">{{ r.party_score.toLocaleString() }}</td>
                <td class="num muted">
                  {{ totalVotes() ? ((r.party_score / totalVotes()) * 100).toFixed(1) + '%' : '0%' }}
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td><strong>Total</strong></td>
                <td class="num"><strong>{{ totalVotes().toLocaleString() }}</strong></td>
                <td class="num muted">100%</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </AppCard>
    </template>

    <EmptyState
      v-else-if="!loading && !error"
      title="Nothing selected yet"
      description="Choose a polling unit above to see its result."
    />
  </div>
</template>

<style scoped>
.stat-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}
@media (max-width: 860px) { .stat-row { grid-template-columns: 1fr; } }

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
.tbl tfoot td {
  border-bottom: none;
  border-top: 2px solid var(--border);
  background: var(--bg-subtle);
}
.party-pill {
  display: inline-block;
  padding: 3px 8px;
  border-radius: 6px;
  background: var(--brand-50);
  color: var(--brand-700);
  font-weight: 600;
  font-size: 12px;
  letter-spacing: .02em;
}
</style>