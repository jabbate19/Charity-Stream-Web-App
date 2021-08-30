const Sequelize = require('sequelize');

const getConnection = () => {
  const {
    MCHOST: host,
    MCDB: database,
    MCUSER: username,
    MCPWRD: password,
  } = process.env;

  const connection = new Sequelize(
    database, username, password,
    {
      host,
      dialect: 'mysql',
      pool: {
        max: 5,
        min: 0,
        idle: 10000,
      },
      typeValidation: true,
    },
  );

  return connection;
};

const testConnection = async () => {
  try {
    await getConnection().authenticate();
    console.log('Connection has been established successfully!');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
  }
};

module.exports = {
  getConnection,
  testConnection,
};
