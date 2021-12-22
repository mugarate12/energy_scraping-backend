const {
  CPFL_SEARCH
} = require('./../types')

exports.up = function(knex) {
  return knex.schema.createTable(CPFL_SEARCH, (table) => {
    table.increments('id').notNullable()

    table.string('state', 191).unique().notNullable()
    table.string('city', 191).notNullable()
  })
}

exports.down = function(knex) {
  return knex.schema.dropTable(USERS_TABLE_NAME)
}
