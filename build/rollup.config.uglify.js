import babel from 'rollup-plugin-babel'
import uglify from 'rollup-plugin-uglify'

export default {
  entry: 'src/index.js',
  format: 'cjs',
  plugins: [ babel(), uglify() ],
  external: [
    'bluebird',
    'chalk',
    'graphql-factory',
    'graphql-factory-temporal',
    'graphql-factory-types',
    'graphql-obj2arg',
    'lodash',
    'sbx',
    'yellowjacket',
    'graphql-factory-temporal/backend'
  ],
  dest: 'index.min.js'
}