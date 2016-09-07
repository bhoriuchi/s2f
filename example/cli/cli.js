import * as graphql from 'graphql'
import rethinkdbdash from 'rethinkdbdash'
import s2f from '../../src/app'
import { rethinkdb as RethinkDBBackend } from '../../src/backend'
let backend = new RethinkDBBackend(rethinkdbdash({ silent: true }), graphql)
let app = s2f(backend)

export function s2fcli () {
  return app.cli()
}

export function s2finstall () {
  return app.install()
}

export default {
  s2fcli,
  s2finstall
}