import { rethinkdb as RethinkDBBackend } from '../src/backend/index'
import rethinkdbdash from 'rethinkdbdash'
import * as graphql from 'graphql'

let backend = RethinkDBBackend('_s2f', graphql, rethinkdbdash(), {
  options: {
    prefix: 'wf_'
  }
})

backend.cli()