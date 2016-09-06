import * as graphql from 'graphql'
import rethinkdbdash from 'rethinkdbdash'
import { rethinkdb as RethinkDBBackend } from '../../src/backend'
let backend = new RethinkDBBackend(rethinkdbdash({ silent: true }), graphql)

export function s2fcli () {
  return backend.cli()
}

export function s2finstall () {
  return backend.install()
}

export default {
  s2fcli,
  s2finstall
}