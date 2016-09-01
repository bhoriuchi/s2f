import * as graphql from 'graphql'
import rethinkdbdash from 'rethinkdbdash'
import { rethinkdb as RethinkDBBackend } from '../../src/backend'
import S2FApp from '../../src/app'
import S2FInstaller from '../../src/app/install'
let backend = new RethinkDBBackend(rethinkdbdash({ silent: true }), graphql)

export function s2fcli () {
  S2FApp(backend)
}

export function s2finstall () {
  S2FInstaller(backend)
}

export default {
  s2fcli,
  s2finstall
}