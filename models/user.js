import { Schema, model } from "mongoose";

// esquema para el documento de la base de datos
// de mongodb referenciado al objeto usuario

const userSchema = new Schema({
  name: String,
  email: String,
  password: String,
}, {
  // guarda la hora en la que se creo
  timestamps: true,
});

// exporta el modelo creado con el esquema
export default model("User", userSchema);
