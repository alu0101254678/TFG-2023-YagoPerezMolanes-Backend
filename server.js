const express = require("express");
const cors = require("cors");

const app = express();
const User = require("./models/user");
const Path = require("./models/path");
const jwt = require("jsonwebtoken");

// importamos el fichero de conexion con la base de datos
require("./database");
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hola a todos');
});

// creamos un usuario y lo guardamos en la base de datos, el servidor
// devuelve un token que es lo que usara la aplicacion cliente
app.post("/signUp", async (req, res) => {
  const {email, name, password} = req.body;
  const newUser = new User({email: email, name: name, password: password});
  await newUser.save();
  const token = jwt.sign({_id: newUser._id}, "secretkey");
  res.status(200).json({token: token});

  // console.log(newUser);
});

app.post("/signIn", async (req, res) => {
  const {name, password} = req.body;
  const user = await User.findOne({name});
  if (!user) {
    return res.status(401).send("The username doesn't exists");
  }
  if (user.password !== password) {
    return res.status(401).send("Wrong Password");
  }

  const token = jwt.sign({id_: user.id}, "secretkey");
  res.status(200).json({token: token});
});

app.post('/paths', async (req, res) => {
  const { userId, path, duration, averageSpeed, meanAltitude } = req.body;

  try {
    const newPath = new Path({ userId, path, duration, averageSpeed, meanAltitude });
    await newPath.save();
    res.status(200).json(newPath);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
