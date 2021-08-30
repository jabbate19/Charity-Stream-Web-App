const { DataTypes } = require('sequelize');
const { getConnection } = require('../sqlConnection');

const sequelize = getConnection();

const Item = sequelize.define('Item', {
  id: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  price: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  type: {
    type: DataTypes.ENUM('csh', 'blackbaud', 'hogs', 'ehouse', 'sse', 'arthouse', 'rit'),
    allowNull: false,
  },
});

module.exports = Item;
