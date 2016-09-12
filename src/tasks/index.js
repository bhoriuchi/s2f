import _ from 'lodash'

import SayHello from './SayHello'

let tasks = [
  SayHello
]

export default _.union.apply(null, tasks)