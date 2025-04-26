const express = require('express');
const router = express.Router();
const UserData = require('../models/UserData');

// POST: Update or insert user data
router.post('/submit', async (req, res) => {
    const { uniqueId, o2 = [], heartRateECG = [], temperature = [], ecgPeak = [] } = req.body;
  
    if (!uniqueId || uniqueId.length !== 10) {
      return res.status(400).json({ error: 'Invalid uniqueId' });
    }
  
    // Ensure inputs are arrays
    const o2Arr = Array.isArray(o2) ? o2 : [o2];
    const hrArr = Array.isArray(heartRateECG) ? heartRateECG : [heartRateECG];
    const tempArr = Array.isArray(temperature) ? temperature : [temperature];
    const peakArr = Array.isArray(ecgPeak) ? ecgPeak : [ecgPeak];
  
    try {
      const userData = await UserData.findOne({ uniqueId });
  
      if (userData) {
        userData.o2.push(...o2Arr);
        userData.heartRateECG.push(...hrArr);
        userData.temperature.push(...tempArr);
        userData.ecgPeak.push(...peakArr);
  
        // Keep only latest 300 values
        userData.o2 = userData.o2.slice(-300);
        userData.heartRateECG = userData.heartRateECG.slice(-300);
        userData.temperature = userData.temperature.slice(-300);
        userData.ecgPeak = userData.ecgPeak.slice(-300);
  
        await userData.save();
        return res.status(200).json({ message: 'Data updated successfully' });
      } else {
        const newEntry = new UserData({
          uniqueId,
          o2: o2Arr,
          heartRateECG: hrArr,
          temperature: tempArr,
          ecgPeak: peakArr,
        });
  
        await newEntry.save();
        return res.status(201).json({ message: 'New data created successfully' });
      }
    } catch (error) {
      return res.status(500).json({ error: 'Server error', details: error.message });
    }
  });
  

// GET: Retrieve data for a specific device using uniqueId
router.get('/:uniqueId', async (req, res) => {
  const { uniqueId } = req.params;

  if (!uniqueId || uniqueId.length !== 10) {
    return res.status(400).json({ error: 'Invalid uniqueId' });
  }

  try {
    const userData = await UserData.findOne({ uniqueId });

    if (!userData) {
      return res.status(404).json({ error: 'Device not found' });
    }

    return res.status(200).json({ data: userData });
  } catch (error) {
    return res.status(500).json({ error: 'Server error', details: error.message });
  }
});

module.exports = router;
