const chai = require('chai');
const chaiHttp = require('chai-http');
const jwt = require('jsonwebtoken');

const expect = chai.expect;
chai.use(chaiHttp);

const app = require('../server'); // Asegúrate de ajustar la ruta si el archivo principal del servidor tiene un nombre diferente

describe('Pruebas de la aplicación', () => {
  let token;

  before(async () => {
    // Antes de ejecutar las pruebas, generamos un token de autenticación válido
    const payload = { _id: 'id_de_usuario' }; // Ajusta esto con el ID de un usuario válido
    token = jwt.sign(payload, 'secretkey');
  });

  after(() => {
    // Después de ejecutar las pruebas, cerramos el servidor
    app.close();
  });

  it('GET / debería retornar "Hola a todos"', (done) => {
    chai
      .request(app)
      .get('/')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.text).to.equal('Hola a todos');
        done();
      });
  });

  it('POST /signUp debería crear un nuevo usuario y retornar un token', (done) => {
    chai
      .request(app)
      .post('/signUp')
      .send({ email: 'test@example.com', name: 'testuser', password: 'password' })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('token');
        done();
      });
  });

  it('POST /signIn debería autenticar al usuario y retornar un token', (done) => {
    chai
      .request(app)
      .post('/signIn')
      .send({ name: 'testuser', password: 'password' })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('token');
        done();
      });
  });

  it('POST /paths debería crear un nuevo camino y retornar el objeto creado', (done) => {
    chai
      .request(app)
      .post('/paths')
      .set('Authorization', `Bearer ${token}`)
      .send({
        pathName: 'Camino de prueba',
        userId: 'yagoy90', // Ajusta esto con el ID de un usuario válido
        path: [
          {
            "latitude": 40.712776,
            "longitude": -74.005974
          },
          {
            "latitude": 40.758701,
            "longitude": -73.978380
          },
          {
            "latitude": 40.719574,
            "longitude": -74.042106
          }
        ],
        duration: 100,
        averageSpeed: 10,
        meanAltitude: 50,
        routeStartDay: 1,
        routeStartMonth: 1,
        routeStartYear: 2023,
        shared: true
      })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('pathName').equal('Camino de prueba');
        done();
      });
  });

  it('GET /myPaths debería retornar los caminos que coinciden con los parámetros de consulta', (done) => {
    chai
      .request(app)
      .get('/myPaths')
      .query({ userId: 'id_de_usuario' }) // Ajusta esto con el ID de un usuario válido
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('array');
        done();
      });
  });

  it('GET /social debería retornar los caminos compartidos', (done) => {
    chai
      .request(app)
      .get('/social')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('array');
        done();
      });
  });
});
