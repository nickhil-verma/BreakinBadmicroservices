const express = require('express');
const router = express.Router();
const UserData = require('../models/UserData');

// POST: Add new data (always creates new document)
router.post('/submit', async (req, res) => {
  const { uniqueId, o2, heartRateECG, temperature } = req.body;

  if (!uniqueId || uniqueId.length !== 10) {
    return res.status(400).json({ error: 'Invalid uniqueId' });
  }

  try {
    const newEntry = new UserData({
      uniqueId,
      o2: [o2],
      heartRateECG: [heartRateECG],
      temperature: [temperature]
    });

    await newEntry.save();
    res.status(201).json({ message: 'New data saved successfully' });

  } catch (error) {
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});

// GET: Get all data entries for a specific ID
router.get('/data/:uniqueId', async (req, res) => {
  try {
    const data = await UserData.find({ uniqueId: req.params.uniqueId });
    if (!data || data.length === 0) {
      return res.status(404).json({ error: 'No data found for this ID' });
    }
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});

module.exports = router;
