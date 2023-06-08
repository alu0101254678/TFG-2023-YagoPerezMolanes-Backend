/* eslint-disable linebreak-style */
const express = require('express');
const cors = require('cors');

const app = express();
const User = require('./models/user');
const Path = require('./models/path');
const jwt = require('jsonwebtoken');

// importamos el fichero de conexion con la base de datos
require('./database');
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hola a todos');
});

// creamos un usuario y lo guardamos en la base de datos, el servidor
// devuelve un token que es lo que usara la aplicacion cliente
app.post('/signUp', async (req, res) => {
  const {email, name, password} = req.body;

  const userName = await User.findOne({name});
  const Email = await User.findOne({email});
  if (userName) {
    return res.status(401).send('El nombre de usuario ya está en uso');
  }
  if (Email) {
    return res.status(401).send('El email ya está en uso');
  }

  if (name == '') {
    return res.status(401).send('El campo de nombre de usuario está vacío');
  }

  if (email == '') {
    return res.status(401).send('El campo de email está vacío');
  }

  if (password == '') {
    return res.status(401).send('El campo de contraseña está vacío');
  }

  if (password.length < 4) {
    return res.status(401).send('La contraseña debe tener un mínimo de 4 caracteres');
  } else {
    const newUser = new User({email: email, name: name, password: password});
    await newUser.save();
    const token = jwt.sign({_id: newUser._id}, 'secretkey');
    res.status(200).json({token: token});
  }
  // console.log(newUser);
});


app.post('/signIn', async (req, res) => {
  const {name, password} = req.body;
  const user = await User.findOne({name});
  if (!user) {
    return res.status(401).send('El usuario que ha introducido no existe');
  };
  if (user.password !== password) {
    return res.status(401).send('Contraseña incorrecta');
  }

  const token = jwt.sign({id_: user.id}, 'secretkey');
  res.status(200).json({token: token});
});

app.post('/paths', async (req, res) => {
  const {pathName, userId, path, duration, averageSpeed, meanAltitude, routeStartDay, routeStartMonth, routeStartYear, shared} = req.body;
  const newPath = new Path({pathName, userId, path, duration, averageSpeed, meanAltitude, routeStartDay, routeStartMonth, routeStartYear, shared});

  try {
    await newPath.save();
    res.status(200).json(newPath);
  } catch (err) {
    if (newPath.pathName == '') {
      return res.status(401).send('Debe aportar un nombre a la ruta');
    }

    if (newPath.userId == '') {
      return res.status(401).send('Debe iniciar sesión antes de guardar una ruta');
    }
    return res.status(500).json({error: err.message});
  }
});

app.get('/myPaths', async (req, res) => {
  const {pathName, userId, routeStartDay, routeStartMonth, routeStartYear, duration} = req.query;

  try {
    const query = {};

    if (pathName) {
      query.pathName = pathName;
    }

    if (userId) {
      query.userId = userId;
    }

    if (routeStartDay) {
      if (!Number.isInteger(parseInt(routeStartDay))) {
        return res.status(401).json({error: 'El día de inicio de la ruta debe ser un número entero'});
      }
      query.routeStartDay = routeStartDay;
    }

    if (routeStartMonth) {
      if (!Number.isInteger(parseInt(routeStartMonth))) {
        return res.status(401).json({error: 'El mes de inicio de la ruta debe ser un número entero'});
      }
      query.routeStartMonth = routeStartMonth;
    }

    if (routeStartYear) {
      if (!Number.isInteger(parseInt(routeStartYear))) {
        console.log('pepe');
        return res.status(401).json({error: 'El año de inicio de la ruta debe ser un número entero'});
      }
      query.routeStartYear = routeStartYear;
    }

    if (duration) {
      if (!Number.isInteger(parseInt(duration))) {
        return res.status(401).json({error: 'La duración de la ruta debe ser un número entero'});
      }
      query.duration = {$lte: duration};
    }

    const Paths = await Path.find(query);
    res.status(200).json(Paths);
  } catch (error) {
    console.error(error);
    return res.status(500).json({error: error.message});
  }
});

app.get('/social', async (req, res) => {
  try {
    const query = {};

    query.shared = true;


    const Paths = await Path.find(query);
    res.status(200).json(Paths);
  } catch (error) {
    console.error(error);
    return res.status(500).json({error: error.message});
  }
});


const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});

module.exports = server;
