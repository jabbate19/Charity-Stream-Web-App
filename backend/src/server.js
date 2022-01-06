require('dotenv').config();
const express = require('express');
const cors = require('cors');
const {
  createItems,
  createPlayer,
  createEffects,
  createMobs,
  getItems,
  getPlayers,
  getEffects,
  getMobs,
  createCheckout,
  getCheckoutStatus,
  disableCheckout,
  disableElement,
  dataCallback,
  getData,
  hook,
} = require('./handlers');
const { getImages } = require('./images');
const { basicAuth } = require('./handlers/authentication');

const app = express();
const port = 8080;

app.use((req, res, next) => {
  if (req.originalUrl === '/webhook') {
    next(); // Do nothing with the body because I need it in a raw state.
  } else {
    cors()(req, res, next);
    express.json()(req, res, next);  // ONLY do express.json() if the received request is NOT a WebHook from Stripe.
  }
});

// Routes that do not require auth
app.get('/items', getItems);
app.get('/players', getPlayers);
app.get('/effects', getEffects);
app.get('/data', getData);
app.get('/mobs', getMobs);
app.get('/images/:type/:image', getImages);
app.post('/checkout', createCheckout);
app.post('/hook', hook);

// This tells node to use auth for the routes below here
app.use(basicAuth);

// Everything below this point should require auth
app.put('/disable/:type/:id', disableElement);
app.put('/disable', disableCheckout);
app.post('/create/items', createItems);
app.post('/create/players', createPlayer);
app.post('/create/effects', createEffects);
app.post('/create/mobs', createMobs);
app.post('/data-callback', dataCallback);

// eslint-disable-next-line no-console
app.listen(port, console.log(`Listening on port at http://localhost:${port}`));
