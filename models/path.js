import { Schema, model } from "mongoose";

const pathSchema = new Schema({
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
});

export default model("Path", pathSchema);