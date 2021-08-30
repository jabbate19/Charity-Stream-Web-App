const Player = require('./player');

const createTables = () => {
  const force = process.env.environment !== 'production';

  Player.sync({ force });
};

module.exports = {
  Player,
  createTables,
};
