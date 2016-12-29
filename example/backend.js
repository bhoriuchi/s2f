import * as babel from 'babel-core'
import { rethinkdb as RethinkDBBackend } from '../src/backend/index'
import rethinkdbdash from 'rethinkdbdash'
import * as graphql from 'graphql'

let backend = RethinkDBBackend('_yj', graphql, rethinkdbdash(), {
  options: {
    prefix: 'wf_',
    store: 'development',
    vm: {
      lockdown: false,
      parseImports: true,
      transform (code) {
        try {
          return babel.transform(code, {
            presets: ['es2015', 'stage-2'],
            plugins: ['transform-runtime']
          }).code
        } catch (err) {
          return code
        }
      }
    }
  }
}).make()

export default backend