const mongoose = require('mongoose');

const userDataSchema = new mongoose.Schema({
  uniqueId: {
    type: String,
    required: true,
    length: 10
  },
  o2: [Number],
  heartRateECG: [Number],
  temperature: [Number]
}, { timestamps: true });

module.exports = mongoose.model('UserData', userDataSchema);
