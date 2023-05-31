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
  averageSpeed:  { type: Number, required: true, default: 0 },
  meanAltitude: { type: Number, required: true },
  routeStartDay: { type: Number, required: true },
  routeStartMonth: { type: Number, required: true },
  routeStartYear: { type: Number, required: true},
  shared: { type: Boolean, required: true, default: false },
}, {
  timestamps: true,
});

module.exports = mongoose.model("Path", pathSchema);