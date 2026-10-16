import express from 'express';
import { supabase } from '../supabaseClient.js';

const router = express.Router();

router.get('/lgas', async (req, res) => {
  const { data, error } = await supabase
    .from('lga')
    .select('uniqueid, lga_id, lga_name, state_id')
    .eq('state_id', 25)
    .order('lga_name');

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

router.get('/wards/:lga_id', async (req, res) => {
  const lgaId = parseInt(req.params.lga_id, 10);
  if (Number.isNaN(lgaId)) {
    return res.status(400).json({ error: 'Invalid lga_id' });
  }

  const { data, error } = await supabase
    .from('ward')
    .select('uniqueid, ward_id, ward_name, lga_id')
    .eq('lga_id', lgaId)
    .order('ward_name');

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});


router.get('/polling-units/:ward_id', async (req, res) => {
  const wardId = parseInt(req.params.ward_id, 10);
  if (Number.isNaN(wardId)) {
    return res.status(400).json({ error: 'Invalid ward_id' });
  }

  const { data, error } = await supabase
    .from('polling_unit')
    .select('uniqueid, polling_unit_name, polling_unit_number, ward_id, lga_id')
    .eq('ward_id', wardId)
    .not('polling_unit_name', 'is', null)
    .neq('polling_unit_name', '')
    .order('polling_unit_name');

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

router.get('/parties', async (req, res) => {
  const { data, error } = await supabase
    .from('party')
    .select('id, partyid, partyname')
    .order('id');

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

export default router;