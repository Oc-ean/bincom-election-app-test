<script setup>
import { ref, onMounted } from 'vue';
import { Save, CheckCircle2, Info } from 'lucide-vue-next';
import api from '../api';
import ChainedSelect from '../components/ChainedSelect.vue';
import AppCard from '../components/ui/AppCard.vue';
import AppInput from '../components/ui/AppInput.vue';
import AppButton from '../components/ui/AppButton.vue';

const parties = ref([]);
const loadingParties = ref(true);
const submitting = ref(false);
const error = ref('');
const success = ref(null);

const form = ref({
  polling_unit_name: '',
  polling_unit_number: '',
  polling_unit_description: '',
  ward_id: null,
  lga_id: null,
  lat: '',
  long: '',
  entered_by_user: 'web'
});

const scores = ref({});

onMounted(async () => {
  try {
    parties.value = await api.getParties();
    parties.value.forEach(p => { scores.value[p.partyid] = 0; });
  } finally {
    loadingParties.value = false;
  }
});

function onWardSelected({ wardId }) {
  form.value.ward_id = wardId;
}

async function submit() {
  error.value = '';
  success.value = null;

  if (!form.value.polling_unit_name.trim()) {
    error.value = 'Polling unit name is required.';
    return;
  }
  if (!form.value.ward_id) {
    error.value = 'Please select an LGA and Ward.';
    return;
  }

  const results = parties.value.map(p => ({
    party_abbreviation: p.partyid,
    party_score: Number(scores.value[p.partyid] || 0)
  }));

  submitting.value = true;
  try {
    const payload = {
      polling_unit: {
        ...form.value,
        polling_unit_id: 0,
        lga_id: form.value.lga_id || 0
      },
      results
    };
    success.value = await api.addPollingUnit(payload);
    form.value.polling_unit_name = '';
    form.value.polling_unit_number = '';
    form.value.polling_unit_description = '';
    form.value.lat = '';
    form.value.long = '';
    parties.value.forEach(p => { scores.value[p.partyid] = 0; });
  } catch (e) {
    error.value = e?.response?.data?.error || e.message || 'Failed to save';
  } finally {
    submitting.value = false;
  }
}
</script>

<template>
  <div class="stack">
    <div v-if="success" class="alert alert-success">
      <CheckCircle2 :size="16" style="vertical-align: middle; margin-right: 6px;" />
      Saved! New polling unit <strong>#{{ success.polling_unit_uniqueid }}</strong> created
      with {{ success.parties_saved }} party results.
    </div>
    <div v-if="error" class="alert alert-error">{{ error }}</div>

    <AppCard
      title="1. Location"
      subtitle="Select the ward under which this new polling unit belongs."
    >
      <ChainedSelect :show-polling-unit="false" @selected="onWardSelected" />
    </AppCard>

    <AppCard
      title="2. Polling Unit Details"
      subtitle="Identify and describe the polling unit."
    >
      <div class="stack">
        <AppInput
          v-model="form.polling_unit_name"
          label="Polling Unit Name *"
          placeholder="e.g. Central Primary School Hall"
        />

        <div class="grid-2">
          <AppInput
            v-model="form.polling_unit_number"
            label="Polling Unit Number"
            placeholder="e.g. DT1901001"
          />
          <AppInput
            v-model="form.entered_by_user"
            label="Entered By"
            placeholder="Your name"
          />
        </div>

        <div class="field">
          <label class="lbl">Description</label>
          <textarea
            class="txt"
            rows="2"
            v-model="form.polling_unit_description"
            placeholder="Optional description"
          />
        </div>

        <div class="grid-2">
          <AppInput v-model="form.lat"  label="Latitude"  placeholder="e.g. 5.5985" />
          <AppInput v-model="form.long" label="Longitude" placeholder="e.g. 5.9993" />
        </div>
      </div>
    </AppCard>

    <AppCard
      title="3. Party Scores"
      subtitle="Enter the vote count for every party. Default is 0."
    >
      <div class="banner">
        <Info :size="14" />
        <span>Fill in any non-zero scores. All values will be stored, including 0.</span>
      </div>

      <div v-if="loadingParties" class="alert alert-info">Loading parties…</div>
      <div v-else class="scores-grid">
        <AppInput
          v-for="p in parties"
          :key="p.id"
          :label="p.partyname"
          type="number"
          :model-value="scores[p.partyid]"
          @update:model-value="v => scores[p.partyid] = Number(v)"
        />
      </div>
    </AppCard>

    <div class="actions">
      <AppButton
        variant="primary"
        :icon="Save"
        :loading="submitting"
        @click="submit"
      >
        {{ submitting ? 'Saving…' : 'Save Polling Unit & Results' }}
      </AppButton>
    </div>
  </div>
</template>

<style scoped>
.lbl {
  display: block;
  font-size: 12.5px;
  font-weight: 500;
  color: var(--text-soft);
  margin-bottom: 6px;
}
.field { display: flex; flex-direction: column; }
.txt {
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid var(--border-strong);
  background: var(--bg-surface);
  font-size: 13.5px;
  resize: vertical;
  color: var(--text);
}
.txt:focus {
  outline: none;
  border-color: var(--brand-500);
  box-shadow: 0 0 0 3px var(--brand-50);
}

.banner {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  background: var(--brand-50);
  color: var(--brand-700);
  border-radius: 8px;
  font-size: 12.5px;
  margin-bottom: 18px;
}

.scores-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 14px;
}

.actions { display: flex; justify-content: flex-end; padding-bottom: 20px; }
</style>