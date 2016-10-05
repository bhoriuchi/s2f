import babel from 'rollup-plugin-babel'
import uglify from 'rollup-plugin-uglify'

export default {
  entry: 'src/index.js',
  format: 'cjs',
  plugins: [ babel(), uglify() ],
  dest: 'index.min.js'
}