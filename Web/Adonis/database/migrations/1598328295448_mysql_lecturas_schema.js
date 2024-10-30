'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class MysqlLecturasSchema extends Schema {
  up () {
    this.create('mysql_lecturas', (table) => {
      table.increments()
      table.float('temperatura')
      table.float('humedad')
      table.float('latitud',[8,5])
      table.float('longitud',[8,5])
      table.timestamps()
    })
  }

  down () {
    this.drop('mysql_lecturas')
  }
}

module.exports = MysqlLecturasSchema
