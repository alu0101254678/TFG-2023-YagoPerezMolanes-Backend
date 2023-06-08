/* eslint-disable linebreak-style */
const mongoose = require('mongoose');

const pathSchema = new mongoose.Schema({
  pathName: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  path: {
    type: [
      {
        latitude: {type: Number, required: true},
        longitude: {type: Number, required: true},
        speed: {type: Number, required: true},
        altitude: {type: Number, required: true},
      },
    ],
    required: true,
  },
  duration: {
    type: Number,
    required: true,
    validate: {
      validator: Number.isInteger,
      message: '{VALUE} no es un número entero',
    },
  },
  averageSpeed: {type: Number, required: true, default: 0},
  meanAltitude: {type: Number, required: true},
  routeStartDay: {
    type: Number,
    required: true,
    validate: {
      validator: Number.isInteger,
      message: '{VALUE} no es un número entero',
    },
  },
  routeStartMonth: {
    type: Number,
    required: true,
    validate: {
      validator: Number.isInteger,
      message: '{VALUE} no es un número entero',
    },
  },
  routeStartYear: {
    type: Number,
    required: true,
    validate: {
      validator: Number.isInteger,
      message: '{VALUE} no es un número entero',
    },
  },
  shared: {type: Boolean, required: true, default: false},
  maxSpeed: {type: Number, required: true},
  minSpeed: {type: Number, required: true},
  maxAltitude: {type: Number, required: true},
  minAltitude: {type: Number, required: true},
}, {
  timestamps: true,
});

module.exports = mongoose.model('Path', pathSchema);
