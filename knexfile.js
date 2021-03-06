const path = require('path')
const dotenv = require('dotenv')

dotenv.config()

module.exports = {
  development: {
    client: "mysql",
    connection: {
      database: process.env.DATABASE_DEVELOPMENT_NAME,
      user: process.env.DATABASE_DEVELOPMENT_USER,
      password: process.env.DATABASE_DEVELOPMENT_PASSWORD,
      port: Number(process.env.DATABASE_DEVELOPMENT_PORT)
    },
    migrations: {
      directory: path.resolve(__dirname, 'src', 'database', 'migrations')
    }
  },

  test: {
    client: "mysql",
    connection: {
      database: process.env.DATABASE_TEST_NAME,
      user: process.env.DATABASE_DEVELOPMENT_USER,
      password: process.env.DATABASE_DEVELOPMENT_PASSWORD,
      port: process.env.DATABASE_DEVELOPMENT_PORT
    },
    migrations: {
      directory: path.resolve(__dirname, 'src', 'database', 'migrations')
    }
  },

  production: {
    client: "mysql",
    connection: {
      host: process.env.DATABASE_HOST,
      database: process.env.DATABASE_NAME,
      user: process.env.DATABASE_USER,
      password: !process.env.DATABASE_PASSWORD ? '' : process.env.DATABASE_PASSWORD,
      port: process.env.DATABASE_PORT,
      connectTimeout: 9000000,
      propagateCreateError: false
    },
    pool: {
      min: 0,
      max: 10,
    },
    sl: {
      rejectUnauthorized: false
    },
    migrations: {
      directory: path.resolve(__dirname, 'src', 'database', 'migrations')
    }
  }
}
