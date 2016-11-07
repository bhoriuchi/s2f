require('babel-register')
var express = require('express')
var graphqlHTTP = require('express-graphql')
var app = express()

var backend = require('./backend').default
var lib = backend.lib
var schema = lib._definitions.schemas.S2FWorkflow

app.use('/graphql', graphqlHTTP({
  schema: schema,
  graphiql: true
}))

app.listen(4000)
console.log('Server listening on localhost:4000')