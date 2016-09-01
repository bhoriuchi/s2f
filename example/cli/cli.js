import * as graphql from 'graphql'
import rethinkdbdash from 'rethinkdbdash'
import { rethinkdb as RethinkDBBackend } from '../../src/backend'
import S2FServer from '../../src/server'
import S2FInstall from '../../src/server/install'
let backend = new RethinkDBBackend(rethinkdbdash(), graphql)

export function s2fcli () {
  S2FServer(backend)
}

export function s2finstall () {
  S2FInstall(backend)
}

export default {
  s2fcli,
  s2finstall
}