import { rethinkdb as RethinkDBBackend } from '../index.min' //'../src/backend/index'
import rethinkdbdash from 'rethinkdbdash'
import * as graphql from 'graphql'

let backend = RethinkDBBackend('_s2f', graphql, rethinkdbdash())

backend.cli()