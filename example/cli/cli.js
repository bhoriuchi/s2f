import * as graphql from 'graphql'
import rethinkdbdash from 'rethinkdbdash'
import s2f from '../../src/app'
import { rethinkdb as RethinkDBBackend } from '../../src/backend'
import seedData from '../../src/workflows/index'
import { transform as babel } from 'babel-core'

let options = {
  vm: {
    lockdown: false,
    transform (code, opts) {
      return babel(code, {
        presets: ['es2015', 'stage-2'],
        plugins: ['transform-runtime']
      }).code
    }
  }
}


let backend = new RethinkDBBackend(rethinkdbdash({ silent: true }), graphql, null, options)
let app = s2f(backend)

export function s2fcli () {
  return app.cli()
}

export function s2finstall () {
  return app.install(seedData)
}

export default {
  s2fcli,
  s2finstall
}