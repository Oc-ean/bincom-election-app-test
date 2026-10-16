import express from 'express';
import { supabase } from '../supabaseClient.js';

const router = express.Router();


router.get('/polling-unit-result/:uniqueid', async (req, res) => {
  const uniqueid = parseInt(req.params.uniqueid, 10);
  if (Number.isNaN(uniqueid)) {
    return res.status(400).json({ error: 'Invalid polling unit uniqueid' });
  }

  const { data: pu, error: puErr } = await supabase
    .from('polling_unit')
    .select('uniqueid, polling_unit_name, polling_unit_number, ward_id, lga_id')
    .eq('uniqueid', uniqueid)
    .single();

  if (puErr) return res.status(404).json({ error: 'Polling unit not found' });

  const { data: results, error: resErr } = await supabase
    .from('announced_pu_results')
    .select('party_abbreviation, party_score')
    .eq('polling_unit_uniqueid', String(uniqueid))
    .order('party_abbreviation');

  if (resErr) return res.status(500).json({ error: resErr.message });

  res.json({
    polling_unit: pu,
    results: results || []
  });
});


router.get('/lga-sum/:lga_id', async (req, res) => {
  const lgaId = parseInt(req.params.lga_id, 10);
  if (Number.isNaN(lgaId)) {
    return res.status(400).json({ error: 'Invalid lga_id' });
  }

  const { data: lga, error: lgaErr } = await supabase
    .from('lga')
    .select('uniqueid, lga_id, lga_name, state_id')
    .eq('lga_id', lgaId)
    .single();

  if (lgaErr) return res.status(404).json({ error: 'LGA not found' });

  const { data: pus, error: puErr } = await supabase
    .from('polling_unit')
    .select('uniqueid')
    .eq('lga_id', lgaId);

  if (puErr) return res.status(500).json({ error: puErr.message });

  const puIds = (pus || []).map(p => String(p.uniqueid));

  if (puIds.length === 0) {
    return res.json({
      lga,
      summed: [],
      announced: [],
      message: 'No polling units found for this LGA'
    });
  }

  const { data: rows, error: rowsErr } = await supabase
    .from('announced_pu_results')
    .select('party_abbreviation, party_score')
    .in('polling_unit_uniqueid', puIds);

  if (rowsErr) return res.status(500).json({ error: rowsErr.message });


  const summedMap = {};
  for (const row of rows || []) {
    const key = row.party_abbreviation.trim();
    summedMap[key] = (summedMap[key] || 0) + row.party_score;
  }
  const summed = Object.entries(summedMap)
    .map(([party_abbreviation, total]) => ({ party_abbreviation, total }))
    .sort((a, b) => a.party_abbreviation.localeCompare(b.party_abbreviation));

  const { data: announced } = await supabase
    .from('announced_lga_results')
    .select('party_abbreviation, party_score')
    .eq('lga_name', String(lgaId))
    .order('party_abbreviation');

  res.json({
    lga,
    polling_unit_count: puIds.length,
    summed,
    announced: announced || []
  });
});

export default router;