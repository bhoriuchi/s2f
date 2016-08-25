require('babel-register')
var graphql = require('graphql')
var rethinkdbdash = require('rethinkdbdash')
var Backend = require('../src/backend').rethinkdb
var r = rethinkdbdash()
var backend = new Backend(r, graphql)

backend.install().then(function (res) {
  console.log(res)
  console.log('Install complete')
  process.exit()
}).catch(function (err) {
  console.error(err)
  process.exit()
})