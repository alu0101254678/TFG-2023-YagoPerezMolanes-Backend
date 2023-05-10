const mongoose = require("mongoose");

const pathSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  path: {
    type: [
      {
        latitude: { type: Number, required: true },
        longitude: { type: Number, required: true }
      }
    ],
    required: true
  },
  duration: { type: Number, required: true },
  averageSpeed:  { type: Number, required: true },
  meanAltitude: { type: Number, required: true },
}, {
  timestamps: true,
});

module.exports = mongoose.model("Path", pathSchema);