import express from 'express';
import { supabase } from '../supabaseClient.js';

const router = express.Router();


router.post('/polling-unit', async (req, res) => {
  const { polling_unit, results } = req.body || {};

  if (!polling_unit || !polling_unit.polling_unit_name) {
    return res.status(400).json({ error: 'polling_unit.polling_unit_name is required' });
  }
  if (!Array.isArray(results) || results.length === 0) {
    return res.status(400).json({ error: 'At least one party result is required' });
  }

  const ip = (req.headers['x-forwarded-for'] || req.socket.remoteAddress || '').toString();
  const now = new Date().toISOString();

  // Insert the polling unit. We let Postgres assign uniqueid via identity.
  const { data: insertedPu, error: puErr } = await supabase
    .from('polling_unit')
    .insert({
      polling_unit_id: polling_unit.polling_unit_id ?? 0,
      ward_id: polling_unit.ward_id ?? 0,
      lga_id: polling_unit.lga_id ?? 0,
      uniquewardid: polling_unit.uniquewardid ?? null,
      polling_unit_number: polling_unit.polling_unit_number ?? null,
      polling_unit_name: polling_unit.polling_unit_name,
      polling_unit_description: polling_unit.polling_unit_description ?? null,
      lat: polling_unit.lat ?? null,
      long: polling_unit.long ?? null,
      entered_by_user: polling_unit.entered_by_user ?? 'web',
      date_entered: now,
      user_ip_address: ip
    })
    .select('uniqueid')
    .single();

  if (puErr) {
    return res.status(500).json({ error: 'Failed to insert polling unit', detail: puErr.message });
  }

  const newUniqueId = insertedPu.uniqueid;

  // 2. Insert one row per party.
  const resultRows = results
    .filter(r => r && r.party_abbreviation && Number.isFinite(Number(r.party_score)))
    .map(r => ({
      polling_unit_uniqueid: String(newUniqueId),
      party_abbreviation: r.party_abbreviation,
      party_score: Number(r.party_score),
      entered_by_user: polling_unit.entered_by_user ?? 'web',
      date_entered: now,
      user_ip_address: ip
    }));

  if (resultRows.length === 0) {
    return res.status(400).json({ error: 'No valid party results provided' });
  }

  const { error: resErr } = await supabase
    .from('announced_pu_results')
    .insert(resultRows);

  if (resErr) {
    return res.status(500).json({
      error: 'Polling unit saved but results failed',
      detail: resErr.message,
      polling_unit_uniqueid: newUniqueId
    });
  }

  res.status(201).json({
    message: 'Polling unit and results saved',
    polling_unit_uniqueid: newUniqueId,
    parties_saved: resultRows.length
  });
});

export default router;