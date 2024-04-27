const config = require('config');

module.exports = {
  development: {
    url: config.get('databaseUrl'),
    dialect: "postgres",
  },
  production: {
    url: config.get('databaseUrl'),
    dialect: "postgres",
    ssl: true,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      },
    },
  }
}
